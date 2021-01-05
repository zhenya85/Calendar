'use strict';

const nameWeekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const nameMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let saveMonth; //Хранит указанный месяц
let saveYear;  //Хранит указанный год
let styleDay = days();

window.onload = function () {
    calendarData.loadSettings()
    calendarData.loadHolidayJSON()
    calendarData.loadToDoList()
    createCalendar()
    addCalendarStyles()
    //createToDoList()
    createPopup()
    generateDate(calendarData.settings.firstDayIsMonday)
    setClock()
    setDateNow()
    setBtnNav()
    addEventToDays()
    addEventSettingBtn()
    addEventsForPopupMenu()
    addEventOpenToDo()
}


/**
 * Добавляет разметку для календаря
 */
function createCalendar() {
    //Добавление кнопки вызова настроек
    let btnSetting = document.createElement('a')
    btnSetting.classList.add('btn-setting')
    btnSetting.id = 'btnSetting'
    document.body.prepend(btnSetting);
    let settingIcon = `<i class="fas fa-tools"></i>`
    btnSetting.insertAdjacentHTML('afterbegin', settingIcon)

    //Генерация поля календаря
    let container = document.createElement('div')
    container.id='mainBox'
    container.style.position='relative'
    container.style.margin = '20px'
    document.body.prepend(container);
    let contentHtml = calendarContentHTML();
    container.insertAdjacentHTML('afterbegin', contentHtml);


}

/**
 * Формирует (в виде строки) данные календаря
 * @param changeFirstDay Первый день - воскресение
 * @returns {string} Строка с HTML календаря
 */
function calendarContentHTML() {
    let contentHtml = `
    <div id="contentCalendar" class="content content__calendar">
        <div class="indate">
                <div id="realTime">00:00:00</div>
                <div id="realDate">01 января 1900 г.</div>
        </div>
        <div id="control">
            <div id="checkDay" class="check-day" data-stat="calendar"></div>
            <div id="bkNav">
                <a href="#" id="btnUp" class="btnNav">&#8743;</a>
                <a href="#" id="btnDown" class="btnNav">&#8744;</a>
            </div>
        </div>        
        <div class="calendar" id="calendar">
            <div id="dayWeekName-0" class="days">Пн</div>
            <div id="dayWeekName-1" class="days">Вт</div>
            <div id="dayWeekName-2" class="days">Ср</div>
            <div id="dayWeekName-3" class="days">Чт</div>
            <div id="dayWeekName-4" class="days">Пт</div>
            <div id="dayWeekName-5" class="days">Сб</div>
            <div id="dayWeekName-6" class="days">Вс</div>
        </div>        
        <div id="monthes">
            <div class="month" data-monNum="1">янв</div>
            <div class="month" data-monNum="2">фев</div>
            <div class="month" data-monNum="3">мар</div>
            <div class="month" data-monNum="4">апр</div>
            <div class="month" data-monNum="5">май</div>
            <div class="month" data-monNum="6">июн</div>
            <div class="month" data-monNum="7">июл</div>
            <div class="month" data-monNum="8">авг</div>
            <div class="month" data-monNum="9">сен</div>
            <div class="month" data-monNum="10">окт</div>
            <div class="month" data-monNum="11">ноя</div>
            <div class="month" data-monNum="12">дек</div>
        </div>
        <div id="years"></div>
    </div>`;
    return contentHtml;
}

/**
 * Добавляет стили для календаря
 */
