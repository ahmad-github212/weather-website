//expressjs is the framework for server which does the job of serving css html js node file we created
// based on the request of the client to the browser

const express = require('express'); // loading of the library in constant express

//express is called as express() and the return value is stored in constant which serves the application 
// based on the route

const app = express();

/*
example app.com may be the domain name
app.com/help, abpp.com/about other pages  where /help, /about are the routes where user want to travel
*/

//  app.get() method used to send the response to the browser based on the route the user request



/*
through res.send() we are sending html, text, object to the browser what if we wanted to send the whole 
html document. if we send that thorugh res.send() method then that would become more complicated so 
we make the html file of that and we include its directory to app.use(express.static()) to load the 
html to the browser.
for the directory of the html file we will use [path] module of the node.js 
we require it as [const path = require('path')]. Here we will use path.join() method to get the directory 
of the html file.
we have made the public folder in web-server folder. in public there is the html files we have to include.
there is index.html file which automatically runs on the browser when called i.e, this file is the root file
which donot require special calling. if we call the public directory it will automatically run.

*/

const path = require('path');

const currentDirectory = __dirname ; // this will give the string of current directory
// since app.js is in src folder and our index.html file is in public folder we have to do some manipulation
// to go to public folder. for doing that we will use [path.join(currentDirectory,'../public')]

const publicDirectoryPath = path.join(currentDirectory,'../public');


app.set('view engine', 'hbs');

//this way is needed if we dont want to name the folder as views but we have to set hbs as above to let the express know about the handler
const viewPath = path.join(currentDirectory, '../templates/views');
app.set('views',viewPath);

const hbs = require('hbs');


/*
this is needed if we want to make header and footers or any other stuffs which have to use at different palces.
*/
const partialPath = path.join(currentDirectory,'../templates/partials');
hbs.registerPartials(partialPath);

app.use(express.static(publicDirectoryPath)); // this method used for running the static assets like html css images videos etc

/*
#handlebars: we use handlebars to create dynamic templates. initially we made html files for about,help,index
these were static files as much as possible when they are refreshed the data is same. to make it dynamic we
use these handlebars.
handlebars also make the code reusable. we write the code at one place and can use it at all places. this is
also helpful in making changes at all places by changing at one place only.

for using handlebars with express we have to set hanldebars to make express know through app.set("key", "value")
method. for handlebar [key is] [view engine] [value is] [hbs]
for implementing all the templates we have to create a [views] named folder and in that we have to keep all
the html code file with .hbs extension not with .html extension.
the files in the views folder are the views which the user interact with.

*/


//to connect to hbs view we have to give route of the view. index.hbs will the root route
app.get('', (req, res) => {
    res.render('index',{
        name:'Ahmad Shadab',
        title:'Weather App'
    }); // app.render() method is used to render the hbs view template. it takes two argument
    // first name of the view file here index and second is object which we want to send dynamically to index page
});


app.get('',(req, res)=>{
    // callback takes two arguements: request, response. req i.e, request contains the information about request
    // res i.e, response sends the response based on the route through res.send()

   // res.send('hello express!!'); // sending the text
    //res.send('<h1>Hello Express</h1>') // sending html
   // res.send({name:'ahmad shadab',age:21 }); // sending json express stringify the object created and send it to the browser

   res.send([{name:'ahmad'},{name:'shadab'}]); // sending array of object
});

/*app.get('/help', (req,res)=>{
    res.send('help page');
});
*/

//help through hbs way in the views folder
app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        name:'Ahmad Shadab',
        helpText:'This is some helpful text'
    })
})

/*app.get('/about',(req,res)=>{
    res.send('<h1>about</h1>');
});
*/

// about through hbs way in the views folder
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About me',
        name:'Ahmad Shadab'
    });
})

const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');


app.get('/weather',(req,res)=>{
    // applying the query string here.
    if(!req.query.address){
        return res.send({
            error:'you must provide address'
        });
    }
    const place = req.query.address ;
    geocode(place,(error,data)=>{
        if(error){
            return res.send({
                error:error
            });
        };
        forecast(data.latitude, data.longitude,(error,forecastdata)=>{
            if(error){
                return res.send({
                    error:error
                });
            };
            res.send({
                location:data.location,
                forecast:forecastdata,
                latitude:data.latitude,
                longitude:data.longitude,
                address:req.query.address
            });

        })
    })
    /*res.send({
        forecast:'it is raining out',
        location:'mau',
        address:req.query.address
    });*/
});

/*
query string is the key value pair we provide after url starting with ? 
this contains the search query we want like if we want to search for products having rating 5 or we want to
search for products with some price. The key value pair we provide in the query string can be accessed
by [req.query] which is an object.
*/
app.get('/products',(req,res)=>{
    const queryUrl = req.query;
    console.log(queryUrl);
    // we have to set condition for particular query to be provided. like here we have to send response
    //when search query is provided. 
    
    if(!req.query.search){
      return res.send({
           error:'You must search for something'
       }) ;
    }
    // "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" will come 
    // because we are using res.send() twice which can be used only once in the app.get() method. if we want
    // to use it twice then we have to return at the first res.send() like in this code. 
    
    //we can also use [else] but this way is more used
    res.send({
        products:[]
    });
});


// for sending the response to the browser we have to first start the server on some port.
//deafult port for http request is port 80. but since we are using aur localhost machine then we have to set 
//it on the port 3000 or some other but now here we use port 3000


app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Ahmad Shadab',
        errorMessage:'Help page not found'
    })
});

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Ahmad Shadab',
        errorMessage:'page not found'})
});
app.listen(3000,()=>{
    console.log('server running on 3000');// this does not show to any browser
});