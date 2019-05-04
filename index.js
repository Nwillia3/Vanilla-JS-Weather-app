const apiKey1 = "epKmq3cQ3bprIfyIrs5s8EC9wbUdPwtt"; // mines cant use on 5/2
const apiKey2 = "wJzJStEhgnn6wSVdxvK56XpvFE4sYeoC"; // movables
const apiKey3 = "K1Qex3tz0sk7UEdthlpGcHaVE5usimvY"; // mines cant use on 5/2
const apiKey4 = "oecMPG3nzJaOiiDZwD9bVZArAMVGK0NM"; // mines
const apiKey5 = "lDT5Ka1ymuq0o1xOaJbO7UGJmKTkPnG4"; // mines

const proxy = "https://cors-anywhere.herokuapp.com/";

class WeatherApp {

  getUrlParams = () => {
    let url = new URLSearchParams(location.search.substring(1));
    // console.log(url)
  
    let query = {
      zip: "10011",
      date: "05/03/2019"
    };
  
    // console.log("this should be first");
  
    url.forEach(function(value, key) {
      switch (key) {
        case "zipcode":
          query.zip = value;
          break;
        case "date":
          query.date = value;
          break;
      }
    });
  
    return query;
  };

  queryZipCode = async () => {
    console.log("this should be second");
  
    let params = this.getUrlParams();
    console.log(params);
    let url = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${apiKey4}&q=${params.zip}`;
  
    // wrap in a if statement to execute if there are params
    let data = await (await fetch(`${proxy}${url}`)).json();
    //   console.log(data);
    return data[0].Key;
  };
  
  changeAPI = async () => {
    console.log("this should be third");
  
    const key = await this.queryZipCode();
    const api = `${proxy}http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=${apiKey4}`;
    console.log(api);
    return api;
  };
  

  getData = async () => {
    console.log("this should be four");
    let queryDate;
    let api = await this.changeAPI();
    let query = await this.getUrlParams();
  
    if (query.date === "") {
      queryDate = new Date();
    } else {
      queryDate = new Date(query.date);
    }
  
    // fetch(api)
    fetch("data.json")
      .then(res => res.json())
      .then(data => {
        //   console.log(data);
        let output;
  
        const { DailyForecasts } = data;
        DailyForecasts.forEach(temp => {
          let forecastDate = new Date(temp.Date);
  
          if (queryDate <= forecastDate) {
            output += `
              <div class="days">
              <div class="forecast">
                <div class="box">
      
                  <span class="day"> 
                  
                      ${this.findDate(temp.Date)}
                  
                  </span>
                  <div class="temp">
                    <span class="icon">
                    <img src='https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/${
                      parseInt(temp.Day.Icon) < 10
                        ? "0" + temp.Day.Icon
                        : temp.Day.Icon
                    }-s.png'</span>
                    <div class="temp-details">
                      <h2 class="summary">${temp.Day.IconPhrase}</h2>
                      <div class="temperature">
                        <span class="high">${
                          temp.Temperature.Maximum.Value
                        }</span> /
                        <span class="low">${temp.Temperature.Minimum.Value}</span>
                        F
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              `;
          } else if (query.date === undefined) {
            console.log("time us up");
          }
        });
        document.querySelector(".days").innerHTML = output;
      })
      .catch(err => console.log(err));
  }
  

  findDate = date => {
    const convertDate = new Date(date);

    switch (convertDate.getDay()) {
      case 0:
        return "Sunday";
        break;
      case 1:
        return "Monday";
        break;
  
      case 2:
        return "Tuesday";
        break;
  
      case 3:
        return "Wednesday";
        break;
  
      case 4:
        return "Thursday";
        break;
  
      case 5:
        return "Friday";
        break;
      case 6:
        return "Saturday";
        break;
    }
  }

}

let App = new WeatherApp()
App.getData()