function addCalendarStyles() {
    let body = document.body;
    body.style.backgroundImage = 'url(img/bg_calendar.jpg)'
    body.style.borderColor = 'rgba(255,255,255,0.5)'
    body.style.backgroundRepeat = 'no-repeat'
    body.style.backgroundSize = 'cover'
    body.style.backgroundAttachment='fixed';
    body.style.paddingTop = '100px'
    body.style.display = 'flex'
    body.style.alignItems = 'center'
    body.style.justifyContent = 'center'

    let content = document.querySelector('.content');
    content.style.marginBottom = '20px'
    content.style.backgroundColor = 'linen'
    content.style.minHeight = '10px'
    content.style.width = '500px'
    content.style.padding = '20px'
    content.style.boxShadow = '0px 0px 12px 3px purple'

    let indate = document.querySelector('.indate')
    indate.style.border = '1px solid #000'
    //indate.style.marginBottom = '20px'
    indate.style.padding = '15px'
    indate.style.display = 'flex'
    indate.style.flexDirection = 'column'
    indate.style.flexWrap = 'wrap'
    // indate.style.justifyContent = 'center'
    indate.style.borderRadius = '10px'

    let realTime = document.getElementById('realTime')
    realTime.style.fontSize = '50px'

    let realDate = document.getElementById('realDate')
    realDate.style.fontSize = '16px'
    realDate.style.color = 'darkorchid'
    realDate.style.fontWeight = '700'

    let control = document.getElementById('control')
    control.style.display = 'flex'
    control.style.justifyContent = 'space-between'
    control.style.alignItems = 'center'

    let chkDay = document.querySelector('.check-day')
    chkDay.style.margin = '10px 0'
    chkDay.style.padding = '10px'
    chkDay.style.cursor = 'pointer'


    let blockNav = document.getElementById('bkNav')
    blockNav.style.width = '100px'
    blockNav.style.height = '30px'
    blockNav.style.display = 'none'
    blockNav.style.justifyContent = 'space-around'

    let btnNav = document.querySelectorAll('.btnNav')
    btnNav.forEach(item => {
        item.style.color = '#000'
        item.style.fontWeight = '500'
        item.style.textDecoration = 'none'
        item.style.display = 'flex'
        item.style.alignItems = 'center'
        item.style.justifyContent = 'center'
        item.style.width = '30px'
        item.style.height = '30px'
        item.addEventListener('mouseover', function () {
            item.style.backgroundColor = 'lightcyan'
            item.style.fontWeight = '700'
            item.style.outline = '2px solid blueviolet'
        })
        item.addEventListener('mouseout', function () {
            item.style.backgroundColor = 'inherit'
            item.style.fontWeight = '500'
            item.style.outline = 'none'
        })
    })

    let cal = document.getElementById('calendar')
    cal.classList.add('animate__animated')
    cal.style.border = '1px solid #000'
    cal.style.borderRadius = '10px'
    cal.style.padding = '15px'
    cal.style.display = 'grid'
    cal.style.gridTemplateColumns = 'repeat(7, 1fr)'
    cal.style.gridTemplateRows = 'repeat(6, 40px)'
    cal.style.gridGap = '5px'
    cal.style.textAlign = 'center'

    let monthes = document.getElementById('monthes')
    monthes.classList.add('animate__animated')
    monthes.style.border = '1px solid #000'
    monthes.style.borderRadius = '10px'
    monthes.style.padding = '15px'
    monthes.style.display = 'none'
    monthes.style.gridTemplateColumns = 'repeat(4, 1fr)'
    monthes.style.gridTemplateRows = 'repeat(3, 40px)'
    monthes.style.gridGap = '5px'
    monthes.style.textAlign = 'center'

    let month = document.querySelectorAll('.month')
    month.forEach(item => {
        item.style.border = '1px solid #000'
        item.style.borderRadius = '10px'
        item.style.display = 'flex'
        item.style.alignItems = 'center'
        item.style.justifyContent = 'center'
    })

    let years = document.getElementById('years')
    years.classList.add('animate__animated')
    years.style.border = '1px solid #000'
    years.style.borderRadius = '10px'
    years.style.padding = '15px'
    years.style.display = 'none'
    years.style.gridTemplateColumns = 'repeat(4, 1fr)'
    years.style.gridTemplateRows = 'repeat(4, 40px)'
    years.style.gridGap = '5px'
    years.style.textAlign = 'center'

}

/**
 * Создание popup окна с настройками
 */
