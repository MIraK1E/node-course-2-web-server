const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// tell hbs use partials (layouts)
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
// custom middleware will call with request, response object and next
// when next exist it tell express that you middleware function is done
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    
    console.log(log);
    fs.appendFile('server.log' ,log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance');
// });

// use middleware
app.use(express.static(__dirname + '/public'));

// use helper
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});
// argument (url, function that what to send back to this request)
// app.get('/', (req,  res) => {

//     // res.send('<h1>Hello Express</h1>');
//     res.send({
//         name: 'Andrew',
//         likes: [
//             'Biking',
//             'Cities'
//         ]
//     });

// });

app.get('/', (req, res) => {

    const data = {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
        // This line below not nessesary because we Register the helper  
        // That we can call in hbs file 
        // currentYear: new Date().getFullYear()
    };

    res.render('home.hbs', data);

});

app.get('/about', (req, res) => {

    const data = {
        pageTitle : 'About Page',
        // currentYear: new Date().getFullYear()
    }

    // render is a method to render any of the template that you setup with you current engine
    res.render('about.hbs', data);

});

app.get('/bad', (req, res) => {

    res.send({
        errorMessage: 'Unable handle request'
    });

});

// bind app to port 
// app.listen(3000, () => {
//     console.log('server is up on port 3000')
// });

// setup dynamic port process.env variable is store environment key and value pair
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});