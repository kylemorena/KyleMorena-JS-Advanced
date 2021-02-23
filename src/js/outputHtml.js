'use strict';
const outputHtml = {
  searchBar : function(match,matchList){
    let emptyArray= [];
    if(match.length>0){
      match.length=5;
      emptyArray = match.map(res=>{
        return res = `
        <a href="#" class="text-center text-dark bg-secondary no-decoration">
          <li class="list-group-item d-flex flex-column p-1 m-0" data-latlng="${res.station.geo[0]},${res.station.geo[1]}">
            <h6 class="mb-1" data-url="${res.station.url}">${res.station.name}</h6>
            <span class="mb-0" style="color:${res.aqiDescription.color}">
              ${res.aqi} ${res.aqiDescription.level}
            </span>
            <small class="mb-0">Updated: ${res.time.stime}</small>
          </li>
        </a>`;
      }).join('');
      matchList.innerHTML=emptyArray;
    }else{matchList.innerHTML = ''};
    return true;
  },
  widget : function(match,widgetContainer){
    if(match.length>0){
      widgetContainer.innerHTML = match.map(res=>{ 
        if(res.aqi=='-'){ res.aqi = '';}
        return res = `
        <a href="#" class="col p-3 a-custom" data-latlng="${res.lat};${res.lon}" >
          <div class="d-flex flex-column justify-content-center text-center bg-secondary">
            <h4 class="py-2 mb-0">${res.station.name}</h4>
            <p class="mb-0">
              <span style="color:${res.aqiDescription.color}">${res.aqi}</span> 
              <span style="color:${res.aqiDescription.color}">${res.aqiDescription.level}</span>
            </p>
            <small class="py-2 px-1">${new Date(res.station.time)}</small>
          </div>
        </a>`
      }).join('');
    }
    else {
      console.log(match)
      widgetContainer.innerHTML = `
      <a href="#" class="col p-3 a-custom" data-latlng="${match.city.geo[0]};${match.city.geo[1]}" >
          <div class="d-flex flex-column justify-content-center text-center bg-secondary">
            <h4 class="py-2 mb-0">${match.city.name}</h4>
            <p class="mb-0">
              <span style="color:${match.aqiDescription.color}">${match.aqi}</span> 
              <span style="color:${match.aqiDescription.color}">${match.aqiDescription.level}</span>
            </p>
            <small class="py-2 px-1">${match.aqiDescription.value}</small>
          </div>
      </a>`
    }
  },
  card: function(match,cardContainer){
    if(match!=null){
      const date = (match.time.iso==null)?match.aqiDescription.value : new Date(match.time.iso); 
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