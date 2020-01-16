$(document).ready(function() {
    loadCityBtns ()
    getWeather()
});

var currentCity = "atlanta";
var searchArr = JSON.parse(localStorage.getItem("searchList"));
var key = "3111507f84c92e1af42924418f205282";


$(".searches").on("click", "button", function() {
    city = $(this).attr("cityData");
    getWeather(city);
  });


  $("#citySearch").on("click", function(){
    //search button click event that starts all the fun
    var cityName= $("#input").val();
    $("#input").attr("placeholder", " Enter Another City")
    $("#input").val("")
    getWeather(cityName)
    
});

function loadCityBtns () {
    // loads previously searched city buttons from local storage
    if (localStorage.getItem("searchList") === null) {
        searchArr = [];
      } else {
        
        searchArr.forEach( function(city) {
            let cityBtn = $("<button>").text(city);
            cityBtn.addClass("btn btn-outline-info btn-block");
            cityBtn.attr("cityData", city);

             $(".searches").append(cityBtn);

          
        });
      }
    }





function getWeather(city) {
//get weather data from API and display in DOM
    if (city === "" || city === undefined){
        city = currentCity;
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
                var cityBtn = $("<button>").text(city);
                cityBtn.addClass("btn btn-outline-info btn-block");
                cityBtn.attr("cityData", city);

                $(".searches").append(cityBtn);

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
        $("#uvIndex").removeClass()
        $("#uvIndex").addClass("badge badge-success")
      } else if (uv < 7) { 
        $("#uvIndex").removeClass()
        $("#uvIndex").addClass("badge badge-warning")
      } else if (uv < 11) { 
        $("#uvIndex").removeClass()
        $("#uvIndex").addClass("badge badge-danger")
      }
  });
}





function makeCityBtn (city) {
// creates the city buttons after a search
var cityBtn = $("<button>").text(city);
  cityBtn.addClass("btn btn-outline-info btn-block");
  cityBtn.attr("cityData", city);

  $(".searches").append(cityBtn);
}
}




function saveCityBtns (city) {
// saves searched city to local storage
localStorage.setItem("searchList", JSON.stringify(searchArr));
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
var forcastDayArr = [];

for (var i = 1; i < 40; i++) {
    var forcastDay = moment(response.list[i].dt_txt).format("YYYY-MM-DD");
    if (!forcastDayArr.includes(forcastDay)) {
      forcastDayArr.push(forcastDay);
    }
  }

  var today = moment().format("YYYY-MM-DD");
  if (forcastDayArr.includes(today)) {
    var index = forcastDayArr.indexOf(today);
    forcastDayArr.splice(index, 1);
  }

  for (var j = 0; j < forcastDayArr.length; j++) {
    var maxTempArr = [];
    var temps = [];
    var max = 0;

    for (let k = 0; k < 40; k++) {
      var forcastDay = moment(response.list[k].dt_txt).format("YYYY-MM-DD");

      if (forcastDayArr[j] === forcastDay) {
        var tempurature = response.list[k].main.temp;

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


function convertDate (x) {
var parts = x.split('-');
var day = parts[2].split('',2);
var newdate = parts[1]+'/'+day[0]+day[1]+'/'+parts[0];

console.log(x)
}


