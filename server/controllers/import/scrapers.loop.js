import mongoose from './../../connect';
import Scrapers from './scrapers.all';
import acronym from './acronym.import';
import meetingCity from './meeting.city.import';


//loop through all the scrapers and add the citys and acronyms to the db
//one command and all sites can be scraped

let loop = () => {
    let keys = Object.keys(Scrapers);
    console.log(keys);
    mongoose.connection.collections['meetings'].drop((err) => {
        if(err) return console.log(err);
        console.log('Meetings collection dropped');
        let count = 0;
        let run = () => {
            if(count < keys.length){
                Scrapers[keys[count]]()
                    .then((done) => {
                        console.log('Done with scraper: ' + keys[count]);
                        count++;
                        run();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log('Finished all scrapers HOORAY!!!');
                acronym.import();
                meetingCity.import();
                return;
            }
        }
        run();
        
    });
}

loop();