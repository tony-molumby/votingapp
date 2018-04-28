import xml2js from 'xml2js';
import rp from 'request-promise';

let update = {};

//This function takes a meeting object and calls the TAM API to get the geo coords for the specic address, does not require zip code
update.updateGeo = (meetingObj) => {
    return new Promise((resolve, reject) => {
        const url = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress=';
        let {address, city, state, zip, geo} = meetingObj.loc;
        //make sure the meetingObj does not have a geo property
        if(typeof geo === undefined || geo.length !== 2){
            let lat = 0, long = 0, coordArr = [], count = 0;
            let queryString = url + address + '&city=' + city + '&state=' + state + '&apikey=' + process.env.TEXAS_AM_GEOCODING_API_KEY 
            queryString += '&format=json&allowTies=false&tieBreakingStrategy=flipACoin&version=4.01';

            rp(queryString)
                .then((body)=>{
                    body = JSON.parse(body);
                    if(body.hasOwnProperty('OutputGeocodes') && body.OutputGeocodes[0] !== undefined) {
                        lat = body.OutputGeocodes[0].OutputGeocode.Latitude;
                        long = body.OutputGeocodes[0].OutputGeocode.Longitude;
                        coordArr.push(long, lat);
                        console.log('Adding ' + coordArr + ' to ' + address + ' ' + city + ', ' + state);
                    } else  {
                        console.log('COORDINATE ERROR for ' + address + ' ' + city + ', ' + state);
                        console.log(body);
                    }                 
                    
                    meetingObj.loc.geo = coordArr;
                    if(meetingObj.loc.geo.length !== 2){
                        console.log(meetingObj);
                    }
                    resolve(meetingObj); 
                })
                .catch((err)=>{
                    console.log(err);
                });
        } else {
            console.log(address + ' ' + city + ', ' + state + ' already has geo coords, not calling TAM.')
            resolve(meetingObj);
        }
    })
    .catch((err)=>{
        console.log(err);
    });
    
}

export default update;