var keysForGet = ['lat' , 'long']
var keysForProPut = ['name']
var keysforGeoPut = ['type' , 'coordinates']
jf = {"type": "Feature","properties": {"name": "تهران"},"geometry": {"type": "Polygon","coordinates": [
    [[
            53.514404296875,
            34.59704151614417],
        [
            51.416015625,
            34.854382885097905],
        [
            51.6851806640625,
            33.82023008524739],
        [
            53.514404296875,
            34.59704151614417]]]}}


function keyErrorGet (jsonObj){
    let keys = Object.keys(jsonObj);
    var missedKeys = [];
    keysForGet.forEach(element => {
        if (!keys.includes(element)){
            missedKeys.push(element)
        }
    });
    return missedKeys
}

function keyErrorPut (jsonObj){
    let mainKeys = Object.keys(jsonObj);
    var missedKeysMain = [];
    var missedKeysProp = [];
    var missedValueGeo = [];

    if (mainKeys.includes("properties")){
        let proKeys = Object.keys(jsonObj.properties)
        keysForProPut.forEach(element=>{
            if(!proKeys.includes(element))
                missedKeysProp.push(element)
        })
    }
    else 
        missedKeysMain.push("properties")

    if (mainKeys.includes("geometry")){
        let geoKeys = Object.keys(jsonObj.geometry)
        keysforGeoPut.forEach(element=>{
            if(!geoKeys.includes(element))
                missedValueGeo.push(element)
        })
    }
    else 
        missedKeysMain.push("geometry")

    if (!mainKeys.includes("type"))
        missedKeysMain.push("type")
    
    return [missedKeysMain , missedKeysProp , missedValueGeo]
}


module.exports.keyErrorGet = keyErrorGet;
module.exports.keyErrorPut = keyErrorPut;