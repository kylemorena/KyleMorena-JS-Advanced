//Docs api source: https://aqicn.org/json-api/doc/#api

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
const listContainer = document.getElementById('ulId');
const widgetContainer = document.getElementById('widgetId');
const cardContainer = document.getElementById('cardId');
const title = document.getElementById('cityNameTitle')
let range = 0.1; //diventerà un prompt

//#region  onLoad
window.addEventListener('load', () => {
  const successCallback = (pos) =>{
    const crd = pos.coords;
    const bounds = `${crd.latitude+range},${crd.longitude+range},${crd.latitude-range},${crd.longitude-range}`;
    const currPos = loadApiWaqi.geoLatLon(`${crd.latitude};${crd.longitude}`,waqiToken);
    currPos.then(posRes=>{ //the posRes = position of geoLatLon Api
      outputHtml.card(posRes,cardContainer);
      title.innerHTML = posRes.city.name;
      const stations = loadApiWaqi.mapQueries(bounds,waqiToken,posRes.city.geo);
      stations.then(res=>{
        outputHtml.widget(res,widgetContainer);
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
search.onkeyup = (e) => { // .onkeyup trigger the key .target.value return the key pressed 
  if(e.target.value!=''){
    //loadApiWaqi.search return the api using search by name 
    const dati = loadApiWaqi.search(e.target.value,waqiToken);
    dati.then(res => {
      //If outputHtml is open then assign an event on each "list" 
      if(outputHtml.searchBar(res,listContainer)){
        const listData = listContainer.querySelectorAll("li[data-usage]");
        for (let list of listData) {
          list.addEventListener('click', listSelected); 
        }
      };
    }).catch(error => {console.log(error)});
  }else{listContainer.innerHTML='';}
  //if "enter" key is triggered then open another type of outputHtml(da progettare ancora)
  if (e.keyCode === 13) {
    // const dati = loadApiWaqi.search(e.target.value,waqiToken);
    // console.log(dati);
    // dati.then(async res => {
    //   await outputHtml.widget(res,widgetContainer);
    //   const widgetItems = widgetContainer.querySelectorAll("a");
    //   for (let widget of widgetItems) {
    //     widget.addEventListener('click', widgetSelected); 
    //   }
    //   listContainer.innerHTML='';
    // })
  }
}
window.onclick = (e) =>{
  if(e.path[3]!=listContainer){
    listContainer.innerHTML = '';
  }
}
//#endregion

//#region List Selection its called when you click on one list opened by searchbar
function listSelected(){
  const dataUsage = this.getAttribute('data-usage'); //return the value inside 'data-usage'
  const cityName = this.getElementsByTagName('p')[0].textContent; //use the name of the city if there is no data
  title.innerHTML = cityName;
  const latlng = JSON.parse(`[${dataUsage}]`) 
  const bounds = `${latlng[0]+range},${latlng[1]+range},${latlng[0]-range},${latlng[1]-range}`;
  const stations = loadApiWaqi.mapQueries(bounds,waqiToken,latlng); //here return the Map Queries api
  stations.then(async res => {
    //after I got the api about stations positions using loadApiWaqi.mapQueries I put load them on the map 
    await loadMap(waqiToken,mapboxToken,latlng[0],latlng[1],range,widgetContainer,widgetSelected); 
    //also put them on widget
    await outputHtml.widget(res,widgetContainer,cityName);
    //assign an click event on each widget just created
    const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
  })
  listContainer.innerHTML = '';
}
//#endregion

//#region Widget Selection its called when you click on one widget
function widgetSelected(){
  const widgetLatLon = this.getAttribute('data-usage');
  const gelocalizedFeed = loadApiWaqi.geoLatLon(widgetLatLon,waqiToken);
  gelocalizedFeed.then(res =>{
    title.innerHTML = res.city.name;
    const latlng = res.city.geo;
    const bounds = `${latlng[0]+range},${latlng[1]+range},${latlng[0]-range},${latlng[1]-range}`;
    const stations = loadApiWaqi.mapQueries(bounds,waqiToken,latlng);
    outputHtml.card(res,cardContainer);
    stations.then(res=>{
      loadMap(waqiToken,mapboxToken,latlng[0],latlng[1],range,widgetContainer,widgetSelected);
      outputHtml.widget(res,widgetContainer);
      //when refreshed I need that the new ones have their click event
      const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
    })
  })
}
//#endregion

