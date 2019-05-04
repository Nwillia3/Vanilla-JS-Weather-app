const apiKey1 = "epKmq3cQ3bprIfyIrs5s8EC9wbUdPwtt"; // mines cant use on 5/2
const apiKey2 = "wJzJStEhgnn6wSVdxvK56XpvFE4sYeoC"; //movables
const apiKey3 = "K1Qex3tz0sk7UEdthlpGcHaVE5usimvY"; //mines cant use on 5/2
const apiKey4 = "oecMPG3nzJaOiiDZwD9bVZArAMVGK0NM"; //  mines
const apiKey5 = "lDT5Ka1ymuq0o1xOaJbO7UGJmKTkPnG4"; // mines

const proxy = "https://cors-anywhere.herokuapp.com/";

class WeatherApp {
  getUrlParams = () => {
    let url = new URLSearchParams(location.search.substring(1));
    let query = {
      zip: "",
      date: ""
    };

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

  getCityValues = async () => {
    let params = this.getUrlParams();
    let url = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${apiKey2}&q=${
      params.zip
    }`;

    // wrap in a if statement to execute if there are params
    let data = await (await fetch(`${proxy}${url}`)).json();

    let cityValues = {
      cityToken: data[0].Key,
      cityName: data[0].LocalizedName
    };
    return cityValues;
  };

  dataApi = async () => {
    const key = await this.getCityValues();
    const api = `${proxy}
      http://dataservice.accuweather.com/forecasts/v1/daily/5day/${
        key.cityToken
      }?apikey=${apiKey3}
      `;
    return api;
  };

  //fetches the Data and display
  getData = async () => {
    //   fetch(api)
    // let api = await this.dataApi();

    let res = await fetch("data.json");
    let data = res.json();

    return data;
  };

  displayData = async () => {
    let queryDate;
    let query = await this.getUrlParams();
    let cityName = await this.getCityValues();
    if (query.date === "") {
      queryDate = new Date();
    } else {
      queryDate = new Date(query.date);
    }

    let data = await this.getData();
    let output;
    let header;
    let todayDate = new Date();

    const { DailyForecasts } = data;
    try {
      DailyForecasts.forEach(temp => {
        let forecastDate = new Date(temp.Date);
        if (queryDate.getDay() < todayDate.getDate()) {
          output = "";
          header = "";
        } else if (queryDate <= forecastDate) {
          header = `
            <div class="container">
                <div class="city">
                    <h1 class="city-name">
                    WEATHER FORECAST FOR 
                    <span> ${cityName.cityName}</span>
                    </h1>
                </div>
            </div>`;

          output += `
            <div class="forecast">
                <div class="box">
                    <span class="day"> ${this.findDate(temp.Date)}  </span>    
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
                                <span class="low">${
                                  temp.Temperature.Minimum.Value
                                }</span>
                                F
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
      });
      document.querySelector(".days").innerHTML = output;
      document.querySelector(".city").innerHTML = header;
    } catch (err) {
      console.log(err);
    }
  };

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
  };
}

let App = new WeatherApp();
App.displayData();
