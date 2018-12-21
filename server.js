const cors = require('cors');
var geohash = require('ngeohash');
var corsOptions = {
  origin: 'http://localhost:4200',
  //origin: 'http://angularwebappcli.s3-website-us-west-1.amazonaws.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 

}

var Promise = require('promise');

const express=require('express');

var bodyParser = require("body-parser");
var app = express();
var Request = require("request");

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT||3000;

var SpotifyWebApi = require('spotify-web-api-node');


 app.get('/autocomplete',(req,res)=>{
    let url =`https://app.ticketmaster.com/discovery/v2/suggest?apikey=${req.query.apikey}&keyword=${req.query.keyword}`;
    promiseAutocomplete(url).then(function(data) {
        res.send(data) ;
    }).catch(function(err) {
        console.err(err);
    });
});
 function promiseAutocomplete(urlval){
    var options = {url: urlval,headers: {'User-Agent': 'request','Access-Control-Allow-Origin': '*'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

app.get('/geocoding',(req,res)=>{
     let url =`https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=${req.query.key}`;
     promiseGeocoding(url).then(function(data) {
        res.send(data) ;
    }).catch(function(err) {
        console.err(err);
    });
    
 });
 function promiseGeocoding(urlval){
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

app.get('/geohash',(req,res)=>{
    let lat = req.query.lat;
    let lon = req.query.lon;
    let result = geohash.encode(lat,lon);
    res.send(result);
   
});


app.get('/events',(req,res)=>{
    let url =`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${req.query.apikey}&keyword=${req.query.keyword}&segmentId=${req.query.segmentId}&radius=${req.query.radius}&unit=${req.query.unit}&geoPoint=${req.query.geoPoint}&sort=${req.query.sort}`;
    promiseEvents(url).then(function(data) {
        res.send(data) ;
    }).catch(function(err) {
        console.err(err);
    });
});

function promiseEvents(urlval){
    console.log(urlval);
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

app.get('/detialinfo',(req,res)=>{
    let url =`https://app.ticketmaster.com/discovery/v2/events/${req.query.eventid}?apikey=${req.query.apikey}`;
    promiseDetialinfo(url).then(function(data) {
        res.send(data) ;
    }).catch(function(err) {
        console.err(err);
    });
});

function promiseDetialinfo(urlval){
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}
app.get('/venueinfo',(req,res)=>{
    let url =`https://app.ticketmaster.com/discovery/v2/venues?apikey=${req.query.apikey}&keyword=${req.query.eventname}`;
    promiseVenueinfo(url).then(function(data) {
        res.send(data) ;
    }).catch(function(err) {
        console.err(err);
    });
});

function promiseVenueinfo(urlval){
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

// -------------------------------upcoming start
app.get('/upcominginfo',(req,res)=>{
    let url =`https://api.songkick.com/api/3.0/search/venues.json?apikey=${req.query.apikey}&query=${req.query.venuename}`;
    promiseUpcoming(url).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.err(err);
    });
});

function promiseUpcoming(urlval){
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

app.get('/upcominginfoctn',(req,res)=>{
    let urlval = `https://api.songkick.com/api/3.0/venues/${req.query.venueid}/calendar.json?apikey=${req.query.apikey}`;
    promiseUpcomingCtn(urlval)
    .then(function(data) {
        res.send(data);
    })
    .catch(function(err) {
        console.err(err);
    });
});
function promiseUpcomingCtn(urlval){
    console.log("contine...");
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}
// -------------------------------artist start
var spotifyApi = new SpotifyWebApi({
    clientId: 'ba03bf4fbfb14980aecb96d0d723b88d',
    clientSecret: 'b1acb8a731a34d4293f99af97bd129d7'
  });

app.get('/artistinfo',(req,res)=>{
    spotifyApi.searchArtists(req.query.artistname)
    .then(function(data) {
        //console.log(data);
        res.send(data);
    }, function(err) {
        res.send(err);
    });
});

app.get('/artisttokeninfo',(req,res)=>{
    console.log('artist...Tokne');
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          spotifyApi.setAccessToken(data.body['access_token']);
          res.send({'token':"yes"});
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );
});

app.get('/imageinfo',(req,res)=>{
    let url =` https://www.googleapis.com/customsearch/v1?q=${req.query.q}&cx=${req.query.cx}&imgSize=${req.query.imgSize}&num=${req.query.num}&searchType=${req.query.searchType}&key=${req.query.key}`;
    promiseImag(url).then(function(data) {
        res.send(data) ;
    }).catch(function(err) {
        console.err(err);
    });
});

function promiseImag(urlval){
    var options = {url: urlval,headers: {'User-Agent': 'request'}};
    return new Promise(function(resolve, reject){
        Request.get(options, function (err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}


var server = app.listen(port, function () {
    console.log("Listening on port %s...", server.address().port,`Or listening to ${port}`);
});