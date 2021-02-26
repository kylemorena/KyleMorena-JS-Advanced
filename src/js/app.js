//Docs api source: https://aqicn.org/json-api/doc/#api

//#region Imports
import '../index.html';
import 'bootstrap';
import '../scss/main.scss';
import loadApiWaqi from './loadApi';
import outputHtml from './outputHtml';
import loadMap from './mapTile';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
import loadApi from './loadApi';
//#endregion
'use strict';
//#region FirebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyCFrQjFILzgv7NPYFwe7r5YTbI6MFjsJJs",
  authDomain: "kyle-morena.firebaseapp.com",
  projectId: "kyle-morena",
  storageBucket: "kyle-morena.appspot.com",
  messagingSenderId: "1052990960938",
  appId: "1:1052990960938:web:25a5dde15ac5885cc59a53",
  measurementId: "G-KZG9VRQ49J"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
//#endregion

//#region Variables
const waqiToken = process.env.WAQI_Token;
const mapboxToken = process.env.MAPBOX_Token;
const search = document.getElementById('search');
const yourPos = document.getElementById('yourPosId');
const listContainer = document.getElementById('unorderListId');
const widgetContainer = document.getElementById('widgetId');
const cardContainer = document.getElementById('cardId');
const tableContainer = document.getElementById('tableId');
const cityTitle = document.getElementById('cityNameTitle');
let range = 0.1; //diventerà un prompt
//#endregion

//#region  onLoad
window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback,options);
  const tableData = loadApi.qualityLevels();
  tableData.then(res=>{
    outputHtml.table(res,tableContainer);
  })
})
//#endregion

//#region  getCurrPos onLoad
const successCallback = (pos) =>{
  const crd = pos.coords;
  const bounds = `${crd.latitude+range},${crd.longitude+range},${crd.latitude-range},${crd.longitude-range}`;
  const currPos = loadApiWaqi.geoLatLon(`${crd.latitude};${crd.longitude}`,waqiToken);
  currPos.then(posRes=>{ //the posRes = position of geoLatLon Api
    outputHtml.card(posRes,cardContainer);
    cityTitle.innerHTML = posRes.city.name;
    const stations = loadApiWaqi.mapQueries(bounds,waqiToken,posRes.city.geo);
    stations.then(res=>{
      outputHtml.widget(res,widgetContainer);
      const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
    })
    loadMap(waqiToken,mapboxToken,crd.latitude,crd.longitude,range,cardContainer,widgetContainer,listContainer,widgetSelected);
  })
}
const errorCallback = (error)=>{
  console.error(error)
}
const options = {
  enableHighAccuracy: true,
  timeout: 5000
};
//#endregion

//#region YourPosition button
yourPos.onclick=()=>{
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback,options);
}
//#endregion

//#region  SearchBar
search.onkeyup = (e) => { // .onkeyup trigger the key .target.value return the key pressed 
  if(e.target.value!=''){
    //loadApiWaqi.search return the api using search by name 
    const dati = loadApiWaqi.search(e.target.value,waqiToken);
    dati.then(res => {
      //If outputHtml is open then assign an event on each "list" 
      if(outputHtml.searchBar(res,listContainer)){
        const listData = listContainer.querySelectorAll("a[data-latlng]");
        for (let list of listData) {
          list.addEventListener('click', listSelected); 
        }
        listContainer.style.display = "block";
      };
    }).catch(error => {console.log(error)});
  }else{
    listContainer.style.display = "none";
    listContainer.innerHTML='';
  }
  if (e.keyCode === 13 && e.target.value!='' ) {
    const dati = loadApiWaqi.search(e.target.value,waqiToken);
    dati.then(res => {
    loadMap(waqiToken,mapboxToken,res[0].station.geo[0],res[0].station.geo[1],range,cardContainer,widgetContainer,listContainer,widgetSelected);
    const gelocalizedFeed = loadApiWaqi.getCityFeed(res[0].station.url,waqiToken);
    gelocalizedFeed.then(res=>{
      cityTitle.innerHTML = res.city.name;
      outputHtml.card(res,cardContainer);
    })
    outputHtml.widget(res,widgetContainer);
    listContainer.style.display = "none";
    listContainer.innerHTML='';
    })
  }
}
window.onclick = (e) =>{
  if(e.path[3]!=listContainer){
    listContainer.style.display = "none";
    listContainer.innerHTML = '';
  }
}
//#endregion

//#region List Selection its called when you click on one list opened by searchbar
function listSelected(){
  const latlngData = this.getAttribute('data-latlng'); //return the value inside 'data-usage'
  const url = this.children[0].getAttribute('data-url'); //If you have an error, check the TagName
  const latlng = JSON.parse(`[${latlngData}]`) 
  const bounds = `${latlng[0]+range},${latlng[1]+range},${latlng[0]-range},${latlng[1]-range}`;
  const stations = loadApiWaqi.mapQueries(bounds,waqiToken,latlng); //here return the Map Queries api
  stations.then(async res => {
    const gelocalizedFeed = loadApiWaqi.getCityFeed(url,waqiToken);
    gelocalizedFeed.then(res=>{
      cityTitle.innerHTML = res.city.name;
      outputHtml.card(res,cardContainer);
    })
    //after I got the api about stations positions using loadApiWaqi.mapQueries I put load them on the map 
    await loadMap(waqiToken,mapboxToken,latlng[0],latlng[1],range,cardContainer,widgetContainer,listContainer,widgetSelected);
    //also put them on widget
    if(res.length>0){
      outputHtml.widget(res,widgetContainer);
    }else{
      gelocalizedFeed.then(res=>{
        outputHtml.widget(res,widgetContainer);
      })
    }
    //assign an click event on each widget just created
    const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
  })
  listContainer.style.display = "none";
  listContainer.innerHTML = '';
}
//#endregion

//#region Widget Selection its called when you click on one widget
function widgetSelected(){
  const widgetLatLon = this.getAttribute('data-latlng');
  const gelocalizedFeed = loadApiWaqi.geoLatLon(widgetLatLon,waqiToken);
  gelocalizedFeed.then(res =>{
    cityTitle.innerHTML = res.city.name;
    const latlng = res.city.geo;
    const bounds = `${latlng[0]+range},${latlng[1]+range},${latlng[0]-range},${latlng[1]-range}`;
    const stations = loadApiWaqi.mapQueries(bounds,waqiToken,latlng);
    outputHtml.card(res,cardContainer);
    stations.then(res=>{
      loadMap(waqiToken,mapboxToken,latlng[0],latlng[1],range,cardContainer,widgetContainer,listContainer,widgetSelected);
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

