import rp from 'request-promise';
import mongoose from 'mongoose';
import models from './../../../models'

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/step0',{
    useMongoClient: true
}, function(err){
    if(err) return err;
    console.log('Connected to mongodb');
});

const {Zip, City} = models;
let zipcode = {};


//import zip codes for specific cities from the api below, then save them to the mongo database
zipcode.import = (state, city) => {
    
    let url = 'http://api.zippopotam.us/us/' + state + '/' + city;

    rp(url)
        .then((body) => {
            
            body = JSON.parse(body);
            //each request may bring back multiple zip codes for each city designated as places
            body.places.forEach((place) => {
                
                let zipObj = {};
                let zip = place['post code'];
                //check if the zipcode is of valid length
                if(zip.length === 5){

                    zipObj = {
                        city: city,
                        state: state,
                        zip: zip,
                    }
                    
                    Zip.findOne({zip: zip})
                        .then((doc)=>{
                            if(!doc){
                                Zip.create(zipObj)
                                    .then((res)=>{
                                        console.log(res.zip + " added to the zips collection.")
                                        console.log(res);
                                    })
                                    .catch((err)=>{
                                        console.log(err);
                                    })
                            } else {
                                console.log(zip + ' already exists in the database, not saving.');
                            }
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                } else {
                    console.log(city + ',' + state + ' did not have a zip code 5 characters long.');
                }
                
            });  
        })
        .catch((err)=>{
            console.log(err);
        })  
}

zipcode.importLoop = () => {
    //for known issues with city names / zip overlap see the productbacklog.xlsx
    //may need to refactor this to reduce zip code api calls, perhaps add an array of zip codes to
    //the cities collection
    City
        .find()
        .then((cities)=>{
            cities.forEach((doc) =>{
                let {city, state} = doc;
                    if(city.length > 1 && state.length === 2){
                        zipcode.import(state, city);
                    } else {
                        console.log("City and State did not meet length requirements");
                    }
            });
        })
        .catch((err)=>{
            console.log(err);
        });
}

//gets the zip codes of a city and the geo coords of the center point of those zip codes
zipcode.geocoding = (city, state, zip, _id) => {
    let url = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?city=';
    url = url + city + '&state=' + state + '&zip=' + zip + '&apikey=' + process.env.TEXAS_AM_GEOCODING_API_KEY + '&format=json&notStore=false&version=4.01';
    let coordArr = [];
    
    rp(url)
        .then((body) => {
            body = JSON.parse(body);
            let lat = body.OutputGeocodes[0].OutputGeocode.Latitude;
            let long = body.OutputGeocodes[0].OutputGeocode.Longitude;
            coordArr.push(long, lat); //am I sure this is the correct order?  Google doesn't like long then lat

            Zip.find({_id: _id})
                .then((doc) => {
                    console.log(doc);
                    if(doc && (doc.geo === undefined || doc.geo.length !== 2)){
                        Zip
                            .update(
                                {_id: _id},
                                {$set: {geo: coordArr}}
                        )
                            .then((res)=>{
                                console.log(res);
                        })
                            .catch((err)=>{
                                console.log(err);
                        })
                    } else {
                        console.log('No document found or document already has geo coords');
                    }
                })
                .catch((err) => {
                    console.log(err);
                }); 
        })
        .catch((err)=>{
            console.log(err);
        });

}

zipcode.geocodingLoop = () => {
    
    Zip
        .find({geo: {$exists : false}})
        .then((zips)=>{
            //TAMs API doesn't like it when you hammer on it fast, slowing it down with setTimeout and a recursive function
            let count = 0, delay = 250;
            
            let run = () => {
                if(count < zips.length){
                    let {city, state, zip, geo, _id} = zips[count];
                    if(geo === undefined || geo.length !== 2){
                        if(state.length === 2 && zip.length === 5){
                            zipcode.geocoding(city, state, zip, _id);
                        } else {
                            console.log(city + ' ' + zip + ' does not meet either state or zip code length requirements.');
                        }
                    } else {
                        console.log(zip + ' already has geo coords');
                    }
                    count++;
                    setTimeout(run, delay);
                } else {
                    console.log("Finished looping through items without geo coords.  Finishing.")
                    return;
                }
                
            }
            run();
        })
        .catch((err) => {
            console.log(err);
        })
}



zipcode.geocodingLoop();

export default zipcode;

