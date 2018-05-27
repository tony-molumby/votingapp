let Client = {};

/* eslint-disable no-undef */
Client.login = (query, cb) => {    
    fetch('api/search', { 
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(query)
    })
        .then(parseJSON)
        .then(cb)
  }

  Client

  
// Client.checkStatus = (response) => {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     }
//     const error = new Error(`HTTP Error ${response.statusText}`);
//     error.status = response.statusText;
//     error.response = response;
//     console.log(error); // eslint-disable-line no-console
//     throw error;
// }
  
function parseJSON(response) {
    return response.json();
}
  
  export default Client;