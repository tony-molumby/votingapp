import models from './../../../models';
let {MeetingCity, Meeting} = models;

let city = {};

//the import function looks at the Meetings database, grabs all of the unique cities/state combos and 
//then saves only the unique ones in to the meetingcities collection.  This allows the user to 
//view a list of the cities which have meetings in the database.
city.import = () => {
    MeetingCity.collection.drop()
        .then((res)=>{
            console.log("Meeting Cities collection dropped = " + res);
            Meeting
            .aggregate([
                { $group: {_id: {city: '$loc.city', state: '$loc.state'}} },
                { $sort: {'_id.state': 1, '_id.city': 1} }    
            ]) 
            .then((citiesArr) => {
                citiesArr.forEach((c) => {
                    MeetingCity.findOne({city: c._id.city, state: c._id.state})
                        .then((doc) =>{
                            if(!doc){
                                let cityObj = new MeetingCity({
                                    city: c._id.city,
                                    state: c._id.state
                                });
                                cityObj
                                    .save()
                                    .then((data) => {
                                        console.log(data.city + ' saved successfully');
                                    })
                                    .catch((err)=>{
                                        console.log('Error saving meeting city to the collection.');
                                        console.log(c);
                                        console.log(err);
                                    });
                            } else {
                                console.log(c._id.city + ' already exists, not saving');
                            }
                        })
                        .catch((err)=>{
                            console.log('Error finding meeting city')
                            console.log(err);
                        })
                });
                
            })
            .catch((err)=>{
                console.log('Error aggregating meeting cities from the meeting collection.')
                console.log(err);
            });
        })
        .catch((err)=>{
            console.log(err);
        });
    
}

export default city;