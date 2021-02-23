//check docs on: https://leafletjs.com/reference-1.7.1.html#

import loadApiWaqi from './loadApi';
import outputHtml from './outputHtml';
import triangleSvg from '../img/svg/triangle.svg';
import '../../node_modules/leaflet/dist/leaflet.js';

var map = null;
export default function loadMap(waqiToken,mapboxToken,lat,lon,range,cardContainer,widgetContainer,listContainer,widgetSelected){
  'use strict';
  if(map!=undefined){
    map.remove();
  }
  map  =  L.map('mapid').fitBounds([[lat+range,lon+range],[lat-range,lon-range]]);
  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).on('load',mapInfo).addTo(map);  
  map.on('moveend', mapInfo);
  function mapInfo(){
    if(listContainer!=null){listContainer.innerHTML = '';}
    let crd = map.getBounds();
    let bounds = `${crd._northEast.lat},${crd._northEast.lng},${crd._southWest.lat},${crd._southWest.lng}`;
    const dati = loadApiWaqi.mapQueries(bounds,waqiToken);
    dati.then(res=>{
      res.forEach((element) => {
        const latlng = L.latLng(element.lat,element.lon);
        const iconCustom = L.divIcon({
          html:`
              <p class="mb-0" style="background-color:${element.aqiDescription.color}">${element.aqi}</p>
              <img src="${triangleSvg}"/>`,
          className: 'my-div-icon'
        });
        let marker = L.marker(latlng,{icon:iconCustom}).addTo(map);
        marker.on('click',onClick);  
        const customPopup = L.popup()
        .setContent(`
          <h5 class="fw-bold">${element.station.name}</h5>
          <p class="lead text-center" style="background-color:${element.aqiDescription.color}">${element.aqi} ${element.aqiDescription.level}</p>
          <span>${new Date(element.station.time)}</span>
        `
        )
        .setLatLng(marker.getLatLng())
        marker.bindPopup(customPopup,{className:'my-popup-custom'});
        marker.on('mouseover',function (e) {this.openPopup();});  
        marker.on('mouseout',function (e) {this.closePopup();;});  
      })
    })
  }
  function onClick(e){
    map.fitBounds([[e.latlng.lat+range,e.latlng.lng+range],[e.latlng.lat-range,e.latlng.lng-range]])
    const latlng =JSON.parse(`[${e.latlng.lat},${e.latlng.lng}]`);
    let bounds = `${e.latlng.lat+range},${e.latlng.lng+range},${e.latlng.lat-range},${e.latlng.lng-range}`;
    const dati = loadApiWaqi.mapQueries(bounds,waqiToken,latlng);
    dati.then(res=>{
      console.log(res);
      const gelocalizedFeed = loadApiWaqi.getCityFeed(res[0].station.name,waqiToken);
      gelocalizedFeed.then(res=>{
        outputHtml.card(res,cardContainer);
      })
      outputHtml.widget(res,widgetContainer);
      const widgetItems = widgetContainer.querySelectorAll("a");
      for (let widget of widgetItems) {
        widget.addEventListener('click', widgetSelected); 
      }
    })
  }
}

//#region old getBounds
// const north = L.latLng(lan+range, lon+range);
// const south = L.latLng(lan-range, lon-range);
// const bounds = L.latLngBounds(north, south);
// const  map  =  L.map('mapid').fitBounds([bounds]);
//#endregion