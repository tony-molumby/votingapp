const request = require('request');
const cheerio = require('cheerio');

//scrapes data from SF SAA website http://www.bayareasaa.org/meetings.php?p=sf
//https://saa-recovery.org/Meetings/UnitedStates/meeting.php?state=CA
exports.scraper = function(url){
    return new Promise(function(resolve, reject){
        request(url, function(err, resp, body){
            if(err){
                reject(err);
            }
            let $ = cheerio.load(body);
            let days = [
                'Sunday', 'Monday', 'Tuesday', 
                'Wednesday', 'Thursday', 'Friday', 
                'Saturday', 'Sunday'
            ]
            let allData = [];
            let groupName = 'Sex Addicts Anonymous', groupAcronym = 'SAA';
            let day = 'Monday';
            let previousTimeOfDay = 'am', timeOfDay = 'am', j = 0;
            $('.meetings tbody tr').each(function(i, item){
                let time, meetingName, locationName,
                address, room, region, city, state, zip, county,
                contact, phone, accessCode, language, contactUrl, meetingUrl, 
                localWebsite, additionalDetails;
                let details = [], notes =[], geo = []; 
                let id, type;
                let meetingObj = {};
                localWebsite = 'http://www.bayareasaa.org/';             
                
                type = $('tr td:nth-child(2) nobr').eq(i).text();

                
                time = $('tr td:nth-child(1) nobr').eq(i).text();
                let dashIdx = time.indexOf('-');
                time = time.slice(0, dashIdx - 1).toLowerCase();

                //the days of the week are not displayed on each table row
                //this code looks for changes in am and pm in the time and
                //increments the day of the week based on that change.
                //This is assuming the results on the page are always sorted by 
                //day then time.
                let len = time.length - 2;
                timeOfDay = time.slice(len, time.length);
                if(previousTimeOfDay === 'pm' && timeOfDay === 'am'){
                    j++;
                }
                previousTimeOfDay = timeOfDay;
                day = days[j];
                
                meetingName = $('tr td:nth-child(3) strong').eq(i).text();
                //start pushing information to the details array
                let detailsString = $('tr td:nth-child(3)').eq(i).text();
                let lBracketIdx = detailsString.indexOf('[');
                let rBracketIdx = detailsString.indexOf(']');
                detailsString = detailsString.slice(lBracketIdx + 1, rBracketIdx).split('/');
                detailsString.forEach((item) =>{
                    details.push(item.trim());
                });
               
                //logic specific for tele and online meetings vs in-person meetings
                if(type.toLowerCase() === 'telemeeting'){
                    locationName = 'TeleMeeting';
                    meetingUrl = $('tr td:nth-child(3) p a').eq(i).attr('href');
                    let phoneInfo = $('tr td:nth-child(3) p:nth-child(2)').eq(i).text();
                    let accessIdx = phoneInfo.indexOf('Access');
                    phone = phoneInfo.slice(0, accessIdx - 1).trim();
                    if(phone.search(/[0-9]{4}/) === -1){
                        phone = undefined;
                    }

                    accessCode = phoneInfo.match(/[0-9]{6,9}/);
                    if(accessCode){
                        accessCode = "Access Code: " + accessCode[0];
                        notes.push(accessCode);
                    }

                    additionalDetails = $('tr td:nth-child(3) p:nth-child(3)').eq(i).text().replace(/(\n|\t|\r)/gm, '');
                    if(additionalDetails){
                        if(additionalDetails.indexOf('/') > -1){
                            additionalDetails = additionalDetails.split('/');
                            additionalDetails.forEach((item) =>{
                                notes.push(item.trim());
                            })
                        } else {
                            notes.push(additionalDetails.trim());
                        }
                    }
                    
                }else if(type.toLowerCase() == 'online'){
                    locationName = 'Online';
                    meetingUrl = $('tr td:nth-child(3) p a').eq(i).attr('href');
                    additionalDetails = $('tr td:nth-child(3) p:nth-child(3)').eq(i).text();
                 
                    if(additionalDetails){
                        details.push(additionalDetails.trim());
                    }
                } else { //for all meetings which are in-person and have addresses
                    let stateZipArr = [];
                    let detailsArr = $('tr td:nth-child(3) p:nth-child(2)')
                        .eq(i)
                        .text()
                        .replace(/(\n|\t|\r)/gm, '');
                    detailsArr = detailsArr.split('•');
                  
                    if(detailsArr.length === 3){
                        detailsArr[2] = detailsArr[2].replace('map', '');
                        locationName = detailsArr[0].trim();
                        let addressArr = detailsArr[1].split(',');
                        address = addressArr[0].trim();
                        if(address.indexOf('(') > -1){
                            address = address.slice(0, address.indexOf('('));
                        }
                        
                        //sometimes the room number is included here, instead of where it normally is...
                        if(addressArr.length === 4){
                            notes.push(addressArr[1].trim());
                            city = addressArr[2].trim();
                            stateZipArr = addressArr[3].trim();
                        } else if(addressArr.length === 3) {
                            city = addressArr[1].trim();
                            stateZipArr = addressArr[2].trim();
                        } 

                        stateZipArr = stateZipArr.split(' ');
                        state = stateZipArr[0].trim();
                        zip = stateZipArr[1].trim();
                        if(detailsArr[2].length > 2){
                            notes.push(detailsArr[2].trim());
                        }
                    } else if(detailsArr.length === 2) {
                        
                         //sometimes the address doesn't have bullets to separate the sections
                         if(detailsArr[0].indexOf(',') > -1){
                            let addArr = detailsArr[0].split(',');
                            address = addArr[0].trim();
                            city = addArr[1].trim();
                            stateZipArr = addArr[2].trim();

                            stateZipArr = stateZipArr.split(' ');
                            state = stateZipArr[0].trim();
                            zip = stateZipArr[1].trim();
                        } else {
                             //one record just has the city with no other information
                            city = detailsArr[0].trim();
                            
                            if(city === 'San Ramon'){
                                zip = '94582';
                                state = 'CA';
                                address = 'See Meeting Notes'
                            }
                        }
                        notes.push(detailsArr[1].replace('map', '').trim());
                }
            };
 
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
                  };

                if(meetingObj.hasOwnProperty("day") && meetingObj.day.length > 0 
                    && meetingObj.hasOwnProperty("time") && meetingObj.time.length > 5
                    && meetingObj.loc.locationName !== "TeleMeeting" && meetingObj.loc.locationName !== "Online"){
                    allData.push(meetingObj);
                }
                });
                //console.log(allData);
                resolve(allData);
            });
        })
}