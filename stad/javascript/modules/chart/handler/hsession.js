/**
 * handles session..
 * TODO - move to the request folder
 */
let token = window.localStorage.getItem('token');
let userId = window.localStorage.getItem('user-id');


const url = urlModule.header+urlModule.userURL+userId;

const getMethod = {
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + token
    },
}

fetch(url, getMethod)
    .then(response =>{
        if(response.status!=200){
            // window.location.replace('login.html');
        } else{

        }
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
