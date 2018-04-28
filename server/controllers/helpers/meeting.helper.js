import models from './../../../models';

let {Meeting} = models;
let meetingHelper = {};

meetingHelper.findOne = (meetingObj) => {
    return new Promise((resolve, reject) =>{
        let {day, time, address, city, state, meetingName} = meetingObj;
        Meeting
            .findOne({
                day: day, 
                time: time, 
                address: address, 
                city: city, 
                state: state
            })
            .then((doc) => {
                if(doc) {
                    console.log(meetingName + ' found, returning meeting document.')
                    resolve(doc);
                } else {
                    console.log('No meeting found for ' + meetingName + ', returning null.')
                    resolve(null);
                }
                
            })
            .catch((err) => {
                reject(err);
            })
    })
    .catch((err)=>{
        console.log(err);
    });
    
}

export default meetingHelper;