'use strict';

/**
 * Задает обработку событий для навигационных кнопок
 */
function addEventToNavBtn() {
    const checkDay = document.getElementById('checkDay')
    checkDay.addEventListener('mouseover', function () {
        checkDay.style.color = 'cornflowerblue'
    })
    checkDay.addEventListener('mouseout', function () {
        checkDay.style.color = 'black'
    })
    checkDay.addEventListener('click', function () {
        if (checkDay.dataset.stat === 'calendar') {
            setCalendarArea(checkDay, 'calendar', 'monthes')
        } else if (checkDay.dataset.stat === 'monthes') {
            setCalendarArea(checkDay, 'monthes', 'years')
            addYearsToCalendar(saveYear)
        }

    })

    //Задание переходов по нажатию кнопок вверх и вниз
    const btnUp = document.getElementById('btnUp')
    const btnDown = document.getElementById('btnDown')
    btnDown.addEventListener('click', function () {
        if (checkDay.dataset.stat === 'calendar') {
            saveMonth++;
            if (saveMonth > 12) {
                saveMonth = 1
                saveYear++;
            }
            generateDate(calendarData.settings.firstDayIsMonday)
        } else if (checkDay.dataset.stat === 'monthes') {
            saveYear++;
            checkDay.innerText = `${saveYear} г.`
        } else if (checkDay.dataset.stat === 'years') {
            saveYear = Number(saveYear) + 16
            checkDay.innerText = `${saveYear} - ${saveYear + 15}`
            addYearsToCalendar(saveYear)
        }
    })
    btnUp.addEventListener('click', function () {
        if (checkDay.dataset.stat === 'calendar') {
            saveMonth--;
            if (saveMonth < 1) {
                saveMonth = 12
                saveYear--;
            }
            generateDate(calendarData.settings.firstDayIsMonday)
        } else if (checkDay.dataset.stat === 'monthes') {
            saveYear--;
            checkDay.innerText = `${saveYear} г.`
        } else if (checkDay.dataset.stat === 'years') {
            saveYear = Number(saveYear) - 16
            checkDay.innerText = `${saveYear} - ${saveYear + 15}`
            addYearsToCalendar(saveYear)
        }
    })

    //Переход между месяцами при нажатии на дни календаря, отмеченные серым
    const calendar = document.getElementById('calendar')
    calendar.addEventListener('click', function (e) {
        let elem = e.target
        if (elem.classList.contains('dBlock') && elem.dataset.main === 'slave') {
            if (Number(elem.innerText) > 23) {
                saveMonth--;
                if (saveMonth < 1) {
                    saveMonth = 12
                    saveYear--;
                }
            } else {
                saveMonth++;
                if (saveMonth > 12) {
                    saveMonth = 1
                    saveYear++;
                }
            }
            generateDate(calendarData.settings.firstDayIsMonday)
        }
    })

    //Задание эффекта наведения и нажатия на текущю дату
    const realDate = document.getElementById('realDate')
    realDate.addEventListener('mouseover', function () {
        realDate.style.color = 'blue'
        realDate.style.cursor = 'pointer'
    })
    realDate.addEventListener('mouseout', function () {
        realDate.style.color = 'darkorchid'
        realDate.style.cursor = 'default'
    })
    realDate.addEventListener('click', function () {
        if (checkDay.dataset.stat === 'monthes') {
            setCalendarArea(checkDay, 'monthes', 'calendar')
        }
        if (checkDay.dataset.stat === 'years') {
            setCalendarArea(checkDay, 'years', 'calendar')
        }
        saveMonth = (new Date().getMonth()) + 1
        saveYear = new Date().getFullYear()
        generateDate(calendarData.settings.firstDayIsMonday)
    })

    const monthes = document.getElementById('monthes')
    monthes.addEventListener('mouseover', function (e) {
        let elem = e.target;
        if (elem.classList.contains('month')) {
            elem.style.backgroundColor = 'greenyellow'
            elem.style.cursor = 'pointer'

        }
    })
    monthes.addEventListener('mouseout', function (e) {
        let elem = e.target;
        if (elem.classList.contains('month')) {
            elem.style.backgroundColor = 'inherit'
            elem.style.cursor = 'default'

        }
    })
    monthes.addEventListener('click', function (e) {
        let elem = e.target
        if (elem.classList.contains('month')) {
            saveMonth = elem.dataset.monnum
            generateDate(calendarData.settings.firstDayIsMonday)
            setCalendarArea(checkDay, 'monthes', 'calendar')
        }
    })

    const years = document.getElementById('years')
    years.addEventListener('mouseover', function (e) {
        let elem = e.target;
        if (elem.classList.contains('bkYear')) {
            elem.style.backgroundColor = 'greenyellow'
            elem.style.cursor = 'pointer'

        }
    })
    years.addEventListener('mouseout', function (e) {
        let elem = e.target;
        if (elem.classList.contains('bkYear')) {
            elem.style.backgroundColor = 'inherit'
            elem.style.cursor = 'default'

        }
    })
    years.addEventListener('click', function (e) {
        let elem = e.target
        if (elem.classList.contains('bkYear')) {
            saveYear = elem.dataset.year
            setCalendarArea(checkDay, 'years', 'monthes')
        }
    })


}

