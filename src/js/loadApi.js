'use strict';
//my custom json about quality levels
function addQualityDesc (aqiValue){
  const json = require('../json/qualityLevels.json');
  switch (true) {
    case isNaN(aqiValue):
      return json.nodata;
    case aqiValue <= 50:
      return json.data[0];
    case aqiValue <= 100:
      return json.data[1];
    case aqiValue <= 150:
      return json.data[2];
    case aqiValue <= 200:
      return json.data[3];
    case aqiValue <= 300:
      return json.data[4];
    case aqiValue > 300:
      return json.data[5];
    default:
      console.log("Nessun valore");
  }
}
//Here I have all type of api from https://aqicn.org/json-api/doc/#api
const loadApi = {
  search : async function(keyword,token){
    try {
      const response = await fetch(`https://api.waqi.info/search/?token=${token}&keyword=${keyword}`);
      const dati = await response.json();
      dati.data.forEach(element => {
          let aqi = Number(element.aqi);
          element["aqiDescription"] = addQualityDesc(aqi);
        });
      return dati.data;
    } catch (error) {
      console.log(`loadApi.WAQI error: ${error}`);
    }
  },
  getCityFeed: async function(name,token){
    try {
      const response = await fetch(`https://api.waqi.info/feed/${name}/?token=${token}`);
      const dati = await response.json();
      dati.data["aqiDescription"] = addQualityDesc(Number(dati.data.aqi));
      console.log()
      return dati.data;
    } catch (error) {
      console.log(`loadApi.getCityFeed error: ${error}`);
    }
  },
  mapQueries: async function(bounds,token,currPos){
    try {
      const response = await fetch(`https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${token}`);
      const dati = await response.json();
      dati.data.forEach((element,index,arr) => {
        let aqi = Number(element.aqi);
        element["aqiDescription"] = addQualityDesc(aqi);
        if(currPos!=undefined) {
          if(JSON.stringify(currPos)===JSON.stringify([element.lat,element.lon]) && index > 0){
            let temp = arr[0];
            arr[0] = arr[index];
            arr[index] = temp;
          }
        }
      });
      // else{console.log('currPos non è stato inserito')}
      return dati.data;
    } catch (error) {
      console.log(`loadApi.getPosition error: ${error}`);
    }
  } ,
  geoLatLon: async function(latlon,token){
    const response = await fetch(`https://api.waqi.info/feed/geo:${latlon}/?token=${token}`)
    const dati = await response.json();
    dati.data["aqiDescription"] = addQualityDesc(Number(dati.data.aqi));
    return dati.data;
  },
  qualityLevels: async function(){
    const json = await require('../json/qualityLevels.json');
    return json.data;
  }
}

export default loadApi;