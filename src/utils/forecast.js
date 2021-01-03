const request  = require('request');

const forecast = (latitude,longitude,callback)=>{
    //const url = "https://api.openweathermap.org/data/2.5/weather?lat="+encodeURIComponent(latitude)+"&&lon="+encodeURIComponent(longitude)+"&units=metric&appid=9cd487e2b68a3b09e7b997a1377a02a1";

   // const url = 'https://api.darksky.net/forecast/9fc09672e7e6f663d9145b361753d110/' + center + '?units=si';
    
   const url = 'https://api.darksky.net/forecast/9fc09672e7e6f663d9145b361753d110/' + encodeURIComponent(latitude)+ ','+ encodeURIComponent(longitude) + '?units=si';


    request({url:url,json:true},(error,response)=>{
        if(error){
            callback('Unable to connect to the location service',undefined);
        }
        else if (response.body.error){
            //.error will be used if darksky api is used and .message will be used if openWeather api is used
            callback('Unable to find the loction. Try another search!!',undefined);
        }
        else{
            //callback(undefined, response.body.weather[0].description + '. ' + 'It is ' + response.body.main.temp + ' degrees out. There is ' + response.body.clouds.all + '% rain');
            callback(undefined, response.body.currently.summary + '. ' + 'It is ' + response.body.currently.temperature + ' degrees out. There is ' + response.body.currently.precipProbability + '% rain');

        }
    });
};

module.exports = forecast ; 