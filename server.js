var express = require("express")
const querystring = require('querystring');
const fs = require('fs');
const url = require('url');
var {nameOfPolygon , addNewPolygon} = require ('./workingWithFile')
var {keyErrorGet , keyErrorPut} = require ('./errorHandling')
var {logger} = require ('./logger')
var app = express()
app.use(express.json())

const port = process.env.PORT || 3000;
var server = app.listen(port  , () => {console.log(`Example app listening at http://localhost:${port}`)})

app.use ((req , res , next) => {
    logger.info('info' , 'error')
    console.log(String(next))
    next()
})

app.get('/gis/testpoint/' , (req , res) => {
    const queryObject = url.parse(req.url,true).query;
    let missedKeys = keyErrorGet(queryObject)
    //throws an error if the main keys of the json file is missed 
    if (missedKeys.length == 1)
        throw String(missedKeys) + " key is missing."
    if (missedKeys.length == 2)
        throw String(missedKeys) + " keys are missing."
    //throws an error if the type of the values are not number    
    if (!/^[0-9,.]*$/.test(queryObject.lat))
        throw "lat value is not a number."
    if (!/^[0-9,.]*$/.test(queryObject.long))
        throw "long value is not a number."
        
    //creates an array of the lat and long values from json file
    var latLong = []
    latLong.push(queryObject.lat)
    latLong.push(queryObject.long)

    //makes a json file containing the name of the polygon and returns it
    var jsonRet = "{ " + "polygon : [" + String(nameOfPolygon(latLong)) + "]" + " }"
    res.send(JSON.stringify(jsonRet))
})

app.put('/gis/addpolygon/' , (req , res) =>{
    var missed = keyErrorPut(req.body)
    let mainMissedKeys = missed[0]
    let propMissedKeys = missed[1]
    let geoMissedKeys  = missed[2]

    //throws an error if the main keys are missed 
    if (mainMissedKeys.length == 1)
        throw String(mainMissedKeys) + " key is missing."
    if (mainMissedKeys.length >= 2)
        throw String(mainMissedKeys) + " keys are missing."
    //throws an error if one of the properties' keys are missed 
    if (propMissedKeys.length == 1)
        throw String(propMissedKeys) + " key is missing in properties."
    if (propMissedKeys.length >= 2)
        throw String(propMissedKeys) + " keys are missing in properties."
    //throws an error if one of the geometry's keys are missed 
    if (geoMissedKeys.length == 1)
        throw String(geoMissedKeys) + " key is missing in geometry."
    if (geoMissedKeys.length >= 2)
        throw String(geoMissedKeys) + " keys are missing in geometry."
    
    //throws an error if one of coordinate elements is not a number
    coordinate = req.body.geometry.coordinates[0]
    coordinate.forEach(arr =>{
        arr.forEach(element =>{
            if(!/([0-9][.])$/.test(element))
                throw "coordinate field consists of element(s) that are not number"
        })
    });

    addNewPolygon(req.body)
    res.send("??")
})

app.get('/404', function(req, res, next){
    throw "page not found" 
    next()
});

app.get('/403', function(req, res, next){
    throw "not allowed"
    next();
});

app.get('/500', function(req, res, next){
    throw "this page isn't working"
    next();
});

