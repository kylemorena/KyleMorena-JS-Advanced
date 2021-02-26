'use strict';
const outputHtml = {
  searchBar : function(match,matchList){
    let emptyArray= [];
    if(match.length>0){
      match.length=5;
      emptyArray = match.map(res=>{
        if(res.aqi=='-'){ res.aqi = '';}
        return res = `
          <a href="#" class=" d-flex flex-column flex-fill p-1" data-latlng="${res.station.geo[0]},${res.station.geo[1]}">
            <h5 class="mb-1" data-url="${res.station.url}">${res.station.name}</h5>
            <p class="lead mb-0">
              <strong style="color:${res.aqiDescription.color}">${res.aqi} ${res.aqiDescription.level}</strong> 
              <small>Last update: ${res.time.stime}</small>
            </p>
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
        <a href="#" class="col p-3 no-decoration" data-latlng="${res.lat};${res.lon}" >
          <div class="d-flex flex-column justify-content-center text-center bg-secondary">
            <h4 class="p-2 mb-0">${res.station.name}</h4>
            <p class="lead mb-0">
              <strong style="color:${res.aqiDescription.color}">${res.aqi}</strong> 
              <strong style="color:${res.aqiDescription.color}">${res.aqiDescription.level}</strong>
            </p>
            <p class="p-2 mb-0"><small>${new Date(res.station.time)}</small></p>
          </div>
        </a>`
      }).join('');
    }
    else {
      widgetContainer.innerHTML = `
      <a class="col p-3 no-decoration" data-latlng="${match.city.geo[0]};${match.city.geo[1]}" >
          <div class="d-flex flex-column justify-content-center text-center bg-secondary">
            <h4 class="p-2 mb-0">${match.city.name}</h4>
            <p class="lead mb-0">
              <strong style="color:${match.aqiDescription.color}">${match.aqi}</strong> 
              <strong style="color:${match.aqiDescription.color}">${match.aqiDescription.level}</strong>
            </p>
            <p class="p-2 mb-0"><small>${match.aqiDescription.value}</small></p>
          </div>
      </a>`
    }
  },
  card: function(match,cardContainer){
    if(match!=null){
      const date = (match.time.iso==null)?match.aqiDescription.value : new Date(match.time.iso); 
      if(match.aqi=='-'){ match.aqi = '';}
      if(match.iaqi!=null){
        cardContainer.innerHTML = `
        <div class="card border-0 text-center bg-secondary card-height">
          <div class="card-header bg-transparent border-dark">
            <h2>${match.city.name}</h2>
          </div>
          <div class="card-body d-flex align-items-center justify-content-center flex-column">
            <h3 class="card-title">
              <span style="color:${match.aqiDescription.color}">${match.aqi}</span> 
              <span style="color:${match.aqiDescription.color}">${match.aqiDescription.level}</span>
            </h3>
            <p class="lead card-text mb-0">${match.aqiDescription.health}</p>
            <ul class="list-group list-group-flush mt-3 rounded-lg">
              <li class="list-group-item bg-transparent">Temp: ${match.iaqi.t.v}°C</li>
              <li class="list-group-item bg-transparent">Pressure: ${match.iaqi.p.v}</li>
              <li class="list-group-item bg-transparent">Humidity: ${match.iaqi.h.v}%</li>
              <li class="list-group-item bg-transparent">Wind: ${match.iaqi.w.v} km/h</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent border-dark">${date}</div>
        </div>`
      }else{
        cardContainer.innerHTML = `
        <div class="card border-0 text-center bg-secondary card-height">
          <div class="card-header bg-transparent border-dark">
            <h2>${match.city.name}</h2>
          </div>
          <div class="card-body d-flex text-center justify-content-center flex-column">
            <h3 class="card-title">
              <span style="color:${match.aqiDescription.color}">${match.aqi}</span> 
              <span style="color:${match.aqiDescription.color}">${match.aqiDescription.level}</span>
            </h3>
          </div>
          <div class="card-footer bg-transparent border-dark">${date}</div>
        </div>`
      }
    }
  },
  table: function(match,tableContainer){
    tableContainer.innerHTML= match.map(info=>{
      return info = `
      <tr>
        <th scope="row" class="align-middle aqi-width" style="color:${info.color}">${info.value}</th>
        <td class="align-middle" style="color:${info.color}">${info.level}</td>
        <td class="align-middle" style="color:${info.color}">${info.health}</td>
        <td class="align-middle" style="color:${info.color}">${info.cautionary}</td>
      </tr> `
    }).join('');
  }
}

export default outputHtml;