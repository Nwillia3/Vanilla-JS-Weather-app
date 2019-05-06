// const apiKey1 = "epKmq3cQ3bprIfyIrs5s8EC9wbUdPwtt"; // mines cant use on 5/2
// const apiKey2 = "wJzJStEhgnn6wSVdxvK56XpvFE4sYeoC"; //movables
// const apiKey3 = "K1Qex3tz0sk7UEdthlpGcHaVE5usimvY"; //mines cant use on 5/2
// const apiKey4 = "oecMPG3nzJaOiiDZwD9bVZArAMVGK0NM"; //  mines
// const apiKey5 = "lDT5Ka1ymuq0o1xOaJbO7UGJmKTkPnG4"; // mines

const apiKey1 = config.APIKEY1;
const apiKey2 = config.APIKEY2;
const apiKey3 = config.APIKEY3;
const apiKey4 = config.APIKEY4;
const apiKey5 = config.APIKEY5;

const proxy = "https://cors-anywhere.herokuapp.com/";

class WeatherApp {
  getUrlParams = () => {
    let params = new URLSearchParams(location.search.substring(1)); // stores the url params into an array
    let query = {
      zip: "",
      date: ""
    };

    params.forEach((value, key) => {
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
    let url = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${apiKey5}&q=${
      params.zip
    }`;

    let data = await (await fetch(`${proxy}${url}`)).json();

    let cityValues = {
      cityToken: data[0].Key,
      cityName: data[0].LocalizedName
    };
    return cityValues;
  };

  getForecastApi = async () => {
    const key = await this.getCityValues();
    const api = `${proxy}http://dataservice.accuweather.com/forecasts/v1/daily/5day/${
      key.cityToken
    }?apikey=${apiKey5}
      `;
    return api;
  };

  //fetches the Data
  getData = async () => {
    let api = await this.getForecastApi();

    let res = await fetch(api);
    let data = await res.json();

    return data;
  };

  // takes the string date and convert into a day of the week
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
    let output = ""; // to prevent an undefined from rendering on the page
    let header;
    let todayDate = new Date();

    const { DailyForecasts } = data;

    let lastDay = new Date(DailyForecasts[4].Date);
    console.log(queryDate.getDate(), lastDay.getDate());

    //render blank screen if the date entered is outside of the 5 days forecast scope
    if (
      queryDate.getDate() > lastDay.getDate() ||
      queryDate.getDate() < todayDate.getDate()
    ) {
      document.querySelector(".days").innerHTML = "";
      document.querySelector(".city").innerHTML = "";
    } else {
      DailyForecasts.forEach(temp => {
        let forecastDate = new Date(temp.Date);
        console.log(forecastDate, queryDate);

        //  if an invalid date is provided return blank screen
        if (isNaN(queryDate.getDate())) {
          console.log("please enter a valid date");
          output = "";
          header = "";
          console.log("empty1");
        } else if (queryDate.getDate() <= forecastDate.getDate()) {
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
                          <span class="day"> ${this.findDate(
                            temp.Date
                          )} </span>    
                          <div class="temp">
                              <span class="icon">
                              <img src='https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/${
                                parseInt(temp.Day.Icon) < 10
                                  ? "0" + temp.Day.Icon
                                  : temp.Day.Icon
                              }-s.png'</span>
                              <div class="temp-details">
                                  <h2 class="summary">${
                                    temp.Day.IconPhrase
                                  }</h2>
                                  <div class="temperature">
                                      <span class="high">${
                                        temp.Temperature.Maximum.Value
                                      }°</span> /
                                      <span class="low">${
                                        temp.Temperature.Minimum.Value
                                      }° F</span>
                                      
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
    }
  };
}

let App = new WeatherApp();
App.displayData();
