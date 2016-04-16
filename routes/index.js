/**
 * express package
 */
var express = require('express');
/**
 * requiring express router
 */
var router = express.Router();
/**
 * Jwt package for json web token
 */
var jwt     = require('jsonwebtoken');
var flights=require('../public/Models/flights.js');
/**
 * Our DB connection
 */
var db=require('../db.js');
/**
 * moment package timing manipulation
 */
var moment = require('moment');
/**
 * Seeding our database
 */
db.connect (function(err,db){
  flights.seed(function(err,seeded){
    if(err) throw err;
    if(!seeded){
      console.log('data already inserted before');
    }else{
      console.log('data  inserted ');

    }
  })
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing');
});
/* GET google maps API */
router.get('/google7a607af0cf3cce8e.html', function(req, res, next) {
  res.render('google7a607af0cf3cce8e.html');
});




/* GET airports codes */
router.get('/api/data/codes',function(req,res){
  var codes =  require('../airports.json');
  res.json( codes );
});

/* GET offers */
router.get('/api/data/offers',function(req,res){
  var offers =  require('../offers.json');
  res.json( offers );
});

/* GET news */
router.get('/api/data/news',function(req,res){
  var news =  require('../news.json');
  res.json( news );
});
router.get('/api/data/flight',function(req,res){
  var dummy =  require('../flight.json');
  res.json( dummy );
});

/* GET slides */
router.get('/api/data/slides',function(req,res){
  var slides =  require('../slides.json');
  res.json( slides );
});
router.get('/api/data/bookings',function(req,res){
  var bookings =  require('../bookings.json');
  res.json( bookings );
});
router.get('/api/data/pastFlights',function(req,res){
  var pastFlights =  require('../pastFlights.json');
  res.json( pastFlights );
});
router.get('/api/data/bookings',function(req,res){
  var pastFlights =  require('../bookings.json');
  res.json( pastFlights );
});
/**
 * Nationality REST ENDPOINT
 * @returns {Array}
 */
router.get('/api/data/nations',function(req,res){
  var nat =  require('../nationalities.json');
  res.json( nat );
});
/**
 * Aircraft REST ENDPOINT
 * @param name - Aircraft name
 * @returns {Array}
 */
router.get('/api/data/aircraft/:name',function(req,res){
  db.db().collection('aircrafts').findOne({name:req.params.name},function(err,data){
    if(err){
      console.log('error in retrieving aircraft');
    }else{
    res.json(data);
  }
  });
});

// router.use(function(req, res, next) {
//
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['token'];
//
//   var jwtSecret = process.env.JWTSECRET;
//   console.log(jwtSecret);
//   // Get JWT contents:
//   jwt.verify(token,jwtSecret, function(err, decoded) {
//     if(err){
//       console.log(err);
//     }else {
//      console.log('verified');
//       next();
//     }
//   });
//
// });


router.get('/api/data/conf',function(req,res){
  var dummy =  require('../confirm.json');
  res.json( dummy );
});

/**
 * ROUND-TRIP SEARCH REST ENDPOINT
 * @param origin - Flight Origin Location - Airport Code
 * @param destination - Flight Destination Location - Airport Code
 * @param departingDate - JavaScript Date.GetTime() numerical value corresponding to format `YYYY-MM-DD`
 * @param returningDate - JavaScript Date.GetTime() numerical value corresponding to format `YYYY-MM-DD`
 * @param class - economy or business only
 * @returns {Array}
 */

router.get('/api/flights/search/:origin/:destination/:departingDate/:returningDate', function(req, res) {
  var origin =req.params.origin;
  var destination=req.params.destination;
  var departingDate=req.params.departingDate;
  var returningDate=req.params.returningDate;
  var x=moment(departingDate).toDate().getTime();
  var y=moment(returningDate).toDate().getTime();
  //var clas=req.params.class;
  flights.getRoundTrip(origin,destination,x,y,db,function(err,result) {
     res.json(result);
   });
});

/**
 * ONE-WAY SEARCH REST ENDPOINT
 * @param origin - Flight Origin Location - Airport Code
 * @param DepartingDate - JavaScript Date.GetTime() numerical value corresponding to format `YYYY-MM-DD`
 * @param class - economy or business only
 * @returns {Array}
 */
router.get('/api/flights/search/:origin/:destination/:departingDate/:class', function(req, res) {
  var origin =req.params.origin;
  var destination=req.params.destination;
  var departingDate=req.params.departingDate;
  var x=moment(departingDate).toDate().getTime();
  flights.getOneWayTrip(origin,destination,x,db,function(err,result) {
    res.json(result);
  });
});
/**
 * All Fights ENDPOINT
 * @returns {Array}
 */
router.get('/api/all',function (req,res) {
  flights.getAllFlightsFromDB(function (err,result) {
    res.json(result);
  });
});

module.exports = router;
