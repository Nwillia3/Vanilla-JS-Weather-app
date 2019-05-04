let getData = async () => {
  console.log("this should be four");
  // let api = await changeAPI();
  // let query = await getUrlParams();
  // console.log(typeof query.date);

  let query = {
    zip: "11233",
    date: "05/09/2019"
  };

  // fetch(api)

  const queryDate = new Date(query.date);
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      //   console.log(newDate);
      let output;

      const { DailyForecasts } = data;
      DailyForecasts.forEach(temp => {
        let forecastDate = new Date(temp.Date);
        console.log(temp.Date);

        if (queryDate <= forecastDate) {
          output += `
              <div class="days">
              <div class="forecast">
                <div class="box">
      
                  <span class="day"> 
                  
                      ${findDate(temp.Date)}
                  
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
        } else if (query.date === undefined) {
          console.log("time us up");
        }
      });
      document.querySelector(".days").innerHTML = output;
    })
    .catch(err => console.log(err));
};

getData();

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
