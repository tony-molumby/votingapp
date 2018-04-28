import rp from 'request-promise';
import cheerio from 'cheerio';
import locationImport from './../import/location.import';

//Scrapes data from https://eastbayaa.org/meetings?tsml-day=any

exports.scraper = function(url){
    return new Promise((resolve, reject) => {
        rp(url, function(err, resp, body){
            if(err){
                reject(err);
            }
            let $ = cheerio.load(body);
            let numRows = $('#meetings_tbody').find('tr').length;
            let groupName = 'Alchoholics Anonymous', groupAcronym = 'AA';
            let region = "East Bay", state = 'CA';
            let allData = [];
            
            $('tr').each(function(i, row){
                let day, time, meetingName, locationName,
                    address, room, city, zip, county,
                    contact, phone, language, contactUrl, meetingUrl, localWebsite;
                let details = [], notes= [], geo = []; 
                let meetingObj = {};
                
                day = $('td.time span:first-child').eq(i).text().trim();
                time = $('td.time span:last-child').eq(i).text().trim();
                if(time === 'Noon'){
                    time = '12:00 pm';
                }
                city = $('td.region').eq(i).text().trim();
                meetingName = $('td.name').eq(i).text().trim();
                address = $('td.address').eq(i).text().trim();
                locationName = $('td.location').eq(i).text().trim().replace('\\', '');
                meetingUrl = $('td.name a').eq(i).attr('href');
                details = $('td.types').eq(i).text().split(',').map(function(item){
                    return item.trim();
                });

                //hardcoded Items
                localWebsite = 'https://eastbayaa.org/';
                phone = '510-839-8900';
                state = 'CA';
                //specific logic for information which is not consistent on the website vs the locations API.
                if(address === '12260 San Pablo Ave'){
                    city = 'Richmond';
                } else if(address === '1300 Grand Ave' && city === 'Oakland'){
                    city = 'Piedmont';
                } else if(address === '201 Martina St' && city === 'Point Richmond'){
                    city = 'Richmond';
                }
                
                meetingObj = {
                    groupName: groupName,
                    groupAcronym: groupAcronym,
                    day: day,
                    time: time,
                    meetingName: meetingName,
                    room: room,
                    contact: contact,
                    phone: phone,
                    language: language,
                    contactUrl: contactUrl,
                    meetingUrl: meetingUrl,
                    localWebsite: localWebsite,
                    details: details,
                    notes: notes,
                    loc: {
                        locationName: locationName,
                        address: address,
                        region: region,
                        city: city,
                        state: state,
                        zip: zip,
                        county: county,
                        geo: geo
                    }
                }

                if(meetingObj.day.length > 0 && meetingObj.meetingName.length > 0 ){
                    allData.push(meetingObj);
                }
                
            });            
            resolve(allData);
        })
        .catch((err) =>{
            console.log(err);
        })
    })
   
  
}