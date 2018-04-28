import models from './../../../models';
import rp from 'request-promise';
import updateZ from './update.zip';
import updateG from './update.geo';
import acronym from './acronym.import';
import meetingCity from './meeting.city.import';
import locationHelper from './../helpers/location.helper';
import meetingHelper from './../helpers/meeting.helper';
import loc from './location.import';

let {Location, Meeting, Acronym} = models;
let {updateZip} = updateZ;
let {updateGeo} = updateG;

let dataImport = {};

dataImport.saveMeeting = (meetingObj) => {
    return new Promise((resolve, reject) => {
        //some locations have notes associated with the location
        //since the locations database will be static,
        //notes must be associated with the meeting and not the location
        if(meetingObj.loc.hasOwnProperty('notes')){
            meetingObj.notes.push(meetingObj.loc.notes);
            delete meetingObj.loc.notes;
            //sometimes notes are an empty string
            if(meetingObj.notes.length < 1){
                meetingObj.notes = undefined;
            }
        }
        meetingObj = new Meeting(meetingObj);
        meetingObj
            .save()
            .then((doc)=>{
                console.log(doc.meetingName + ' saved to meetings collection.');
                resolve(doc);
            })
            .catch((err)=>{
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    }); 

};

dataImport.saveLocation = (meetingObj) => {
    return new Promise((resolve, reject) => {
        
        let locationObj = new Location(meetingObj.loc);
        //some locations have 0,0 for geocoords, we don't want those in the locations collection
        if(locationObj.geo && locationObj.geo.length === 2 && locationObj.geo[0] !== 0 && locationObj.geo[1] !== 0){
            locationObj
            .save()
            .then((doc) => {
                meetingObj.loc = doc;
                //output the geo coords here to be sure that they were grabbed from the location
                console.log(doc.locationName + ' with geocoords ' + doc.geo + ' saved to locations collection');
                //use this meeting object only if contiuing with saving to the meetings collection
                resolve(meetingObj);
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('One or more geocoords do not exist for ' + meetingObj.loc.locationName);  
        }  
    })
    .catch((err) => {
        console.log(err);
    });

};

// importing meeting data requires first checking to see if the location the meeting is in has already been
// used before.  If the location has never been seen before, grab the geo coords and save it to the location 
// collection.  After that, save the meeting with the _id of the location to the meeting.loc object property.

dataImport.meeting = (meetingObj) =>{
    return new Promise((resolve, reject) =>{
        locationHelper
            .findOne(meetingObj)
            .then((location) => {
                if(location){
                    //if the location is already in the location collection, grab the _id of the document
                    console.log(location.locationName + ' ' + location.city + ' found, grabbing _id, not saving to locations collection.');
                    meetingObj.loc = location;
                    dataImport.saveMeeting(meetingObj)
                        .then((finalMeetingObj) => {
                            resolve(finalMeetingObj);
                        });
                } else {
                    //update the zip code from usps
                    updateZip(meetingObj)
                        .then((meetingObjZip) => {
                            //update geoCoords from TAM
                            updateGeo(meetingObjZip)
                                .then((meetingObjGeo) =>{
                                    //save the location to the locations collection
                                    dataImport.saveLocation(meetingObjGeo)
                                        .then((meetingObjLocSaved) =>{
                                            dataImport.saveMeeting(meetingObjLocSaved)
                                                .then((finalMeetingObj) => {
                                                    resolve(finalMeetingObj);
                                                })
                                                .catch((err) =>{
                                                    console.log(err);
                                                });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                                })
                                .catch((saveErr)=>{
                                    console.log(saveErr);
                                });
                        })
                        .catch((geoErr) =>{
                            console.log(geoErr);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });

    });
    
};

//loops through the data coming from scrapers while putting a delay on the loop
//looping too fast can cause the TAM API to throw connection refused errors
dataImport.loop = (meetings) => {
    return new Promise((resolve, reject) => {
        let count = 0, delay = 175;
        console.log(meetings.length + " meetings found.")
        let run = () => {
            if(count < meetings.length){
                dataImport.meeting(meetings[count])
                    .then((finalMeetingObj) => {
                        count++;
                        setTimeout(run, delay);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log('Finished importing ' + count + ' meetings');
                resolve('done');
                // acronym.import();
                // meetingCity.import();
                return;
            }
        }
        run();
    });
    
}

//this function grabs all the locations from an API endpoint, checks if the location exists in the database
//and saves the location if it does not exist.  It must be run before scraping meeting data from a website
//which coorsponds to the location API.

dataImport.locApi = (url) => {
    return new Promise((resolve, reject) => {
        loc
            .import(url)
            .then((allLocations) => {
                let count = 0;
                let run = () => {
                    if(count < allLocations.length){
                        locationHelper.findOne(allLocations[count])
                        .then((loc) => {
                            if(!loc){
                                dataImport.saveLocation(allLocations[count]);
                            } else {
                                
                            }
                            count++;
                            run();
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    } else {
                        return resolve('done');
                    };
                    
                };        
                run();
            })
            .catch((err) => {
                console.log(err);
            })
    })

}

export default dataImport;