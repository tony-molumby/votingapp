import models from './../../../models';
import rp from 'request-promise';
import updateZ from './update.zip';
import updateG from './update.geo';
import acronym from './acronym.import';
import meetingCity from './meeting.city.import';
import locationHelper from './../helpers/location.helper';

let {Location, Meeting, Acronym} = models;
let {updateZip} = updateZ;
let {updateGeo} = updateG;

let dataImport = {};

dataImport.saveMeeting = (meetingObj) => {
    return new Promise((resolve, reject) => {
        let {day, time, address, city, state, meetingName} = meetingObj;
        Meeting
            .findOne({
                day: day, 
                time: time, 
                address: address, 
                city: city, 
                state: state
            })
            .then((meeting) => {
    
                if(meeting){
                    console.log(meetingName + ' at ' + address + ' ' + city + ', ' + state + ' already exists in the collection, not saving');
                    resolve(meetingObj);
                } else {
                    let finalObj = new Meeting({
                        groupName: meetingObj.groupName,
                        groupAcronym: meetingObj.groupAcronym,
                        day: day,
                        time: time,
                        meetingName: meetingObj.meetingName,
                        room: meetingObj.room,
                        details: meetingObj.details,
                        notes: meetingObj.notes,
                        contact: meetingObj.contact,
                        phone: meetingObj.phone,
                        language: meetingObj.language,
                        contactUrl: meetingObj.contactUrl,
                        meetingUrl: meetingObj.meetingUrl,
                        localWebsite: meetingObj.localWebsite,
                        loc : meetingObj.loc
                    });
                    finalObj
                        .save()
                        .then((doc)=>{
                            console.log(doc.meetingName + ' saved to meetings collection.');
                            resolve(doc);
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                }

            })
            .catch((err) => {
                reject(err);
            });
    }); 
};

dataImport.saveLocation = (meetingObj) => {
    return new Promise((resolve, reject) =>{
        locationHelper
            .findOne(meetingObj)
            .then((doc) => {
                if(doc){
                    console.log('Location at ' + doc.locationName + ' found, not saving to Locations collection.')
                    meetingObj.loc = doc;
                    resolve(meetingObj);
                } else {
                    let locationObj = new Location({
                        locationName: meetingObj.locationName,
                        address: meetingObj.address,
                        region: meetingObj.region,
                        city: meetingObj.city,
                        state: meetingObj.state,
                        zip: meetingObj.zip,
                        url: meetingObj.url,
                        notes: meetingObj.notes,
                        county: meetingObj.county,
                        geo: meetingObj.geo
                    });
                    //some locations have 0,0 for geocoords, we don't want those in the locations collection
                    if(locationObj.geo[0] && locationObj.geo[1]){
                        locationObj
                        .save()
                        .then((doc) => {
                            meetingObj.loc = doc;
                            //output the geo coords here to be sure that they were grabbed from the location
                            console.log(doc.locationName + ' with geocoords ' + doc.geo + ' saved to locations collection');
                            resolve(meetingObj);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    } else {
                        console.log('One or more geocoords do not exist for ' + meetingObj.locationName + ' not saving to locations collection.');
                    }
                    
                }
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

// importing meeting data requires first checking to see if the location the meeting is in has already been
// used before.  If the location has never been seen before, grab the geo coords and save it to the location 
// collection.  After that, save the meeting with the _id of the location to the meeting.loc object property.

dataImport.meeting = (meetingObj) =>{
    return new Promise((resolve, reject) =>{
        let locationId = '';
        locationHelper
            .findOne(meetingObj)
            .then((location) => {
                if(location){
                    //if the location is already in the location collection, grab the _id of the document
                    console.log(location.address + ' ' + location.city + ' found, grabbing _id, not saving to locations');
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
    let count = 0, delay = 175;
    console.log(meetings.length + " meetings found.")
    Meeting.collection.drop()
        .then((res) => {
            console.log("meetings collection dropped = " + res);
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
                    acronym.import();
                    meetingCity.import();
                    return;
                }
            }
            run();
        })
    
}

export default dataImport;

// dataImport.meeting.backup = (meetingObj) =>{
//     return new Promise((resolve, reject) =>{
//         let locationId = '';
//         locationHelper
//             .findOne(meetingObj)
//             .then((location) => {
//                 if(location){
//                     //if the location is already in the location collection, grab the _id of the document
//                     console.log(location.address + ' ' + location.city + ' found, grabbing _id, not saving to locations');
//                     meetingObj.loc = location;
//                     dataImport.saveMeeting(meetingObj)
//                     .then((finalMeetingObj) => {
//                         resolve(finalMeetingObj);
//                     });
//                 } else {
//                     //update the zip code from usps
//                     updateZip(meetingObj)
//                         .then((meetingObjZip) => {
//                             //update geoCoords from TAM
//                             updateGeo(meetingObjZip)
//                                 .then((meetingObjGeo) =>{
//                                     //save the location to the locations collection
//                                     dataImport.saveLocation(meetingObjGeo)
//                                         .then((meetingObjLocSaved) =>{
//                                             dataImport.saveMeeting(meetingObjLocSaved)
//                                                 .then((finalMeetingObj) => {
//                                                     resolve(finalMeetingObj);
//                                                 })
//                                                 .catch((err) =>{
//                                                     console.log(err);
//                                                 });
//                                     })
//                                     .catch((err) => {
//                                         console.log(err);
//                                     });
//                                 })
//                                 .catch((saveErr)=>{
//                                     console.log(saveErr);
//                                 });
//                         })
//                         .catch((geoErr) =>{
//                             console.log(geoErr);
//                         });
//                 }
//             })
//             .catch((err) => {
//                 console.log(err);
//             });

//     });
    
// };