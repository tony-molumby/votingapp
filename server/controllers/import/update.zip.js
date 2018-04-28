import xml2js from 'xml2js';
import rp from 'request-promise';
import mongoose from './../../connect';

let update = {};

//This function updates the zip code for a meeting given the address, city and state
update.updateZip = (meetingObj) => {
    return new Promise((resolve, reject) => {
        let {address, city, state, zip} = meetingObj.loc;
        let parseString = xml2js.parseString;
        let uspsUrl ='http://production.shippingapis.com/ShippingAPITest.dll?API=Verify&XML=<AddressValidateRequest USERID="';
        uspsUrl += process.env.USPS_USERNAME + '"><Address ID="0"><Address1></Address1><Address2>' + address + '</Address2><City>' + city + '</City><State>' + state + '</State><Zip5></Zip5><Zip4></Zip4></Address></AddressValidateRequest>';

        //check to make sure the meetingObj doesn't already have a zip code
        if(zip === undefined || zip.length !== 5){
            rp(uspsUrl)
            .then((body)=>{
                //change the xml response to json format
                parseString(body, (err, result) => {
                    console.log(result.AddressValidateResponse.Address[0].Error);
                    if(err) {
                        console.log('first error block');
                        console.log('ERROR adding ZIP to ' + address + ' ' + city + ', ' + state +  ' ' + err); 
                    };
                    if(result.AddressValidateResponse.Address[0].Error !== undefined){
                        console.log('2nd error block');
                        reject(console.log('ERROR adding ZIP to ' + address + ' ' + city + ', ' + state));
                    } else {
                        let zipcode = result.AddressValidateResponse.Address[0].Zip5[0];
                        meetingObj.loc.zip = zipcode;
                        console.log(zip + ' added to ' + address + ' ' + city + ', ' + state);
                        console.log(meetingObj);
                    }
                    resolve(meetingObj);
                });
            })
            .catch((err)=>{
                console.log('this catch statement ran');
                reject(err);
            })
        } else {
            console.log('zip for ' + meetingObj.loc.zip + ' already exists, not calling USPS API.')
            resolve(meetingObj);
        }
        
    });
    
};

export default update;