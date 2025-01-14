const apiKey = "4f75ec5059bbc86b93037d235672ad06";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const apiUrl1 = "http://api.openweathermap.org/geo/1.0/direct?limit=5&q="


const searchInput = document.querySelector(".search-input input");
const searchBoxBtn = document.querySelector(".search-box");
const searchDiv = document.querySelector(".search-input");
const weatherIcon = document.querySelector(".weather-icons img")
const weatherImg= document.querySelector(".card-weather")
const dayIcon = document.querySelectorAll(".day-col img");
const searchIcon = document.querySelector(".search-input img")


// inputun icine giren degere gore altta sonuclarin getirlmesini sagladik
searchInput.addEventListener("input", async (e) => {
     checkName(e.target.value)
     if (e.target.value) {
          try {
               await checkName(e.target.value);
          } catch (error) {
               console.error("Error fetching city data:", error);
          }
     }
     searchBoxBtn.style.display = "block";

})

// gelen value degerini sehir olarak almaya calistik
async function checkName(query) {
     const response = await fetch(apiUrl1 + query + `&appid=${apiKey}`);
     var cities = await response.json();
     console.log(cities)

     cities.forEach((city) => {
          searchBoxBtn.textContent = `${city.name}, ${city.country}`;
          searchBoxBtn.addEventListener("click", () =>{
          checkWeather(searchInput.value);// hava durumunu yazsin
               searchIcon.style.display = "block"; // img açılır
               searchIcon.style.opacity = "1"; // Resmi yavaşça göster
               searchIcon.style.transition = "opacity 0.3s ease-out";
               searchBoxBtn.style.display = "none";
          });
          searchDiv.appendChild(searchBoxBtn);
     });
}


async function checkWeather(city) {
     const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
     var data = await response.json(); // promise json olarak cevirdik
     console.log(data); 
     

     document.querySelector(".city").innerHTML = data.city.name + ", "  + data.city.country; 
     document.querySelector(".date").innerHTML = getdataTime(data.list[0].dt_txt);// tarihi almasi icin fonksiyon yazdik
     document.querySelector(".temp").innerHTML = Math.round(data.list[0].main.temp) + " C";
     document.querySelector(".temp-t").innerHTML = Math.round(data.list[0].main.temp_max) + " C / " + Math.round(data.list[0].main.temp_min) + " C";
     document.querySelector(".temp-h").innerHTML = data.list[0].clouds.all + " Clouds";
    
     
     weatherBack(data);// datayi gonderdik // Saate gore arkaplan ve ikon degisimi

     document.querySelector(".temp-1").innerHTML = Math.round(data.list[0].main.temp) + " C";
     // Yagmur Bilgisini almak icin
     if (data.list[0].rain && data.list[0].rain["3h"] !== undefined) {
          document.querySelector(".rain").innerHTML = Math.round(data.list[0].rain["3h"]) + " %";
     } else {
          document.querySelector(".rain").innerHTML = "0 %";
     }

     document.querySelector(".wind").innerHTML = data.list[0].wind.speed + " km/h";
     document.querySelector(".humidity").innerHTML = data.list[0].main.humidity + " %";


     document.querySelector(".weather").style.display= "block";
     
     document.querySelector(".card-header").style.display = "none"// weather classi aciliyor

}

// ------------------------------ Gelen zamana gore gun, ay, yil yazdirir----------------------------------------------
function getdataTime(date){
     var now = new Date(date)
     var hour = now.getHours()
     var minute = now.getMinutes();

     var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

     return `${ days[now.getDay()] }, ${ months[now.getMonth()] } ${ now.getDate() }, ${ now.getFullYear() }`;
}



