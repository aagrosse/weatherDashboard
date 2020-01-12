var key = "3111507f84c92e1af42924418f205282"

$(".????").on("click", function(){
    // click event for previously searched city buttons
}


$(".fa-search").on("click", function(){
    //search button click event that starts all the fun
    var cityName= $("#input").val();
    $("#input").attr("placeholder", " Enter Another City")
    $("#input").val("")
    getWeather(cityName)
});


function getWeather(city) {
//get weather data from API and display in DOM
    if (city === ""){
        city = "atlanta";
    } else {
        city = city.toLowerCase();
    }
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key
    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
    console.log(response)

        });
    }
    
function getUV {
// an API call to get UV data an post data to the DOM
}

function makeCityBtn (city) {
// creates the city buttons after a search
}

function loadCitiyBtns () {
// loads previously searched city buttons from local storage
}

function saveCityBtns (city) {
// saves searched city to local storage
}

function getForcast(city) {
//ajax call to API to get weather info and print into DOM
}


    