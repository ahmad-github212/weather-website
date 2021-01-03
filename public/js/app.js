
//for making http request from client side we use fetch api
// this will be used in the addEventListener to fetch data dynamically
/*fetch('http://localhost:3000/weather?address=!').then((response)=>{
    response.json().then((data)=>{
        if(data.error){
            console.log(data.error);
        }
        else{
            console.log(data.location);
            console.log(data.forecast);
        }
    })
});*/

const weatherForm = document.querySelector('form'); // for selecting the form

const search = document.querySelector('input');

const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit',(event)=>{
// as soon as we click on the submit button the browser refreshes the page and the data flashes means
//  when submit button is clicked the data will come on the screen but in a very few second it will disappear
// so to prevent that default behaviour of the browser we use [event.preventDefault()]

event.preventDefault();

const location = search.value ;
messageOne.textContent = "Loading...";
messageTwo.textContent = "";

    fetch('http://localhost:3000/weather?address='+location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                //console.log(data.error);
                messageOne.textContent= data.error;

            } 
            else {
                //console.log(data.location);
                //console.log(data.forecast);
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;
            }
        })
    });


})

