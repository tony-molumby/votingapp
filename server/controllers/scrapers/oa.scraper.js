const request = require('request');
const cheerio = require('cheerio');
const oaHelper = require('../helpers/oa.helper');

cheerio.prototype.even = function(){
    var evens = [];
    this.each(function(index, item){
        if(index % 2 == 0){
            evens.push(item);
        }
    });
    return cheerio(evens);
};

cheerio.prototype.odd = function(){
    var odds = [];
    this.each(function(index, item){
        if(index % 2 == 1){
            odds.push(item);
        }
    });
    return cheerio(odds);
};

//Scrapes data from https://oa.org/find-a-meeting/?type=0&country=United%20States&state=CA&sort=ASC&distance=50&lat=37.7717185&longit=-122.44389289999998&zip=94117&limit=500&submit=true

exports.scraper = function(url){
    return new Promise(function(resolve, reject){
        request(url, function(err, resp, body){
            if(err){
                reject(err);
            }
            let $ = cheerio.load(body);
            let numRows = $('#results').find('.meeting').length;
            let groupName = 'Overeaters Anonymous', groupAcronym = 'OA';
            let allData = [];
            
            let meetingObj = {};
            $('.meeting').each(function(i, row){
                let day, time, meetingName, locationName,
                address, room, region, city, state, zip, county,
                contact, phone, language, contactUrl, meetingUrl, localWebsite,
                zipIndex, detail;
                let details = [], notes =[], geo = [], addressArr = [], cityStateArr = []; 
               
                day = $('p:first-child','div.col-md-4').even().eq(i).text().trim();
                time = $('p:nth-child(2)', 'div.col-md-4').even().eq(i).text().trim();
                
                //handle locationName
                locationName = $('p:nth-child(3)', 'div.col-md-4')
                    .even()
                    .eq(i)
                    .text()
                    .trim()
                    .replace('&apos;', "'");
                let dashIdx = locationName.indexOf(' - ');
                if(dashIdx > 0){
                    meetingName = locationName.slice(dashIdx + 3);
                    locationName = locationName.slice(0, dashIdx);
                }
                
                //handle address
                address = String($('p:nth-child(4)', 'div.col-md-4').even().eq(i).html());
                address = address.replace(/\t|\n|<strong>|<\/strong>/g, '');
                address = address.slice(4, address.length - 4);
                addressArr = address.split('<br>');
                address = addressArr[0].trim();
                address = address.replace('&amp;', '&');

                //handle city state and room, lots of inconsistencies here
                if(addressArr.length < 3){
                    address = $('p:nth-child(4)', 'div.col-md-4')
                        .even()
                        .eq(i)
                        .text()
                        .replace(/\t|\n|<strong>|<\/strong>/g, '')
                        .trim();
                    cityStateArr = String($('p:nth-child(6)', 'div.col-md-4').even().eq(i).html());
                    cityStateArr = cityStateArr.replace(/\t|\n|<strong>|<\/strong>/g, '');
                    cityStateArr = cityStateArr.split('<br>');
                    cityStateArr = cityStateArr[0].split(',');
                } else if(addressArr.length === 3){
                    cityStateArr = addressArr[1].split(',');
                } else if (addressArr.length === 4){
                    room = String(addressArr[1]).trim().replace(/&amp;/, '&');
                    if(room === 'Meeting Room'){
                        room = '';
                    }
                    if(room.length > 0){
                        notes.push(room);
                    }
                    room = undefined;
                    cityStateArr = addressArr[2].split(',');
                }

                zipIndex = String(cityStateArr[1]).search(/[0-9]{5}/);
                state = String(cityStateArr[1]).slice(0, zipIndex).trim();
                zip = String(cityStateArr[1]).slice(zipIndex, zipIndex + 5).trim();
                city = String(cityStateArr[0]).trim();
                localWebsite = String($('.meeting-detail .col-md-12 p:nth-child(9) a').attr('href'));
                
                //region grabs the wrong data for the supplied url
                //region = $('.meeting-detail .col-md-12 p:nth-child(7)').eq(i).text();
                //let colIdx = region.indexOf(':');
                //region = region.slice(colIdx + 2).trim();
                
                //to make up for inconsistencies in the number of p elements on the even side
                //when the address is in a different p element than the city and state
                //this will need to be refactored as it completely depends on the URL which is being scraped.
                if(i < 61){
                    contact = oaHelper.e($, 5, i);
                    detail = oaHelper.o($, 5, i);
                    if(detail.length > 2){
                        details.push(detail);
                    }
                } else {
                    contact = oaHelper.o($, 5, i);
                    detail = oaHelper.e($, 5, i);
                    if(detail.length > 2){
                        details.push(detail);
                    }
                    
                }
                phone = oaHelper.e($, 6, i);

                if(addressArr.length < 3){
                    contact = oaHelper.e($, 7, i);
                }
                
                
                
                language = oaHelper.o($, 4, i);

                //push special topic to details array
                detail = oaHelper.o($, 2, i);
                if(detail.length > 2){
                    detail = detail.split(',').forEach(function(item){
                        if(detail.length > 1){
                            details.push(item.trim());
                        }
                    })
                }
                // //push special focus to details array
                detail = oaHelper.o($, 3, i);
                if(detail.length > 2){
                    details.push(detail);
                }
                // //push open/closed to details array
                
                // //add additional notes
                let additionalNotes = oaHelper.o($, 6, i);
                if(additionalNotes.length > 1){
                    notes.push(additionalNotes);
                }
            
                //site specific logic for inconsistent data
                if(address === '45 Castro' || address === '45 Castro St'){
                    address = '45 Castro St';
                    room = 'Level B, Room B1';
                }

                if(locationName === 'location'){
                    locationName = '';
                }

                if(address === '4539 Occidental Rd'){
                    locationName = 'Earle Baum Center';
                }

                if(contact === 'Tina' && locationName === 'Liberty Church'){
                    phone = '323-696-2577';
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
                  };

                if(meetingObj.day.length > 0 ){
                    allData.push(meetingObj);
                }
                
            });         
            resolve(allData);
        })
    })
  
}