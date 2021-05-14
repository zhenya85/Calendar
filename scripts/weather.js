const WeatherForDay = class {
    date = ''
    temp = 0
    wind = 0
    pressure = 0
    humidity = 0
    icon = ''
}

/**
 * Получает данные геолокации текущего города и сохраняет эти данные в настройках
 * @param city Наименование города
 * @returns {Promise<boolean>} Результат операции
 */
async function getGeo() {
    let myCity=document.getElementById('myCity')
    let urlRequest = `http://api.openweathermap.org/geo/1.0/direct?q=${calendarData.settings.city}&appid=${calendarData.weather.appid}`
    let response = await fetch(urlRequest)
    if (response.ok) {
        let geoDataForCity = await response.json()
        calendarData.settings.city = geoDataForCity[0].local_names.ru.trim()
        if(calendarData.settings.city!==undefined || calendarData.settings.city!=='') {
            myCity.innerText=calendarData.settings.city
            calendarData.weather.lat = geoDataForCity[0].lat
            calendarData.weather.lon = geoDataForCity[0].lon
            calendarData.settings.country = geoDataForCity[0].country
        }
    }
}

/**
 * Формирует массив в calendarData с данными о погоде
 */
async function getWeatherForSevenDays() {
    const date = new Date()
    const mass = []
    let urlRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${calendarData.weather.lat}&lon=${calendarData.weather.lon}&exclude=hourly,minutely&appid=${calendarData.weather.appid}&lang=${calendarData.weather.lang}&units=${calendarData.weather.units}`
    let response = await fetch(urlRequest)
    if (response.ok) {
        let daysWeather = await response.json()
        let fullDate = `${date.getFullYear()}/${checkDate(date.getMonth() + 1)}/${checkDate(date.getDate())}`
        calendarData.weather.firstDay = fullDate
        mass.push(await createObjWeatherForDay(daysWeather.current, fullDate))
        let weatherForAnyDays = daysWeather.daily.map((item, index) => {
            if (index > 0) {
                date.setDate(date.getDate() + 1)
                fullDate = `${date.getFullYear()}/${checkDate(date.getMonth() + 1)}/${checkDate(date.getDate())}`
                return createObjWeatherForDay(item, fullDate, true)
            }
        })
        weatherForAnyDays.shift()
        calendarData.weather.daysArray = mass.concat(weatherForAnyDays)
    } else {
        calendarData.weather.daysArray = []
    }
}

/**
 * Формирует объект с данными погоды на основе класса WeatherForDay
 * @param weatherObj Данные погоды на день из JSON запроса
 * @param date Дата текущей погоды
 * @param arrDays Данные передаваемые в функцию беруться из массива следующих 7-ми дней
 * @returns {WeatherForDay} Объект с данными типа WeatherForDay
 */
function createObjWeatherForDay(weatherObj, date, arrDays = false) {
    const wDay = new WeatherForDay()
    wDay.date = date
    let formatTemp = arrDays ? weatherObj.temp.day : weatherObj.temp
    formatTemp = Math.round(formatTemp * 10) / 10
    wDay.temp = formatTemp
    wDay.wind = weatherObj.wind_speed
    wDay.pressure = weatherObj.pressure
    wDay.humidity = weatherObj.humidity
    wDay.icon = weatherObj.weather[0].icon
    return wDay
}

/**
 * Отображает данные о погоде, согласно указанной даты
 * @param date Дата
 */
function setDataInCalendar(date) {
    const weatherServiceInfo = document.getElementById('weatherServiceInfo')
    const wIcon = document.getElementById('wIcon')
    const degreeBox = document.getElementById('degreeBox')
    const wDegree = document.getElementById('wDegree')
    const infoBox = document.getElementById('infoBox')
    const wWind = document.getElementById('wWind')
    const wPressure = document.getElementById('wPressure')
    const wHumidity = document.getElementById('wHumidity')

    const dayWeatherObj = calendarData.weather.daysArray.find(item => {
        return date === item.date
    })
    if (dayWeatherObj) {
        changeClassForBlock('bk-hide', [weatherServiceInfo])
        changeClassForBlock('bk-hide', [wIcon, degreeBox, infoBox], true)
        wIcon.classList.remove('bk-hide')
        let urlIcon = `http://openweathermap.org/img/wn/${dayWeatherObj.icon}@2x.png`
        wIcon.style.backgroundImage = `url('${urlIcon}')`
        wDegree.innerText = dayWeatherObj.temp
        wWind.innerText = dayWeatherObj.wind
        wPressure.innerText = dayWeatherObj.pressure
        wHumidity.innerText = dayWeatherObj.humidity
    } else {
        changeClassForBlock('bk-hide', [weatherServiceInfo], true)
        changeClassForBlock('bk-hide', [wIcon, degreeBox, infoBox])
    }

}

/**
 * Добавляет/удаляет класс для указанного массива элементов
 * @param className Наименование класса
 * @param arrayElements Массив DOM элементов
 * @param removeClass Нужно ли класс удалить
 */
function changeClassForBlock(className, arrayElements, removeClass = false) {
    if (removeClass) {
        arrayElements.forEach(item => item.classList.remove(className))
    } else {
        arrayElements.forEach(item => item.classList.add(className))
    }
}

/**
 * Обнавляет даные о погоде с указанной периодичностью
 */
function startUpdateWeather() {
    let timeUpdateInHour = calendarData.settings.timeUpdateWeather * 60 * 1000
    setInterval(() => {
        getGeo()
            .then(() => getWeatherForSevenDays())
            .then(() => setDataInCalendar(getStringDateNow()))
    }, timeUpdateInHour)
}


