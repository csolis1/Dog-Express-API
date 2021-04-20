const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express();

//const morgan = require('morgan');
//const logger = morgan('tiny') //parameter into morgan tells morgan to give us just a tiny bit of info
//app.use(logger);

//const helmet = require('helmet');
//app.use(helmet());

app.use(express.static('public/css/style.css'));


const es6Renderer = require('express-es6-template-engine')
app.engine('html', es6Renderer) //telling app to register es6
app.set('views', 'templates')
app.set('view engine', 'html');
const server = http.createServer(app);

const db = require('./db');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');


app.get('/', (req, res) => {
    console.log(req.url);
    res.render('home', {
        locals: {
            title: "Dog Profile"
        },
        partials: {
            head: '/partials/head',
        }
    });
});

app.get('/dogs', (req, res) => {
    console.log('request path is:' + req.path)
    res.render('dogs-list', {
        locals: {
            dogs: db,
            path: req.path,
            title: "My Favorite Dogs"
        },
        partials: {
            head:'/partials/head'
        }
    })
});

app.get('/dogs/:breed', (req, res) => {

    let {breed} = req.params
    var dog = db.find(thisDog => thisDog.breed === breed);
    var replaced = breed.split(' ').join('-')
    let url = `https://dog.ceo/api/breed/${replaced}/images/random`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.status === 404) {
                randomImage = dog.image
            }else{
                var randomImage = data.message
                console.log(randomImage)
            }

        })

    if(dog) {

        console.log(randomImage)
      
         res.render('dog', {
             locals: {
                 dog,
                 title: "A Dog",
                 randomImage: image
             },
             partials: {
                 head: "/partials/head",
                 image: 'partials/image'
             }
         });
        
    }else{
        res.status(404)
            .send("No Dog found :(")
    }

app.post('/dogs/:name',(req, res) => {
    let {breed} = req.params
    var replaced = breed.split(' ').join('-')
    let url = `https://dog.ceo/api/breed/${replaced}/images/random`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            var randomImage = data.message
            console.log(randomImage)
        })
        .catch(err=>{
            var randomImage = dog.image
            console.lof(randomImage)

        })
})

});
server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});
