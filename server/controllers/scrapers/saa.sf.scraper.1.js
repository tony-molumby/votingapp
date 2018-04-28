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
            let allData = [];
            let groupName = 'Sex Addicts Anonymous', groupAcronym = 'SAA';
            $('.even,.odd', '#meeting').each(function(i, item){
                let day, time, meetingName, locationName,
                address, room, region, city, state, zip, county,
                contact, phone, language, contactUrl, meetingUrl, localWebsite;
                let details = [], notes =[], geo = [], colArr = []; 
                let id, type;
                let meetingObj = {};
                localWebsite = 'http://www.bayareasaa.org/';
                
                colArr = String($('.even,.odd')
                    .eq(i)
                    .html())
                    .replace(/\t|\n|<b>|<\/b>|<td>/g, '')
                    .split(/<\/td>|<br>|<br \/>/g);
                    console.log(colArr);
                //day[0]
                day = colArr[0];
                //time[1]
                time = colArr[1];
                //city[2]
                city = colArr[2];
                //state, country[3]
                state = String(colArr[3]).slice(0,2);
                //meetingName[4]
                meetingName = colArr[4].replace(/&apos;/, "'").replace(/&amp;/, '&');
                //locationName[5] or does not exist
                //address[6] or room[6]
                if(colArr[5].search(/[0-9]/) === 0){
                    address = colArr[5];
                    notes = colArr[6].replace(/&apos;/, "'").replace(/&amp;/, '&');
                } else if(colArr[6].search(/[0-9]/) === 0){
                    address = colArr[6];
                    notes = colArr[7].replace(/&apos;/, "'").replace(/&amp;/, '&');
                } else {
                    room = colArr[6];
                    address = colArr[7];
                    notes = colArr[8].replace(/&apos;/, "'").replace(/&amp;/, '&');
                }
                details.push(colArr[colArr.length - 5]);
                details.push(colArr[colArr.length - 3]);
                           
                //still need to loop through colArr and grab "Info Line:" and "Local Website:"         
                contactUrl = 'https://saa-recovery.org/Meetings/UnitedStates/' + $("[href*='meetingID']").eq(i).attr('href');

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

                if(meetingObj.hasOwnProperty("day") && meetingObj.day.length > 0){
                    allData.push(meetingObj);
                }
                });
                //console.log(addData);
                //resolve(allData);
            });
        })
}