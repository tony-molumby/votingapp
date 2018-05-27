
/* eslint-disable no-undef */
export function login (query, cb){    
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


  
function parseJSON(response) {
    return response.json();
}
  
