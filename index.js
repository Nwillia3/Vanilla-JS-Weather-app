const apiKey1 = "epKmq3cQ3bprIfyIrs5s8EC9wbUdPwtt"; // mines cant use on 5/2
const apiKey2 = "wJzJStEhgnn6wSVdxvK56XpvFE4sYeoC"; //movables
const apiKey3 = "K1Qex3tz0sk7UEdthlpGcHaVE5usimvY"; //mines cant use on 5/2
const apiKey4 = "oecMPG3nzJaOiiDZwD9bVZArAMVGK0NM"; //  mines

const proxy = "https://cors-anywhere.herokuapp.com/";

//query paramaters search function
let getUrlParams = () => {
  let url = new URLSearchParams(location.search.substring(1));
  let query = {
    zip: "",
    date: ""
  };

  console.log("this should be first");

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

// query Zip Code
let queryZipCode = async () => {
  console.log("this should be second");

  let params = getUrlParams();
  console.log(params);
  let url = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${apiKey2}&q=${
    params.zip
  }`;

  // wrap in a if statement to execute if there are params
  let data = await (await fetch(`${proxy}${url}`)).json();
  console.log(data);
  return data[0].Key;
};

let changeAPI = async () => {
  console.log("this should be third");

  const key = await queryZipCode();
  const api = `${proxy}
http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=${apiKey2}
`;
  console.log(api);
  return api;
};

// fake data for now
let getData = async () => {
  console.log("this should be four");
  let api = await changeAPI();
  fetch(api)
    .then(res => res.json())
    .then(data => {
      //   console.log(data);
      let output;

      const { DailyForecasts } = data;
      //   console.log(DailyForecasts);
      DailyForecasts.forEach(temp => {
        output += `
        <div class="days">
        <div class="forecast">
          <div class="box">
            <span class="day"> ${temp.Date.substring(0, 10)}</span>
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
                  <span class="high">${temp.Temperature.Maximum.Value}</span> /
                  <span class="low">${temp.Temperature.Minimum.Value}</span>
                  F
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
      });
      document.querySelector(".days").innerHTML = output;
    })
    .catch(err => console.log(err));
};

getData();