/**
 * Отвечает за порядок отображения элементов days/monthes/years
 * @param chkDay Поле, по которому производится клик
 * @param prevArea Текущая локация элемента
 * @param nextArea Следующая локация элемента
 */
function setCalendarArea(chkDay, prevArea, nextArea) {
    chkDay.dataset.stat = nextArea
    const prev = document.getElementById(prevArea)
    const next = document.getElementById(nextArea)
    next.classList.remove('animate__zoomOut')
    if (nextArea === 'calendar') {
        chkDay.innerText = `${nameMonths[saveMonth - 1]}, ${saveYear} г.`
    } else if (nextArea === 'monthes') {
        chkDay.innerText = `${saveYear} г.`
    } else if (nextArea === 'years') {
        chkDay.innerText = `${saveYear} - ${Number(saveYear) + 15}`
    }
    prev.classList.remove('animate__zoomIn')
    prev.classList.add('animate__zoomOut')
    setTimeout(() => {
        prev.style.display = 'none'
        next.style.display = 'grid'
        next.classList.add('animate__zoomIn')
    }, 300)
}

/**
 * Задает эффект наведения на даты календаря
 */
function addEventToDays() {
    let saveBorderColor;
    const calendar = document.getElementById('calendar')
    calendar.addEventListener('mouseover', function (e) {
        let elem = e.target
        if (elem.classList.contains('dBlock')) {
            saveBorderColor=elem.style.borderColor;
            elem.style.borderWidth = '2px'
            elem.style.borderStyle = 'solid'
            elem.style.borderColor = 'purple'
        }
    })
    calendar.addEventListener('mouseout', function (e) {
        let elem = e.target
        if (elem.classList.contains('dBlock')) {
            elem.style.borderWidth = '2px'
            elem.style.borderStyle = 'solid'
            //elem.style.borderColor = 'white'
            elem.style.borderColor = saveBorderColor
        }
    })

}

/**
 * Обработка нажатия кнопки настройки календаря
 */
function addEventSettingBtn() {
    const setting = document.getElementById('btnSetting')
    const popup = document.getElementById('popupContent')
    const popupBack = document.getElementById('popupBackground')

    setting.addEventListener('click', function () {
        setting.style.transition = '.5s transform'
        setting.style.transform = 'rotate(360deg)'
        popup.classList.remove('animate__zoomOut')
        popupBack.classList.remove('animate__fadeOut')
        popup.style.display = 'flex'
        popup.classList.add('animate__zoomIn')
        popupBack.style.display = 'block'
        popupBack.classList.add('animate__fadeIn')
        getCalendarSetting()
    })
}

/**
 * Установка параметров календаря для меню
 */
function getCalendarSetting() {
    const chkToggle = document.getElementById('chkToggle')
    const hideDays = document.getElementById('hideDays')
    const hidePlaner = document.getElementById('hidePlaner')
    const textWeather=document.getElementById('textWeather')

    chkToggle.checked = calendarData.settings.firstDayIsMonday
    hideDays.checked = calendarData.settings.onlyActualMonth
    hidePlaner.checked = calendarData.settings.enabledPlaner
    textWeather.value=calendarData.settings.city
    calendarData.settings.weekDays.forEach((item, index) => {
        let chkDay = document.getElementById(`weekDay-${index}`)
        chkDay.checked = item
    })
}