function createPopup() {
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
    popup.style.height = '600px'
    popup.style.backgroundColor = 'linen';
    document.body.prepend(popup)

    //TODO: Вынести в отдельную функцию
    popup.insertAdjacentHTML('afterbegin', createPopapSettingHTML())

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
 * Формирует (в виде строки) данные окна настроек
 * @returns {string} Строка с HTML каркасом настроек
 */
function createPopapSettingHTML() {
    let popupContent = `
        <h2 id="popupTitle" class="popup__title">Настройки календаря</h2>
        <div id="popupFirstDayBox" class="popup__first-day-box">            
            <label for="chkToggle" class="popup__text popup_cursor-style">Первый день недели - понедельник: </label>            
            <div id="popupFirstDayToggle" class="toggle toggle_margin">
                <input type="checkbox" class="toggle__input" checked id="chkToggle">
                <label class="toggle__control" for="chkToggle"></label>
                <label class="toggle__label" for="chkToggle"></label>
            </div>
        </div>
        <div id="popupHideDaysBox" class="agreement-box">
            <input id="hideDays" name="agree" type="checkbox" class="agreement-box__chk">
            <label class="agreement-box__text popup__text" for="hideDays">
                 Оторажать только текущий месяц: 
            </label>
            <label class="agreement-box__checker" for="hideDays">
                  <i class="fas fa-check"></i>
            </label>                    
        </div>
        <div id="popupHidePlanerBox" class="agreement-box">
            <input id="hidePlaner" name="agree" type="checkbox" class="agreement-box__chk">
            <label class="agreement-box__text popup__text" for="hidePlaner">
                 Включить планер: 
            </label>
            <label class="agreement-box__checker" for="hidePlaner">
                  <i class="fas fa-check"></i>
            </label>                    
        </div>
        <p class="popup__text">Выбор выходных дней:</p>
        <div class="popup-check-day-box">
            <div class="dayName">Пн</div>
            <div class="dayName">Вт</div>
            <div class="dayName">Ср</div>
            <div class="dayName">Чт</div>
            <div class="dayName">Пт</div>
            <div class="dayName">Сб</div>
            <div class="dayName">Вс</div>
    `
    for (let i = 0; i <= 6; i++) {
        popupContent += `
            <div class="chkDay">        
                  <input id="weekDay-${i}" name="agree" type="checkbox" class="agreement-box__chk chkDaySetting">
                  <label class="agreement-box__checker" for="weekDay-${i}">
                        <i class="fas fa-check"></i>
                  </label>
            </div>`
    }
    popupContent += `
        </div>
        <div class="button-box">
            <button id="popupSave" class="btn btn_color-green">Сохранить</button>
            <button id="popupClose" class="btn btn_color-red">Отменить</button>
        </div>
    `
    return popupContent
}


/**
 * Отвечает за отображение текущих времени и даты
 */
function setClock() {
    let realTime = document.getElementById('realTime')
    setInterval(() => {
        let timeNow = `${checkTime(new Date().getHours())}:${checkTime(new Date().getMinutes())}:${checkTime(new Date().getSeconds())}`
        realTime.innerText = timeNow
        if (timeNow === '00:00:00') {
            setDateNow()
            generateDate(calendarData.settings.firstDayIsMonday)
        }
    }, 1000)
}

/**
 * Отображает разряды времени ввиде двух чисел
 * @param num Принимаемое значение
 * @returns {*} Вывод результата в формате dd
 */
function checkTime(num) {
    return String(num).length === 1 ? `0${num}` : num
}

/**
 * Устанавливает текущее значение даты
 */
function setDateNow() {
    let realDate = document.getElementById('realDate')
    let dateNow = new Date()
    realDate.innerText = `${checkTime(dateNow.getDate())} ${nameMonths[dateNow.getMonth()].toLowerCase()} ${dateNow.getFullYear()} г.`
}


/**
 * Задание основных свойств для стилей чисел
 * @returns {function(*): Map<any, any>}
 */
function days() {
    const dBlock = new Map()
    dBlock.set('background', 'lightseagreen')
    dBlock.set('borderWidth', '2px')
    dBlock.set('borderStyle', 'solid')
    //dBlock.set('borderColor', 'white')
    dBlock.set('borderRadius', '5px')
    dBlock.set('color', '#fff')
    dBlock.set('cursor', 'pointer')
    dBlock.set('fontWeight', '600')
    dBlock.set('fontSize', '20px')
    dBlock.set('textAlign', 'center')
    dBlock.set('justifyContent', 'center')
    dBlock.set('lineHeight', '40px')

    return function (colorBlock) {
        if (colorBlock.toLowerCase() === 'green') {
            dBlock.set('background', 'lightgreen')
            dBlock.set('color', '#000')
        }
        if (colorBlock.toLowerCase() === 'grey') {
            dBlock.set('background', 'lightgrey')
            dBlock.set('color', '#000')
        }
        if (colorBlock.toLowerCase() === 'blue') {
            dBlock.set('background', 'dodgerblue')
            dBlock.set('color', '#fff')
        }
        if (colorBlock.toLowerCase() === 'red') {
            dBlock.set('background', 'lightsalmon')
            dBlock.set('color', '#000')
        }
        if (colorBlock.toLowerCase() === 'orange') {
            dBlock.set('background', 'orange')
            dBlock.set('color', '#000')
        }
        return dBlock;
    }
}

/**
 * Генерирует поле календаря
 * @param changeFirstDay Началом недели считать воскресение
 */
function generateDate(changeFirstDay = false) {
    //Отображает блок навигации при первичной генерации чисел
    let blockNav = document.getElementById('bkNav');
    if (blockNav.style.display === 'none') {
        blockNav.style.display = 'flex'
    }
    clearBlock('dBlock');
    let fullDays = 42;

    let month;
    let year
    if (!saveMonth && !saveYear) {
        month = (new Date().getMonth()) + 1;
        saveMonth = month;
        year = new Date().getFullYear();
        saveYear = year;
    } else {
        month = saveMonth
        year = saveYear
    }

    //Установка текущего месяца и года
    let date = new Date(year, month - 1, 1);
    let prevDate = new Date(year, month - 2, 1);
    let nextDate = new Date(year, month, 1);
    addDate(date.getMonth(), date.getFullYear());
    //alert(`date.getDay()=${date.getDay()},date.getDate()=${date.getDate()}`);

    //Установка количества дней в феврале для текущего года
    months[1] = bigYear(date.getFullYear());
    //Получение предыдущего месяца
    let prevMonth = getPrevMonth(date.getMonth());
    let weekDays = document.querySelectorAll('.days')
    if (!changeFirstDay) {
        //Перерисовка дней недели
        weekDays.forEach((item, index) => {
            if (index === 0) {
                item.innerText = nameWeekDays[6]
            } else {
                item.innerText = nameWeekDays[index - 1]
            }
        })
        if (date.getDay() !== 0) {
            let prevDay = months[prevMonth] - date.getDay() + 1;
            fullDays -= addDaysToCalendar(prevDay, date.getDay(), 'grey', prevDate);
        }
    } else {
        //Перерисовка дней недели
        weekDays.forEach((item, index) => {
            item.innerText = nameWeekDays[index]
        })
        //Расстановка чисел
        if (date.getDay() !== 1) {
            let prevDay;
            if (date.getDay() !== 0) {
                prevDay = months[prevMonth] - date.getDay() + 2;
                fullDays -= addDaysToCalendar(prevDay, date.getDay() - 1, 'grey', prevDate);
            } else {
                prevDay = months[prevMonth] - 5;
                fullDays -= addDaysToCalendar(prevDay, 6, 'grey', prevDate);
            }
        }
        //addEventToDays()
    }
    fullDays -= addDaysToCalendar(1, months[Number(month - 1)], 'green', date);
    addDaysToCalendar(1, fullDays, 'grey', nextDate);

    //Позволяет скрывать дни прошедшего и будущего месяцев
    if (calendarData.settings.onlyActualMonth) {
        let allDays = document.querySelectorAll('.dBlockAccess-grey')
        allDays.forEach(item => {
            item.style.opacity = '0'
            item.style.pointerEvents = 'none'
        })
    }

    addEventsForHoliday()
    //addEventOpenToDo()
}

/**
 * Возвращает количество дней февраля в зависимости от высокосного года
 * @param year Текущий год
 * @returns {number} Количество дней в феврале
 */
function bigYear(year) {
    return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) ? 29 : 28;
}

