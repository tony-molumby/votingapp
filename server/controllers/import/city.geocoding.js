import rp from 'request-promise';
import csvParser from 'csv-parse';
import fs from 'fs';
import models from './../../../models';
import mongoose from 'mongoose';

let city = {};
let City = models.City;

mongoose.Promise = global.Promise;

//db connection
mongoose.connect('mongodb://localhost:27017/step0',{
    useMongoClient: true
}, function(err){
    if(err) return err;
    console.log('Connected to mongodb');
});

//Adds cities to the cities collection, ALREADY DONE
city.import = () => {
    let allData = [], state = 'CA';
    //cities.csv contains all california cities
    fs.readFile('./data/cities.csv', {
        encoding: 'utf-8'
    }, (err, data) => {
        if(err) throw err;
        //turn the csv in to an array
        csvParser(data, {
            delimiter: ','
        }, (err, data) => {
            if(err) throw err;
            data.forEach((doc)=>{
                let cityObj = new City({city: doc[0], state: state});
                cityObj
                    .save()
                    .then((err, data) => {
                    if(err) throw err;
                    console.log("Saved: " + data.city);
                });
                
            });
            console.log(allData); 
        });
    });
          
}

//update the central point geoCoordinates of cities in the database
city.geocoding = () => {
    const url = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    City.find()
        .then((cities) => {
            cities.forEach((doc) => {
                let {city, state, _id, geo} = doc;
                //only call the API if there is no geocoords for a particular city, API calls = $$
                if(geo === undefined || geo.length !== 2){
                    let coordArr = [];
                    let queryString = url + 'city=' + city + '&state=' + state 
                    queryString = queryString + '&apikey=' + process.env.TEXAS_AM_GEOCODING_API_KEY + '&format=json&version=4.01';

                    rp(queryString)
                        .then((body) => {
                            body = JSON.parse(body);
                            let lat = body.OutputGeocodes[0].OutputGeocode.Latitude;
                            let long = body.OutputGeocodes[0].OutputGeocode.Longitude;
                            coordArr.push(long, lat);
                            console.log(coordArr);
                            
                            City
                                .update(
                                    {_id: _id},
                                    {$set: {geo: coordArr }}
                                )
                                .then((data) => {
                                    console.log(city + " successfully updated!");
                                })
                                .catch((err) =>{
                                    console.log(err);
                                })

                        })
                        .catch((err) => {
                            console.log(err);
                        }) 
                    
                } else {
                    console.log(city + ' already has central point geocoordinates');
                }
                
            });// end forEach

    })
    .catch((err) => {
        console.log(err);
    });
}

city.geocoding();

export default city;



