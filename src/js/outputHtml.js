'use strict';

const outputHtml = {
  searchBar : function(match,matchList){
    let emptyArray= [];
    if(match.length>0){
      match.length=5;
      emptyArray = match.map(info=>{
        return info = 
        `<a href="#" class="a-custom">
          <li class="list-group-item p-1 m-0 bg-warning" data-usage="${info.station.geo[0]},${info.station.geo[1]}">
            <p class="lead">${info.station.name}</p>
            <span class="text-success">${info.aqi}</span>
            <span class="text-primary">${info.aqiDescription.level}</span>
            <small>Time: ${info.time.stime}</small>
          </li>
          </a>`;
      }).join('');
      matchList.classList.add('list-group');
      matchList.innerHTML=emptyArray;
    }else{matchList.innerHTML = ''};
    return true;
  },
  widget : function(match,widgetContainer,noData){
    if(match.length>0){
      const html = match.map(info=>{ 
        return info =
        `<a href="#" class="a-custom">
          <div class="card card-body border-0 mb-1 bg-secondary">
            <h1>${info.station.name}</h1>
            <h3 class="text-success">${info.aqi}</h3>
            <h2 class="text-primary">${info.aqiDescription.level}</h2>
            <small>Time: ${info.station.time}</small>
          </div>
        </a>`
      }).join('');
      widgetContainer.innerHTML = html;
    }
    else if (match.length===0){
      widgetContainer.innerHTML = 
      `<div class="card card-body border-0 mb-1 bg-secondary">
        <h1>${noData}</h1>
        <h3>data not available<h3>
      </div>`;
    }
  }
}

export default outputHtml;