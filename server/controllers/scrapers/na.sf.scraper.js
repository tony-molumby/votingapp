const request = require('request');
const cheerio = require('cheerio');

//Scrapes data from https://www.na.org/meetingsearch/text-results.php?country=USA&state=California&city=San%20Francisco&zip=&street=&within=50&day=0&lang=&orderby=distance

exports.scraper = function(url){
    return new Promise(function(resolve, reject){
        request(url, function(err, resp, body){
          if(err){
              reject(err);
          }
          let $ = cheerio.load(body);
          let numRows = $('tbody').find('tr').length;
          
          let allData = [];

          //hardcoded items
          let groupName = 'Narcotics Anonymous', groupAcronym = 'NA';
          let state = 'CA';
          let localWebsite = 'https://www.na.org/meetingsearch/';
          
        
          $('tr').each(function(i, obj){
            let day, time, meetingName, locationName,
              address, room, region, city, zip, county,
              contact, phone, language, contactUrl, meetingUrl;
            let details = [], notes =[], geo = [], locationArr = [], meetingObj = {},
            cityStateArr = [];            

            day = $('tr td:nth-child(2)').eq(i).text();
            let mapIdx = day.indexOf('Map');
            day = day.slice(0, mapIdx); 
            
            time = $('tr td:nth-child(3)').eq(i).text();
            let parenIdx = time.indexOf('(');
            if(parenIdx > 0){
              time = time.slice(0, parenIdx - 1);
            }
           
            locationArr = String($('tr td:nth-child(1)').eq(i).html());
            //sometimes the HTML has self closing tags
            if(locationArr.indexOf('<br>') !== -1){
              locationArr = locationArr.split('<br>');
            } else {
              locationArr = locationArr.split('<br />');
            }

            //sometimes the location doesn't have a name so the 
            //heading string starts with the street address
            let notesString;
            if(locationArr[0].search(/[0-9]/) === 0){
              address = locationArr[0].trim();
              cityStateArr = String(locationArr[1]).split(',')
              notesString = locationArr[2];
            } else {
              locationName = locationArr[0];
              address = locationArr[1];
              cityStateArr = String(locationArr[2]).split(',');
              notesString = locationArr[3];
            }

            //parse the zip from the city and state array
            if(cityStateArr && cityStateArr.length > 1){
              city = cityStateArr[0].trim();
              let zipIndex = cityStateArr[1].search(/[0-9]{5}/);
              zip = cityStateArr[1].slice(zipIndex, zipIndex + 5);
            }
            
            if(locationName){
              locationName = locationName.replace("&apos;", "'"); 
            }
            
            //notes on the location or additional details
            //will better parse these at a later time 
            notesString = $.parseHTML(notesString);
            if(notesString && notesString.length > 1 && notesString[1].hasOwnProperty('data')){
              notes.push(notesString[1].data.trim());
            } else if(notesString && notesString.length === 1 && notesString[0].hasOwnProperty('data')){
              notes.push(notesString[0].data.trim());
            }
            if(notesString === null){
              notes = [];
            }

            let access = String($('tr td:nth-child(4)').eq(i).text()).trim();
            if(access.length > 3){
              details.push(access);
            }

            let wheelchair = String($('tr td:nth-child(5) img').eq(i));
            if(wheelchair){
              details.push('Wheelchair Access');
            }
            
            let formats = $('tr td:nth-child(9)').eq(i).text().split(',');
            formats.forEach((item) => {
              if(item.length > 1){
                details.push(item);
              };
            })

            let geoString = $('tr td:nth-child(2) a').eq(i).attr('href');
            if(geoString){
              let qIdx = geoString.indexOf('q=  ');
              let addressIdx = geoString.indexOf('&address');
              geoString = geoString.slice(qIdx + 4, addressIdx).split(',');
              geo.push(geoString[1], geoString[0]);
            }

            //site specific logic for inconsistent data
            if(locationName == 'Hiking Meeting'){
              address = 'See meeting website';
              meetingUrl = 'http://www.wildrecovery.org';
            }

            if(locationName == 'Parroquia Santo Cura de Ars'){
              locationName = undefined;
              address = 'N Market St';
              city = 'San Jose';
              zip = '95110';
            }

            if(locationName == 'Capela Sao Jose Operario'){
              locationName = undefined;
              address = "N 5th St & E Santa Clara St.";
              city = 'San Jose';
              zip = '95112';
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
            
            if(meetingObj.day && meetingObj.time){
                  allData.push(meetingObj);
            }

          });
                    
          resolve(allData);
        });
  })
  
}