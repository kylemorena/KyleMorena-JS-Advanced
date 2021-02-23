'use strict';
const outputHtml = {
  searchBar : function(match,matchList){
    let emptyArray= [];
    if(match.length>0){
      match.length=5;
      emptyArray = match.map(info=>{
        return info = `
        <a href="#" class="custom text-dark bg-secondary">
          <li class="list-group-item p-1 m-0" data-usage="${info.station.geo[0]},${info.station.geo[1]}">
            <h6 class="mb-0" data-usage="${info.station.url}">${info.station.name}</h6>
            <span class="mb-0 text-success">${info.aqi}</span>
            <small class="mb-0">Last Update: ${info.time.stime}</small>
          </li>
        </a>`;
      }).join('');
      matchList.innerHTML=emptyArray;
    }else{matchList.innerHTML = ''};
    return true;
  },
  widget : function(match,widgetContainer,unavailable){
    if(match.length>0){
      widgetContainer.innerHTML = match.map(info=>{ 
        if(info.aqi=='-'){ info.aqi = '';}
        return info = `
        <a href="#" class="col p-3 a-custom" data-usage="${info.lat};${info.lon}" >
          <div class="d-flex flex-column justify-content-center text-center bg-secondary">
            <h4 class="py-2 mb-0">${info.station.name}</h4>
            <p class="pb-2 mb-0">
              <span style="color:${info.aqiDescription.color}">${info.aqi}</span> 
              <span style="color:${info.aqiDescription.color}">${info.aqiDescription.level}</span>
            </p>
          </div>
        </a>`
      }).join('');
    }
    else if (match.length===0){
      widgetContainer.innerHTML = `
      <div class="card card-body border-0 mb-1 bg-secondary unavailable">
        <h4 class="p-2">${unavailable}</h4>
        <p class="mb-0 text-uppercase text-light font-weight-bold">data not available</p>
      </div>`;
    }
  },
  card: function(match,cardContainer){
    if(match!=null){
      const date = (match.time.iso==null)?match.aqiDescription.level : new Date(match.time.iso); 
      if(match.aqi=='-'){ match.aqi = '';}
      cardContainer.innerHTML = `
      <div class="card border-0 text-center bg-secondary card-height">
        <div class="card-header bg-transparent border-dark"><h3>${match.city.name}</h3></div>
        <div class="card-body d-flex align-items-center justify-content-center flex-column">
          <h5 class="card-title">
            <span style="color:${match.aqiDescription.color}">${match.aqi}</span> 
            <span style="color:${match.aqiDescription.color}">${match.aqiDescription.level}</span>
          </h5>
          <p class="card-text mb-0" style="color:${match.aqiDescription.color}">${match.aqiDescription.health}</p>
        </div>
        <div class="card-footer bg-transparent border-dark">${date}</div>
      </div>`
    }
  }
}

export default outputHtml;