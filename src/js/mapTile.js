import loadApiWaqi from './loadApi';
import outputHtml from './outputHtml';
var map = null;
export default function loadMap(waqiToken,mapboxToken,lan,lon,range,widgetContainer,widgetSelected){
  'use strict';
  if(map!=undefined){
    map.remove();
  }
  map  =  L.map('mapid').fitBounds([[lan+range,lon+range],[lan-range,lon-range]]);
  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).on('load',mapInfo).addTo(map);  
  map.on('moveend', mapInfo);
  function mapInfo(){
    let crd = map.getBounds();
    let bounds = `${crd._northEast.lat},${crd._northEast.lng},${crd._southWest.lat},${crd._southWest.lng}`;
    const dati = loadApiWaqi.mapQueries(bounds,waqiToken);
    dati.then(res=>{
      res.forEach((element) => {
        const iconCustom = L.divIcon({
          html:`<span>${element.aqi}</span>`,
          className:'my-div-icon',
          iconSize:[30,30]
        });
        let marker = L.marker([element.lat,element.lon],{icon:iconCustom}).addTo(map);
        marker.on('click',onClick);  
        marker.bindPopup(`${element.aqi}`);
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