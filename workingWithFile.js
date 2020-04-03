var fs = require("fs");
var contents = fs.readFileSync("poly.json");
var jsonContent = JSON.parse(contents);
var inside = require('point-in-polygon');

jf = {
        type: "Feature"
    }

function nameOfPolygon (latLong){
    var arr = []
    jsonContent.forEach(element => {
        if (isInPolygon(element.features[0].geometry.coordinates[0], latLong)){
            arr.push(element.features[0].properties.name);
        }
    });
    return arr
}

function addNewPolygon (jsonFile){
    jsonContent.push(jsonFile)
    fs.writeFileSync('poly.json' , JSON.stringify(jsonContent))
}

function isInPolygon (polygon , coordinates){
    return inside(coordinates , polygon);
}

module.exports.nameOfPolygon = nameOfPolygon;
module.exports.addNewPolygon = addNewPolygon;

