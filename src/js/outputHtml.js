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
        `<a href="#" class="col p-3 a-custom" data-usage="${info.lat};${info.lon}" >
          <div class="d-flex flex-column justify-content-center align-content-center bg-secondary">
            <h3 class="mb-0">${info.station.name}</h3>
            <p class="mb-0"><span class="text-success">${info.aqi}</span> <span>${info.aqiDescription.level}</span></p>
          </div>
        </a>`
      }).join('');
      widgetContainer.innerHTML = html;
    }
    else if (match.length===0){
      widgetContainer.innerHTML = 
      `<div class="card card-body border-0 mb-1 bg-secondary noData">
        <h3>${noData}</h3>
        <p class="mb-0">data not available<p>
      </div>`;
    }
  },
  card: function(cityData,cardContainer){
    const date = new Date(cityData.time.iso)
    console.log(cityData)
    if(cityData!=null){
      cardContainer.innerHTML =
      `<div class="card mb-3 border-secondary card-height">
        <div class="card-header bg-transparent border-secondary">${cityData.city.name}</div>
        <div class="card-body text-success">
          <h5 class="card-title">
            <span class="text-warning">${cityData.aqi}</span> <span>${cityData.aqiDescription.level}</span>
          </h5>
          <p class="card-text">${cityData.aqiDescription.health}</p>
        </div>
        <div class="card-footer bg-transparent border-secondary">${date}</div>
      </div>`
    }
  }
}

export default outputHtml;