/**
 * Задание обработки для кнопок меню настройки
 */
function addEventsForPopupMenu() {
    const popupClose = document.getElementById('popupClose')
    const popupSave = document.getElementById('popupSave')
    const chkToggle = document.getElementById('chkToggle')
    const hideDays = document.getElementById('hideDays')
    const hidePlaner = document.getElementById('hidePlaner')
    const chkDaySetting = document.querySelectorAll('.chkDaySetting')
    const textWeather=document.getElementById('textWeather')


    popupClose.addEventListener('click', closeSettingMenu)

    popupSave.addEventListener('click', function () {
        calendarData.settings.firstDayIsMonday = chkToggle.checked
        calendarData.settings.onlyActualMonth = hideDays.checked
        calendarData.settings.enabledPlaner = hidePlaner.checked
        calendarData.setNewCity(textWeather.value)
        chkDaySetting.forEach(item => {
            let num = Number(item.id.split('-')[1])
            calendarData.settings.weekDays[num] = item.checked
        })
        calendarData.saveSettings(textWeather.value)
        generateDate(calendarData.settings.firstDayIsMonday)
        closeSettingMenu()
    })

}

/**
 * Закрытие меню настроек
 */
function closeSettingMenu() {
    const setting = document.getElementById('btnSetting')
    const popup = document.getElementById('popupContent')
    const popupBack = document.getElementById('popupBackground')

    setting.style.transform = 'rotate(0deg)'

    popup.classList.remove('animate__zoomIn')
    popupBack.classList.remove('animate__fadeIn')
    popup.classList.add('animate__zoomOut')
    popupBack.classList.add('animate__fadeOut')
    setTimeout(() => {
        popup.style.display = 'none'
        popupBack.style.display = 'none'
    }, 500)
}

/**
 * При нажатии на день - открывает окно ToDoList
 */
function addEventOpenToDo() {
    const calendar=document.querySelector('.calendar')
    const contentCalendar=document.getElementById('contentCalendar')
    calendar.addEventListener('click',function (e){
        if(calendarData.settings.enabledPlaner) {
            if (e.target.classList.contains('dBlock')) {
                createToDoList(e.target.dataset.fullDate)
                let contentToDo = document.getElementById('contentToDo')
                contentCalendar.classList.add('calendar_back')
                setTimeout(() => contentToDo.classList.add('todo_face'),20)

            }
        }
    })
}

/**
 * Отображает название праздника, при наведении на день
 */
function addEventsForHoliday() {
    const dBlockHoliday = document.querySelectorAll('.dBlockHoliday')
    dBlockHoliday.forEach((item) => {

        const context = document.createElement('span')
        context.classList.add('context')
        let holidayMas = calendarData.checkHoliday(item.dataset.holiday, true)
        holidayMas.forEach(itemText => context.insertAdjacentText('beforeend', itemText))
        item.appendChild(context)

        item.addEventListener('mouseover', function () {
            let offSet = item.getBoundingClientRect().top;
            if (offSet <= 60) {
                context.classList.add('triangleBottom');
            } else {
                context.classList.add('triangleTop');
            }
        })


        item.addEventListener('mouseout', function () {

            context.classList.remove('triangleBottom');
            context.classList.remove('triangleTop');
        })

    })
}

function addEventForWeather(){
    const calendar=document.getElementById('calendar')
    const dBlock=calendar.querySelectorAll('.dBlock')
    dBlock.forEach(item=>{
        item.addEventListener('mouseover',addWeatherForDay)
        item.addEventListener('mouseout',setWeatherDefault)
    })

}

/**
 * Назначение погоды на конкретный день
 */
function addWeatherForDay(event){
    const element=event.target
    const date=element.dataset.fullDate
    setDataInCalendar(date)
}

/**
 * Возвращает состояние погоды на текущий день
 */
function setWeatherDefault(){
    setDataInCalendar(getStringDateNow())
}