function weatherBack(data){// anlik olorak hava durumu ikon ve image degsimleri
     var now = new Date();
     var hours = now.getHours();
     var now1 = new Date(data.list[0].dt_txt);

     var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     


     if(days[now1.getDay()] == days[now.getDay()]){ // 
          document.querySelectorAll(".day")[0].innerHTML = days[now1.getDay()]; // ilk gunu yazdirdik
          document.querySelectorAll(".high-temp")[0].innerHTML = Math.round(data.list[0].main.temp_max) + "C";
          document.querySelectorAll(".low-temo")[0].innerHTML = Math.round(data.list[0].main.temp_min) + " C ";

          
          for (var i = 1; i <= 4; i++) {
               now1.setDate(now1.getDate() + 1);  // Günleri ilerletmek için 1 gün ekledik
               document.querySelectorAll(".day")[i].innerHTML = days[now1.getDay()];
              // document.querySelector(".day-col img")[i] = getDayIcon();
               dayIcon[i].src = getDayIcon(data.list[i].weather[0].main);// ilgili iconu alir
               document.querySelectorAll(".high-temp")[i].innerHTML = Math.round(data.list[i].main.temp_max) + " C ";
               document.querySelectorAll(".low-temo")[i].innerHTML = Math.round(data.list[i].main.temp_min) + " C ";
          }
     
          // card-hedaerdaki gorsel ve iconlari degistirir
          if ((data.list[0].weather[0].main == "Clear") && (hours >= 6 && hours <= 18)) {
               weatherIcon.src = "images/Weather=Clear, Moment=Day.svg";
               weatherImg.style.backgroundImage = "url('images/Weather=Clear, Moment=Day.png')";
          } else if ((data.list[0].weather[0].main == "Clear") && ((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 5))) {
               weatherIcon.src = "images/Weather=Clear, Moment=Night.svg";
           
               weatherImg.style.backgroundImage = "url('images/Weather=Clear, Moment=Night.png')";
          } else if ((data.list[0].weather[0].main == "Cloudy") && (hours >= 6 && hours <= 18)) {
               weatherIcon.src = "images/Weather=Cloudy, Moment=Day.svg";
              
               weatherImg.style.backgroundImage = "url('images/Weather=Cloudy, Moment=Day.png')";
          } else if ((data.list[0].weather[0].main == "Cloudy") && ((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 5))) {
               weatherIcon.src = "images/Weather=Cloudy, Moment=Night.svg";
            
               weatherImg.style.backgroundImage = "url('images/Weather=Cloudy, Moment=Night.png')";
          } else if ((data.list[0].weather[0].main == "Clouds") && (hours >= 6 && hours <= 18)) {
               weatherIcon.src = "images/Weather=Few Clouds, Moment=Day.svg";
              
               weatherImg.style.backgroundImage = "url('images/Weather=Few Clouds, Moment=Day.png')";
          } else if ((data.list[0].weather[0].main == "Clouds") && ((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 5))) {
               weatherIcon.src = "images/Weather=Few Clouds, Moment=Night.svg";
             
               weatherImg.style.backgroundImage = "url('images/Weather=Few Clouds, Moment=Night.png')";
          } else if ((data.list[0].weather[0].main == "Rain") && (hours >= 6 && hours <= 18)) {
               weatherIcon.src = "images/Weather=Rain, Moment=Day.svg";
        
               weatherImg.style.backgroundImage = "url('images/Weather=Rain, Moment=Day.png')";
          } else if ((data.list[0].weather[0].main == "Rain") && ((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 5))) {
               weatherIcon.src = "images/Weather=Rain, Moment=Night.svg";
              
               weatherImg.style.backgroundImage = "url('images/Weather=Rain, Moment=Night.png')";
          } else if ((data.list[0].weather[0].main == "Storm") && (hours >= 6 && hours <= 18)) {
               weatherIcon.src = "images/Weather=Storm, Moment=Day.svg";
      
               weatherImg.style.backgroundImage = "url('images/Weather=Storm, Moment=Day.png')";
          } else if ((data.list[0].weather[0].main == "Storm") && ((hours >= 19 && hours <= 23) || (hours >= 0 && hours <= 5))) {
               weatherIcon.src = "images/Weather=Storm, Moment=Night.svg";
               
               weatherImg.style.backgroundImage = "url('images/Weather=Storm, Moment=Night.png')";
          }
     }// 

     
     function getDayIcon(weatherCondition) {
          //var now = new Date(data);
          //var hours = now.getHours();
               if(weatherCondition == "Clear"){
                    return "images/Weather=Clear, Moment=Day.svg";
               }else if (weatherCondition == "Cloudy") {
                    return "images/Weather=Cloudy, Moment=Day.svg";
               }else if (weatherCondition == "Clouds"){
                    return "images/Weather=Few clouds, Moment=Day.svg";}
               else if (weatherCondition == "Rain"){
                    return "images/Weather=Rain, Moment=Day.svg";
               }else if (weatherCondition == "Storm"){
                    return "images/Weather=Storm, Moment=Day.svg";

               } else if (weatherCondition == "Snow") {
                    return "images/Weather=Rain, Moment=Day.svg";
               }
                else {
                    return ;// Bilinmeyen durumlar için
               }
     }
}







