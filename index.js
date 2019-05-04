const apiKey1 = "epKmq3cQ3bprIfyIrs5s8EC9wbUdPwtt"; // mines cant use on 5/2
const apiKey2 = "wJzJStEhgnn6wSVdxvK56XpvFE4sYeoC"; //movables
const apiKey3 = "K1Qex3tz0sk7UEdthlpGcHaVE5usimvY"; //mines cant use on 5/2
const apiKey4 = "oecMPG3nzJaOiiDZwD9bVZArAMVGK0NM"; //  mines
const apiKey5 = "lDT5Ka1ymuq0o1xOaJbO7UGJmKTkPnG4"; // mines

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

// global variable
let result = {};

// query Zip Code
let queryZipCode = async () => {
  console.log("this should be second");

  let params = getUrlParams();
  console.log(params);
  let url = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${apiKey3}&q=${
    params.zip
  }`;

  // wrap in a if statement to execute if there are params
  let data = await (await fetch(`${proxy}${url}`)).json();
  //   console.log(data);

  return (result = { code: data[0].Key, city: data[0].LocalizedName });
};

let changeAPI = async () => {
  console.log("this should be third");

  const key = await queryZipCode();
  console.log(key);
  const api = `${proxy}
http://dataservice.accuweather.com/forecasts/v1/daily/5day/${
    key.code
  }?apikey=${apiKey3}
`;
  //   console.log(api);
  return api;
};

// fake data for now
let getData = async () => {
  console.log("this should be four");
  console.log(result);
  let queryDate;
  let api = await changeAPI();
  let query = await getUrlParams();
  console.log(typeof query.date);
  if (query.date === "") {
    queryDate = new Date();
  } else {
    queryDate = new Date(query.date);
  }

  fetch(api)
    //   fetch("data.json")
    .then(res => res.json())
    .then(data => {
      //   console.log(data);
      let output;
      let todayDate = new Date();

      const { DailyForecasts } = data;
      DailyForecasts.forEach(temp => {
        let forecastDate = new Date(temp.Date);
        console.log(forecastDate);
        if (queryDate.getDay() < todayDate.getDate()) {
          output = "";
          console.log(queryDate, todayDate);
        } else if (queryDate <= forecastDate) {
          console.log(queryDate.getDay(), todayDate.getDay());

          output += `
            <div class="forecast">
                <div class="box">
                    <span class="day"> ${findDate(temp.Date)}  </span>    
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
    })
    .catch(err => console.log(err));
};

getData();

// query the date

let findDate = date => {
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
