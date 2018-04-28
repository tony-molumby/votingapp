const request = require('request');
const cheerio = require('cheerio');

//Scrapes data from https://al-anon.info/MtgSearch/Al-AnonMeetings.aspx?language=EN
// This site is a little harder to scrape, will most likely need a tool like nightmare js.

// exports.scraper = function(url){
//     return new Promise(function(resolve, reject){
//         request(url, function(err, resp, body){
//             if(err){
//                 reject(err);
//             }
//             let $ = cheerio.load(body);
//             let numRows = $('tbody').find('tr').length - 14;
//             console.log(numRows);
//             let groupName = 'Alchoholics Anonymous';
//             let allData = [];
//             let day, time, meetingName, locationName, address, region, type;
//             let details = [];
//             let meetingObj = {};
//             $('tr').each(function(i, row){
//                 day = $('td.time span:first-child').eq(i).text().trim();
//                 time = $('td.time span:last-child').eq(i).text().trim();
//                 region = $('td.region').eq(i).text().trim();
//                 meetingName = $('td.name').eq(i).text().trim();
//                 address = $('td.address').eq(i).text().trim();
//                 locationName = $('td.location').eq(i).text().trim();
//                 meetingUrl = $('td.name a').eq(i).attr('href')
//                 details = $('td.types').eq(i).text().split(',').map(function(item){
//                     return item.trim();
//                 });
                
//                 meetingObj = {
//                     groupName: groupName,
//                     day: day,
//                     time: time,
//                     meetingName: meetingName,
//                     locationName: locationName,
//                     address: address,
//                     region: region,
//                     state: 'CA',
//                     city: 'San Francisco',
//                     meetingUrl: meetingUrl,
//                     details: details
//                 }
//                 if(meetingObj.day.length > 0 && meetingObj.meetingName.length > 0 ){
//                     allData.push(meetingObj);
//                 }
                
//             });            
//             resolve(allData);
//         })
//     })
  
// }

