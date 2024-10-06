const loading = document.querySelector(".loading");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnsearch");


// Function to get weather for a default city if geolocation is not available
function getDefaultWeather() {
    getWeather("Qalyub");
}

// Check if geolocation is supported
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let q = `${latitude},${longitude}`;
        getWeather(q);
    }, () => {
        
        getDefaultWeather();
    });
} else {
    getDefaultWeather(); 
}

async function getWeather(city) {
   console.log(city,"city_name");
   let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=cbf7bc53a4d149b7bc5105910240510&q=${city}&days=3`);
    console.log(response);
    
        let data = await response.json();
        
        display(data);
   
}

const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
];

btnSearch.addEventListener("click", function () {
    let city = searchInput.value.trim(); // Trim the input to remove extra spaces
    if (city) { // Check if the input is not empty
        getWeather(city);
        clearInput();
    
    } else {
        alert("Please enter a city name."); 
    }
});

searchInput.addEventListener("keydown", function (e) {
   
    if (e.key === "Enter") {
        e.preventDefault()

        let city = searchInput.value; 
        if (city) {
            getWeather(city);
            clearInput();
           
        } else {
            alert("Please enter a city name.");
        }
    }
});

function display(data) {
 
    let cartona = ``; // Initialize the cartona variable
    for (let i = 0; i < data.forecast.forecastday.length; i++) {
        let date = new Date(data.forecast.forecastday[i].date);
        if (i === 0) {
            cartona += `
            <div class="col-sm-6 col-lg-4 ">
                <div class="bg-white p-4 h-100 rounded shadow">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                        <p class="m-0 date">${days[date.getDay()]}</p>
                        <h3 class="date fw-normal m-0">${date.getDate()} ${months[date.getMonth()]}</h3>
                    </div>
                    <h1 class="text-warning text-start city"><i class="fa-solid fa-city pe-2"></i>${data.location.name}</h1>
                    <p class="m-2 fw-bold head">${data.current.temp_c}<span class="deg">°</span>C</p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <img src="${data.current.condition.icon}" alt="weather icon" />
                        <p class="text-primary m-0">${data.current.condition.text}</p>
                    </div>
                </div>
            </div>
            `;
        } else {
            cartona += `
            <div class="col-sm-6 col-lg-4">
                <div class="bg-white p-4 h-100 rounded shadow">
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                        <p class="m-0 date ">${days[date.getDay()]}</p>
                        <h3 class="date fw-normal m-0">${date.getDate()} ${months[date.getMonth()]}</h3>
                    </div>
                    <img src="${data.forecast.forecastday[i].day.condition.icon}" class="mb-4" alt="weather icon" />
                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <div>
                            <p class="mb-2 fs-5 text-danger">${data.forecast.forecastday[i].day.maxtemp_c}<span class="deg">°</span>C</p>
                            <p class="m-0 text-info">${data.forecast.forecastday[i].day.mintemp_c}<span class="deg">°</span>C</p>
                        </div>
                        <p class="text-primary m-0">${data.forecast.forecastday[i].day.condition.text}</p>
                    </div>     
                </div>
            </div>
            `;
        }
    }

    // Update the HTML with the generated content
    document.getElementById("rowData").innerHTML = cartona;
}

function clearInput() {
    searchInput.value = ''; // Clear the input field
}
