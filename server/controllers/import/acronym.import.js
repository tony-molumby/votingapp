import models from './../../../models';

let {Acronym, Meeting} = models;
let acronym = {};

//needs to run after all meetings have been loaded each
//day in order to populate the acronyms collection

acronym.import = () =>{
   Acronym.collection.drop()
       .then((res)=>{
           console.log("Acronyms collection dropped = " + res);
            Meeting
                .aggregate([
                    {$group: {_id: {name: '$groupAcronym'}}},
                    {$sort: {'_id.name': 1}}
                ])
                .then((arr)=>{
                    console.log(arr);
                    arr.forEach((a) => {
                        let acronymObj = new Acronym({
                            name: a._id.name
                        })
                        acronymObj
                            .save()
                            .then((res) =>{
                                console.log('Saved ' + res.name + ' acronym to collection.');
                            })
                            .catch((err) => {
                                console.log('Error saving to the acronyms collection.')
                                console.log(a);
                                console.log(err);
                            })
                    })
                })
                .catch((err)=>{
                    console.log("Error getting acronyms from the meetings collection.")
                    console.log(err);
                })
        })
        .catch((err)=>{
            console.log('Error dropping the acronyms collection.')
            console.log(err);
        })
}

export default acronym;