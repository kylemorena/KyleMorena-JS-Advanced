//#region Imports
import '../index.html';
import 'bootstrap';
import '../scss/main.scss';
import loadApiWaqi from './loadApi';
import outputHtml from './outputHtml';
import loadMap from './mapTile';
//#endregion

'use strict';
const waqiToken = process.env.WAQI_Token;
const mapboxToken = process.env.MAPBOX_Token;
const search = document.getElementById('search');
const listContainer = document.getElementById('match-list');
const widgetContainer = document.querySelector('#widget');
let range = 0.1;

//#region  onLoad
window.addEventListener('load', () => {
  const successCallback = (pos) =>{
    const crd = pos.coords;
    const bounds = `${crd.latitude+range},${crd.longitude+range},${crd.latitude-range},${crd.longitude-range}`;
    const currPos = loadApiWaqi.geoLatLon(`${crd.latitude};${crd.longitude}`,waqiToken);
    currPos.then(posRes=>{
      const stations = loadApiWaqi.mapQueries(bounds,waqiToken,posRes.city.geo);
      stations.then(res=>{
        outputHtml.widget(res,widget);
        const widgetItems = widgetContainer.querySelectorAll("a");
        for (let widget of widgetItems) {
          widget.addEventListener('click', widgetSelected); 
        }
      })
      loadMap(waqiToken,mapboxToken,crd.latitude,crd.longitude,range,widgetContainer,widgetSelected);
    })
  }
  const errorCallback = (error)=>{
    console.error(error)
  }
  const options = {
    enableHighAccuracy: true,
    timeout: 5000
  };
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback,options);
})
//#endregion

//#region  SearchBar

search.onkeyup = (e) => {
  console.log(e.target.value);
  if(e.target.value!=''){
    const dati = loadApiWaqi.search(e.target.value,waqiToken);
    dati.then(res => {
      if(outputHtml.searchBar(res,listContainer)){
        const listData = listContainer.querySelectorAll("li[data-usage]");
        for (let list of listData) {
          list.addEventListener('click', listSelected); 
        }
      };
    }).catch(error => {console.log(error)});
  }else{listContainer.innerHTML='';}
  if (e.keyCode === 13) {
    const dati = loadApiWaqi.search(e.target.value,waqiToken);
    dati.then(async res => {
      await outputHtml.widget(res,widgetContainer);
      const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
      listContainer.innerHTML='';
    })
  }
}
//#endregion

//#region List Selection
function listSelected(){
  const dataUsage = this.getAttribute('data-usage');
  const noData = this.getElementsByTagName('h4')[0].textContent;
  const latlng = JSON.parse(`[${dataUsage}]`)
  const bounds = `${latlng[0]+range},${latlng[1]+range},${latlng[0]-range},${latlng[1]-range}`;
  const stations = loadApiWaqi.mapQueries(bounds,waqiToken,latlng);
  stations.then(async res => {
    await loadMap(waqiToken,mapboxToken,latlng[0],latlng[1],range,widgetContainer,widgetSelected);
    await outputHtml.widget(res,widgetContainer,noData);
    const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
    listContainer.innerHTML='';
  })
}
//#endregion

//#region Widget Selection
function widgetSelected(){
  const widgetName = this.getElementsByTagName('h1')[0].textContent;
  const cityFeed = loadApiWaqi.getCityFeed(widgetName,waqiToken);
  cityFeed.then(res =>{
    const latlng = res.city.geo;
    const bounds = `${latlng[0]+range},${latlng[1]+range},${latlng[0]-range},${latlng[1]-range}`;
    const stations = loadApiWaqi.mapQueries(bounds,waqiToken,latlng);
    stations.then(res=>{
      loadMap(waqiToken,mapboxToken,latlng[0],latlng[1],range,widgetContainer,widgetSelected);
      outputHtml.widget(res,widget);
      const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
      listContainer.innerHTML='';
    })
  })
}
//#endregion

//#region  HRM
// if (module.hot) {
//   module.hot.accept('./loadApi.js', function() {
//     console.log('Accepting the updated printMe module!');
//     loadAPI();
//   })
// }
//#endregion