/**
 * Добавляет на страницу месяц и год
 * @param month Номер месяца
 * @param year Год
 */
function addDate(month, year) {

    let checkDay = document.getElementById('checkDay')
    checkDay.innerText = `${nameMonths[month]}, ${year}`;
    checkDay.style.fontWeight = '700';
}

/**
 * Возвращает предыдущий месяц
 * @param month Текущий месяц
 * @returns {number} Предыдущий месяц
 */
function getPrevMonth(month) {
    return Number(month) === 0 ? 11 : month - 1;
}

/**
 * Добавляет дни недели в календарь
 * @param numDay С какой даты идет добавление
 * @param count Количество дней необходимо добавить
 * @param color Класс со стилями для данного числа
 * @param date Дата
 * @returns {number} Количество добавленных блоков
 */
function addDaysToCalendar(numDay, count, color, date) {
    let flagDayNow = null;
    let flagHoliday=false;
    let styles;
    let dateNow = new Date()
    if (date.getMonth() === dateNow.getMonth() && date.getFullYear() === dateNow.getFullYear()) {
        flagDayNow = dateNow.getDate() - 1;
    }
    styles = styleDay(color);
    let calendar = document.getElementById('calendar');
    for (let i = 0; i < count; i++) {
        flagHoliday=false;
        let elem = document.createElement('div');
        date.setDate(Number(numDay) + i);
        if (calendarData.checkWeekday(date.getDay())) {
            styles = styleDay('red');
        }
        if (i === flagDayNow) {
            styles = styleDay('blue');
        }
        //Выделение праздничных дней
        let fullDate = `${date.getFullYear()}/${checkDate(date.getMonth() + 1)}/${checkDate(date.getDate())}`
        if (calendarData.checkHoliday(fullDate)) {
            flagHoliday=true
            styles = styleDay('orange');
            elem.classList.add('dBlockHoliday')
            elem.dataset.holiday=fullDate
        }
        //Установка признака основной части календаря
        if (count > 27) {
            elem.dataset.main = 'main'
        } else {
            elem.dataset.main = 'slave'
        }
        for (const item of styles.keys()) {
            elem.style[item] = styles.get(item);
        }
        if (i === flagDayNow || calendarData.checkWeekday(date.getDay())||flagHoliday) {
            styles = styleDay(color);
        }
        elem.dataset.fullDate=fullDate
        elem.classList.add('dBlock');
        elem.classList.add(`dBlockAccess-${color}`)
        elem.innerText = Number(numDay) + i;
        elem.style.borderColor=calendarData.checkDate(fullDate)
        calendar.append(elem);
    }
    return count;
}

/**
 * Позволяет выводить значения дня и месяца ввиде двухзначного числа
 * @param num Число или месяц
 * @returns {string|*} Результат ввиде двузначного числа
 */
function checkDate(num) {
    return String(num).length === 1 ? '0' + num : num
}

/**
 * Добавляет блоки выбора года
 * @param firstYear С какого года идет добавление
 */
function addYearsToCalendar(firstYear) {
    clearBlock('bkYear')
    let years = document.getElementById('years')
    for (let i = 0; i < 16; i++) {
        let newYear = document.createElement('div')
        newYear.innerText = firstYear
        newYear.dataset.year = `${firstYear}`
        newYear.style.display = 'flex'
        newYear.style.alignItems = 'center'
        newYear.style.justifyContent = 'center'
        newYear.style.borderRadius = '10px'
        newYear.style.border = '1px solid black'
        newYear.classList.add('bkYear')
        years.append(newYear)
        firstYear++
    }
}

/**
 * Очищает колендарь от блоков, с указанным классом
 * @param block Наименование класса
 */
function clearBlock(block) {
    let elements = document.querySelectorAll(`.${block}`);
    if (elements.length !== 0) {
        for (const item of elements) {
            item.parentNode.removeChild(item);
        }
    }

}

