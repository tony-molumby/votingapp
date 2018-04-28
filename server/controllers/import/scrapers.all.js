// import mongoose from './../../connect';
import models from './../../../models';
import eastbayaa from './../scrapers/east.bay.aa.scraper';
import aa_sf from './../scrapers/aasf.sf.scraper';
import aasf_marin from './../scrapers/aasf.marin.scraper';
import na_sf from './../scrapers/na.sf.scraper';
import saa_ca from './../scrapers/saa.sf.scraper';
import oa from './../scrapers/oa.scraper';
import fs from 'fs';
import dataImport from './data.import';

let {Meeting} = models;
let scrapers = {};

//AA URLS
//const  eastbayaa_url_test = 'https://eastbayaa.org/meetings?tsml-day=any&tsml-region=72&tsml-time=evening';
const eastbayaa_url = 'https://eastbayaa.org/meetings?tsml-day=any';
const aasf_sf_url = 'https://www.aasf.org/meetings?tsml-day=any&tsml-region=235';
const aasf_marin_url = 'https://www.aasf.org/meetings?tsml-day=any&tsml-region=219';

//---AA LOCATION API URLS
const eastbay_api = 'https://eastbayaa.org/wp-admin/admin-ajax.php?action=tsml_locations';
const aasf_sf_api = 'https://aasf.org/wp-admin/admin-ajax.php?action=tsml_locations';
const aasf_marin_api = 'https://aasf.org/wp-admin/admin-ajax.php?action=tsml_locations';

//NA URLS
const na_sf_url = 'https://www.na.org/meetingsearch/text-results.php?country=USA&state=California&city=San%20Francisco&zip=&street=&within=50&day=0&lang=&orderby=distance'

//OA URLS
const oa_url = 'https://oa.org/find-a-meeting/?type=0&country=United%20States&state=CA&sort=ASC&distance=50&lat=37.7717185&longit=-122.44389289999998&zip=94117&limit=500&submit=true';
//const oa_url = 'https://oa.org/find-a-meeting/?type=0&country=United%20States&state=CA&sort=ASC&distance=5&lat=37.7717185&longit=-122.44389289999998&zip=94117&limit=100&submit=true';
//const oa_url = 'https://oa.org/find-a-meeting/?type=0&country=United%20States&state=CA&sort=ASC&distance=5&lat=38.4409697&longit=-122.79716489999998&zip=95401&limit=100&submit=true';

//SAA URLS
const saa_ca_url = 'http://www.bayareasaa.org/meetings.php';


//--------------------AA EastBay-----------------------------------//
scrapers.aaEb = () => {
    return new Promise((resolve, reject) =>{
        dataImport.locApi(eastbay_api)
            .then((done) => {
                console.log('Locations finished saving');  
                eastbayaa.scraper(eastbayaa_url)
                    .then((data)=>{
                        console.log('Data received from scraper');
                        dataImport.loop(data)
                            .then((done) => {
                                resolve(done);
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                        })
                        .catch((err) => {
                            console.log(err);
                        });        
            })
            .catch((err) => {
                console.log(err);
        });
    });
}

//-----------------------------AA SF----------------------------------//
scrapers.aaSf = () => {
    return new Promise((resolve, reject) => {
        dataImport.locApi(aasf_sf_api)
            .then((done) => {
                console.log('Locations finished saving');
                aa_sf.scraper(aasf_sf_url)
                    .then((data)=>{
                        console.log('Data received from scraper');
                        dataImport.loop(data)
                            .then((done) => {
                                resolve(done);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });      
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

//--------------------AA Marin------------------------------------//
scrapers.aaMarin = () => {
    return new Promise((resolve, reject) => {
        dataImport.locApi(aasf_marin_api)
            .then((done) => {
                console.log('Locations finished saving');
                aasf_marin.scraper(aasf_marin_url)
                    .then((data)=>{
                        console.log('Data received from scraper');
                        dataImport.loop(data)
                            .then((done) => {
                                resolve(done);
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                    });    
            })
            .catch((err) => {
                console.log(err);
             });
    });
}

//----------------------------NA Bay Area--------------------------------//
scrapers.naSf = () => {
    return new Promise((resolve, reject) => {
        na_sf.scraper(na_sf_url)
            .then((data)=>{
                console.log('Data received from scraper');
                dataImport.loop(data)
                    .then((done) => {
                        resolve(done);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    })  
}


//------------------------------OA BAY AREA-------------------------------------//
scrapers.oaSf = () => {
    return new Promise((resolve, reject) => {
        oa.scraper(oa_url)
            .then((data)=>{
                console.log('Data received from scraper');
                dataImport.loop(data)
                    .then((done) =>{
                        resolve(done);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    })
}

// //need to work on loop through multiple query strings to get more results as we expand beyond the bay.
//---------------------SAA SF ------------------------------------//
scrapers.saaSf = () => {
    return new Promise((resolve, reject) => {
        saa_ca.scraper(saa_ca_url)
            .then((data)=>{
                console.log('Data received from scraper');
                dataImport.loop(data)
                    .then((done) => {
                        resolve(done);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            });
    })
    
}

export default scrapers;
