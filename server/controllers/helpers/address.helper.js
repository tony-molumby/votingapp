import models from './../../../models';

let {Location, City, Zip} = models;
let aH = {};

//attempt to parse the string the user has searched with, this needs a bit more work...
aH.parser = (location) => {
    console.log('location is ' + location);
    let patt = /[0-9]{5}/;
    let idx = location.search(patt);
    let obj = {};
    if(idx > -1){
        obj.zip = location.slice(idx, idx + 5);
    } else {
        obj.error = "Your zip code does not appear to be formated correctly, make sure it has exactly 5 digits."
    }

    return obj;
}

//use the parsed address object to find the city or zip code in the database, this needs a bit of work...
aH.finder = (obj) => {
    let {zip, city, state, arr} = obj;
    return new Promise((resolve, reject) =>{
        if(zip){
            Zip.findOne({zip})
                .then((loc) => {
                    if(loc) {
                        obj.geo = loc.geo;
                    } else {
                        obj.error = 'Zip code not Found, please make sure you are using a CA zip code.';
                    }
                    resolve(obj);
                })
                .catch((err) => {
                    reject(err);
                })
        }  else {
            obj.error = "Something has gone wrong...  Try another zip code."
            reject(obj.error);
        }
    })

}

export default aH;