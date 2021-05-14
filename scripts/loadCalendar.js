'use strict'
window.onload = function () {
    loadFromLocalStorage();
    addCalendarToPage();
    setDateTimeParameters();
    createSettingsPopup()
    addWeatherToCalendar()
    addMainEventsToCalendar()
}

/**
 * Загрузка данных из LocalStorage
 */
function loadFromLocalStorage() {
    calendarData.loadSettings()
    calendarData.loadHolidayJSON()
    calendarData.loadToDoList()
}

/**
 * Добавляет календарь на страницу
 */
function addCalendarToPage() {
    createCalendar()
    generateDate(calendarData.settings.firstDayIsMonday)

}

/**
 * Установка параметров текущей даты и времен
 */
function setDateTimeParameters() {
    setClock()
    setDateNow()
}

/**
 * Создание popup окна с настройками
 */
function createSettingsPopup() {
    let popup = document.createElement('div')
    popup.id = 'popupContent'
    popup.classList.add('animate__animated')
    popup.style.display = 'none'  //display: flex;
    popup.style.flexDirection = 'column'
    popup.style.boxSizing = 'border-box'
    popup.style.padding = '35px'
    popup.style.position = 'absolute'
    popup.style.zIndex = '10'
    popup.style.top = '0'
    popup.style.left = '0'
    popup.style.right = '0'
    popup.style.bottom = '0'
    popup.style.margin = 'auto'
    popup.style.width = '650px'
    popup.style.height = '640px'
    popup.style.backgroundColor = 'linen';
    document.body.prepend(popup)

    popup.insertAdjacentHTML('afterbegin', createPopupSettingHTML())

    let popupBackground = document.createElement('label')
    popupBackground.id = 'popupBackground'
    popupBackground.classList.add('animate__animated')
    popupBackground.style.display = 'none'  //display: block;
    popupBackground.style.position = 'absolute'
    popupBackground.style.zIndex = '5'
    popupBackground.style.top = '0'
    popupBackground.style.left = '0'
    popupBackground.style.right = '0'
    popupBackground.style.bottom = '0'
    popupBackground.style.width = '100vw'
    popupBackground.style.height = '100vh'
    popupBackground.style.backgroundColor = 'rgba(0,0,0,.8)'
    document.body.prepend(popupBackground)

    let chkPopup = document.createElement('input')
    chkPopup.setAttribute('type', 'checkbox')
    chkPopup.setAttribute('for', 'btnSettings')
    chkPopup.style.display = 'none'
    document.body.prepend(chkPopup)


}

/**
 * Задание основных событий для работы календаря
 */
function addMainEventsToCalendar() {
    addEventToNavBtn()
    addEventToDays()
    addEventSettingBtn()
    addEventsForPopupMenu()
    addEventOpenToDo()
}

/**
 * Добавляет погоду к календарю
 */
function addWeatherToCalendar() {
    getGeo()
        .then(() => getWeatherForSevenDays())
        .then(() => setDataInCalendar(getStringDateNow()))
        .then(() => startUpdateWeather())

}
