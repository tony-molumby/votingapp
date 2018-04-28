import rp from 'request-promise';
import dataImport from './data.import';
import updateZ from './update.zip';

let {updateZip} = updateZ;
let location = {};

location.import = (url) => {
    return new Promise((resolve, reject) =>{
        let allData = [];
        rp(url)
        .then((locations) => {
            locations = JSON.parse(locations);
            for(let i = 0; i < locations.length; i++){
                let { 
                    value, 
                    formatted_address, 
                    latitude, 
                    longitude, 
                    region, 
                    notes, 
                    url 
                } = locations[i];
                let locObj = {};
                let zipArr = [];
                let address, city, state, zip;
                formatted_address = formatted_address.split(',');
                //many times the notes property is just an empty string.
                if(notes.length < 1){
                    notes = undefined;
                }
            
                if(formatted_address.length === 4 || formatted_address.length === 3){
                    
                    //sometimes the street address is missing from the location
                    if(formatted_address.length === 4) {
                        zipArr = formatted_address[2].split(' ');
                        address = formatted_address[0].trim();
                        city = formatted_address[1].trim();
                        state = zipArr[1].trim();
                        zip = zipArr[2].trim();
                    } else if(formatted_address.length === 3 && formatted_address[2] === ' USA') {
                        city = formatted_address[0].trim();
                        state = formatted_address[1].trim();
                        address = 'Check meeting page';
                    } else if(formatted_address.length === 3){
                        address = formatted_address[0].trim();
                        city = formatted_address[1].trim();
                        state = formatted_address[2].trim();
                    } else {
                        console.log("ERROR this ran for " + value + " because its address was not formatted correctly." )
                    }

                    locObj.loc = {
                        locationName: value ,
                        address: address,
                        region: region,
                        city: city,
                        state: state,
                        zip: zip,
                        url: url,
                        notes: notes,
                        geo: [longitude, latitude]
                    }

                    //make sure the location has a city and has geo coords, if not don't save it
                    if(locObj.loc.city.length > 0 && locObj.loc.geo[0] && locObj.loc.geo[1]){
                        //if the location doesn't have a zip code but has a valid address, update the zip
                        if(locObj.loc.zip === undefined && locObj.loc.address !== 'Check meeting page'){
                            updateZip(locObj)
                                .then((locObjZip) => {
                                    allData.push(locObjZip);
                                })
                        } else {
                            allData.push(locObj);
                        }
                    } else {
                        console.log('Something went wrong, the city or geocoords for: ' + value + ' are not defined');
                    }

                } else {
                    console.log('Address array was not 3 or 4 items in length for: ' + value + ' not pushing to allData array.'); 
                } 
            }
            console.log(allData.length + ' locations found.');
            resolve(allData);
        })
        .catch((err)=>{
            console.log(err);
        })
    })
   
}

export default location;