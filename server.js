var express = require("express")
const querystring = require('querystring');
const Joi = require('joi'); 
const fs = require('fs');
const url = require('url');
var {nameOfPolygon , addNewPolygon} = require ('./workingWithFile')
var {logger} = require ('./logger')
var app = express()
app.use(express.json())
const port = process.env.PORT || 3000;
var server = app.listen(port  , () => {console.log(`Example app listening at http://localhost:${port}`)})

 
app.use ((req , res , next) => {
    logger.info('info' , 'error')
    next()
})

const getValidation = Joi.object().keys({ 
    lat: Joi.number().required(),
    long: Joi.number().required(), 
  }); 

app.get('/gis/testpoint/' , (req , res) => {
    const queryObject = url.parse(req.url,true).query;
    const result = Joi.validate(queryObject, getValidation);  
    console.log(result.error == null)
    if (result.error != null){
        res.status(422).json({ 
            message: result.error.details[0].message
        }) 
    }
    else{
    //creates an array of the lat and long values from json file
    var latLong = []
    latLong.push(queryObject.lat)
    latLong.push(queryObject.long)

    //makes a json file containing the name of the polygon and returns it
    var jsonRet = "{ " + "polygon : [" + String(nameOfPolygon(latLong)) + "]" + " }"
    res.send(JSON.stringify(jsonRet))
    }
})

const putValidation = Joi.object().keys({ 
    type: Joi.string().required(),
    properties: Joi.object().keys({ 
      name: Joi.string().required()
    }),
    geometry : Joi.object().keys({ 
        type: Joi.string().required(),
        coordinates : Joi.array().items(Joi.array().items(Joi.array().items(Joi.number())))
    })
  }); 

app.put('/gis/addpolygon/' , (req , res) =>{
    const result = Joi.validate(req.body, putValidation);  
    if (result.error != null){
        res.status(422).json({ 
            message: result.error.details[0].message
        }) 
    }
    else{
        addNewPolygon(req.body)
        res.send("??")
    }
})

app.get('/' , (req , res) =>{
    res.send("covid-19")
})


