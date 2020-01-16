$(document).ready(function() {
    loadCityBtns ()
    getWeather()
});


var key = "3111507f84c92e1af42924418f205282";


$(".searches").on("click", "button", function() {
    city = $(this).attr("cityData");
    getWeather(city);
  });


$(".fa-search").on("click", function(){
    //search button click event that starts all the fun
    var cityName= $("#input").val();
    $("#input").attr("placeholder", " Enter Another City")
    $("#input").val("")
    getWeather(cityName)
    
});


function getWeather(city) {
//get weather data from API and display in DOM
    if (city === "" || city === undefined){
        city = "atlanta";
    } else {
        city = city.toLowerCase();
    }
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=imperial"
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {

        200: function(response) {
            $("#location").text(response.name);
            $("#day").text(moment().format("(MM/DD/YYYY)"));
            $("#icon").attr("src", "https://openweathermap.org/img/wn/" + (response.weather[0].icon) + "@2x.png");
            $("#temp").text("Tempurature: " + Math.floor(response.main.temp) + "°F with " + response.weather[0].description);
            $("#humidity").text("Relative Humidity: " + (response.main.humidity) + "%");
            $("#wind").text("Wind Speed: " + (response.wind.speed) + "mph");
    
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUV (lat, lon);
            getForcast(city);

            if (!searchArr.includes(city.toLowerCase())) {
                searchArr.push(city);
                saveCityBtns(city);
                makeCityBtn(city);
              }
        }
    }
});

        
    
    
function getUV (lat, lon) {
// an API call to get UV data an post data to the DOM
var latitude = lat;
var longitude = lon;
var uvQuery = "http://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + latitude + "&lon=" + longitude

$.ajax({
    url: uvQuery,
    method: "GET"
  }).then(function(response) {
    $("#uvIndex").text(response.value);
    var uv = response.value;
    if (uv < 3) { 
        $("#uvIndex").addClass("badge-success")
      } else if (uv < 7) { 
        $("#uvIndex").addClass("badge-warning")
      } else if (uv < 11) { 
        $("#uvIndex").addClass("badge-danger")
      }
  });
}





function makeCityBtn (city) {
// creates the city buttons after a search
let cityBtn = $("<button>").text(city);
  cityBtn.addClass("btn btn-outline-info btn-block");
  cityBtn.attr("cityData", city);

  $(".searches").append(cityBtn);
}
}

function loadCityBtns () {
// loads previously searched city buttons from local storage
if (localStorage.getItem("searchList") === null) {
    searchArr = ["Austin", "New York", "San Diego", "Orlando"];
  } else {
    searchArr = JSON.parse(localStorage.getItem("searchList"));
    searchArr.forEach(function(city) {
      makeCityBtns(city);
    });
  }
}


function saveCityBtns (city) {
// saves searched city to local storage
localStorage.setItem("cityList", JSON.stringify(searchArr));
}


function getForcast(city) {
//ajax call to API to get weather info and print into DOM
var queryURL = "https://api.openweathermap.org/data/2.5/forecast/?q=" + city + ",us&units=imperial&APPID="+ key;

console.log(queryURL)


//ajax call to get forcast and put data into an object (weatherObject)
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
console.log(response)
let forcastDayArr = [];

for (let i = 1; i < 40; i++) {
    let forcastDay = moment(response.list[i].dt_txt).format("YYYY-MM-DD");
    if (!forcastDayArr.includes(forcastDay)) {
      forcastDayArr.push(forcastDay);
    }
  }

  const today = moment().format("YYYY-MM-DD");
  if (forcastDayArr.includes(today)) {
    const index = forcastDayArr.indexOf(today);
    forcastDayArr.splice(index, 1);
  }

  for (let j = 0; j < forcastDayArr.length; j++) {
    let maxTempArr = [];
    let temps = [];
    let max = 0;

    for (let k = 0; k < 40; k++) {
      let forcastDay = moment(response.list[k].dt_txt).format("YYYY-MM-DD");

      if (forcastDayArr[j] === forcastDay) {
        const tempurature = response.list[k].main.temp;

        if (tempurature > max) {
          max = tempurature;

          icon = response.list[k].weather[0].icon;
          icon = icon.replace(/n/g, "d");

          $(".card-day-" + j).text(moment(forcastDayArr[j]).format("dddd"));
          $(".card-title-" + j).text(moment(forcastDayArr[j]).format("MM/DD/YYYY"));
          $(".icon-" + j).attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
          $(".tempHi-" + j).text(`Temp: ${Math.floor(max)}°F`);
          $(".humidity-" + j).text(`Humidity: ${Math.floor(response.list[k].main.humidity)}%`);
        }
      }
    }
  }
});
}

// for (let i = 1; i < response.list.length; i++) {
//     var current = response.list[i] 
   
//     var weatherObject = {
//         icon: "http://openweathermap.org/img/w/" + (current.weather[0].icon) + ".png",
//         minTemp: current.main.temp_min,
//         maxTemp: current.main.temp_max,
//         humidity: current.main.humidity,
//         date: (convertDate(current.dt_txt))
//     };
    
//       forcastArray.push(weatherObject);
// }

// console.log(weatherObject)




// });

// }

function convertDate (x) {
var parts = x.split('-');
var day = parts[2].split('',2);
var newdate = parts[1]+'/'+day[0]+day[1]+'/'+parts[0];

console.log(x)
}


