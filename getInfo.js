function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        
    }
    else
    {
        alert("Geolocation is not sported")
    }
}

function showPosition(position)
{
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    getWeather(latitude, longitude);

}

function showError(error)
{
    switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
      }
}

function submitCoords()
{
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    getWeather(latitude, longitude);
}

async function getWeather(lat, long)
{
    const dayForecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,rain,snowfall,cloud_cover,is_day&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=1`;

    const currentForecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day,rain,snowfall,cloud_cover&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=1`

    try
    {
        const response = await fetch(currentForecastUrl);
        if(!response.ok)
        {
            throw new Error('Error getting data');
        }
        const data = await response.json();
        document.getElementById('tempBox').textContent = data.current.temperature_2m + "°F";
        day = data.current.is_day;
        cloud = data.current.cloud_cover;
        rain = data.current.rain;
        snow = data.current.snowfall;
        pic = document.getElementById('picBox');
        info = document.getElementById('infoBox');
        updateIcons(day, cloud, rain, snow, pic, info);

    }
    catch (error)
    {
        alert(error.message);
    }


    try
    {
        const response = await fetch(dayForecastUrl);
        if(!response.ok)
        {
            throw new Error('Error getting data');
        }
        const data = await response.json();

        for(i = 0; i < 24; i++)
        {
            time = data.hourly.time[i];

            clouds = data.hourly.cloud_cover[i];

            rain = data.hourly.rain[i];

            snow = data.hourly.snowfall[i];

            temp = data.hourly.temperature_2m[i];
            
            day = data.hourly.is_day[i];

            document.getElementById('foreCast').appendChild(fullDayForecast(temp, day, time, clouds, rain, snow))
        }
    }
    catch (error)
    {
        alert(error.message);
    }
}

function updateIcons(day, clouds, rain, snow, pic, info)
{
    if(day == 1)
    {
        //Day time
        if(clouds <= 30)
        {
            //clear
            pic.src = "assets/512/day_clear.png";
            info.textContent = "Day, Clear"
        }
        else if(clouds > 30 && clouds < 70)
        {
            //Partly cloudy
            pic.src = "assets/512/day_partial_cloud.png";
            info.textContent = "Day, Partly cloudy"
        }
        else if(clouds > 70 && clouds < 90)
        {
            //cloudy
            const imgPath = 'assets/512/cloudy.png';
            pic.src = imgPath;
            info.textContent = "Day, cloudy"
        }
        else if(clouds > 90)
        {
            //Overcast
            pic.src = "assets/512/overcast.png";
            info.textContent = "Day, Overcast"
        }

        if(rain > 0)
        {
            //raining
            pic.src = "assets/512/rain.png";
            info.textContent = "Day, Raining"
        }

        if(snow > 0)
        {
            //snowing
            pic.src = "assets/512/snow.png";
            info.textContent = "Day, snowing"
        }
    }
    else
    {
        //Night time
        if(clouds <= 30)
        {
            //clear
            pic.src = "assets/512/night_full_moon_clear.png";
            info.textContent = "Night, Clear"
        }
        else if(clouds > 30 && clouds < 70)
        {
            //Partly cloudy
            pic.src = "assets/512/night_full_moon_partial_cloud.png";
            info.textContent = "Night, Partly cloudy"
        }
        else if(clouds > 70)
        {
            //cloudy
            pic.src = "assets/512/angry_clouds.png";
            info.textContent = "Night, cloudy"
        }

        if(rain > 0)
        {
            //raining
            pic.src = "assets/512/rain.png";
            info.textContent = "Night, Raining"
        }

        if(snow > 0)
        {
            //snowing
            pic.src = "assets/512/snow.png";
            info.textContent = "Night, snowing"
        }
    }
}


function fullDayForecast(temp, day, time, clouds, rain, snow)
{
    const miniBox = document.createElement('div');

    const hourBox = document.createElement('div');
    const date = new Date(time);
    const hours = date.getHours();
    hourBox.textContent = hours + ":00";

    const temperatureBox = document.createElement('div');
    temperatureBox.textContent = temp + "°F";

    const miniImg = document.createElement('div');
    const img = document.createElement('img');
    const altText = img.alt;
    updateIcons(day, clouds, rain, snow, img, altText);
    miniImg.appendChild(img);

    miniBox.appendChild(hourBox);
    miniBox.appendChild(temperatureBox);
    miniBox.appendChild(miniImg);

    return miniBox;
}
