import models from './../../../models';

let {Location} = models;
let locationHelper = {};

locationHelper.findOne = (meetingObj) => {
    return new Promise((resolve, reject) =>{
        let {city, state, address, locationName, zip} = meetingObj.loc;
        
        //if any of the address, city, or state are undfined, try to match based on locationName
            Location
                .findOne({
                    locationName: locationName,
                    city: city,
                    state: state
                })
                .then((doc) => { 
                    if(doc) {
                        console.log('Found ' + doc.locationName + ' based on name.')
                        return resolve(doc);
                    } else {
                        //if not found by location name and there is an address present, look up the location by address
                        if(address){
                            Location
                                .findOne({
                                    city: city, 
                                    state: state,
                                    address: address
                                })
                                .then((doc) => { 
                                    if(doc) {
                                        console.log('Found ' + locationName + ' based on address.')
                                        resolve(doc);
                                    } else {
                                        Location
                                            .findOne({
                                                address: address,
                                                zip: zip
                                            })
                                            .then((loc) => {
                                                if(loc) {
                                                    console.log('Found ' + locationName + ' based on address + zip code.')
                                                    resolve(loc);
                                                } else {
                                                    Location
                                                        .findOne({
                                                            locationName: locationName,
                                                            address: address
                                                        })
                                                        .then((locDoc) => {
                                                            if(locDoc){
                                                                console.log('Found ' + locationName + ' based on locationName + address.')
                                                                resolve(locDoc);
                                                            } else {
                                                                console.log('No for location for ' + address + ', ' + city + ', we have tried everything, returning null.')
                                                                resolve(null);
                                                            }
                                                        })
                                                    
                                                }
                                                
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            })
                                        
                                    }
                                })
                                .catch((err) =>{
                                    console.log('There was an error trying to find ' + address + ' ' + city + ' , ' + state + ' by address.');
                                    reject(err);
                                })
                        } else {
                            console.log('No location found for ' + locationName + ' ' + city + ' ' + state + ' by locationName and no address is present, returning null');
                            resolve(null);
                        }
                    }
                })
                .catch((err) =>{
                    console.log('There was an error trying to find ' + address + ' ' + city + ' , ' + state + ' by locationName.');
                    reject(err);
                })
            

        
        })
}

export default locationHelper;