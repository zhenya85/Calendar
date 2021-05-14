'use strict'
const nameWeekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const nameMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let saveMonth; //Хранит указанный месяц
let saveYear;  //Хранит указанный год

/**
 * Добавляет разметку для календаря
 */
function createCalendar() {
    //Добавление кнопки вызова настроек
    const btnSetting = document.createElement('a')
    btnSetting.classList.add('btn-setting')
    btnSetting.id = 'btnSetting'
    document.body.prepend(btnSetting);
    const settingIcon = `<i class="fas fa-tools"></i>`
    btnSetting.insertAdjacentHTML('afterbegin', settingIcon)

    //Генерация поля календаря
    const container = document.createElement('div')
    container.id = 'mainBox'
    container.style.position = 'relative'
    container.style.margin = '20px'
    document.body.prepend(container);
    const contentHtml = calendarContentHTML();
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
            <div class="date-time-box">
                <div id="realTime" class="real-time">00:00:00</div>
                <div id="realDate" class="real-date">01 января 1900 г.</div>                                
            </div>
            <div class="weather">
                <div id="weatherServiceInfo" class="weather__sys-info bk-hide">Для указанного дня отсутствует информация о погоде</div>
                <div id="wIcon" class="weather__icon"></div>
                <div id="degreeBox" class="weather__degree"><span id="wDegree"></span><sup>&#176;c</sup></div>
                <div id="infoBox" class="weather__information">
                    <p class="weather__params">Ветер: 
                        <span id="wWind"></span> м/с
                    </p>
                    <p class="weather__params">Давление: 
                        <span id="wPressure"></span> гПа
                    </p>
                    <p class="weather__params">Влажность: 
                        <span id="wHumidity"></span> %
                    </p>
                </div>
            </div>
        </div>
        <div id="control" class="control">
            <div id="checkDay" class="check-day" data-stat="calendar"></div>
            <div id="myCity" class="selected-city"></div>
            <div id="bkNav" class="navigation-box">
                <a href="#" id="btnUp" class="btnNav">&#8743;</a>
                <a href="#" id="btnDown" class="btnNav">&#8744;</a>
            </div>
        </div>        
        <div class="calendar animate__animated" id="calendar">
            <div id="dayWeekName-0" class="days">Пн</div>
            <div id="dayWeekName-1" class="days">Вт</div>
            <div id="dayWeekName-2" class="days">Ср</div>
            <div id="dayWeekName-3" class="days">Чт</div>
            <div id="dayWeekName-4" class="days">Пт</div>
            <div id="dayWeekName-5" class="days">Сб</div>
            <div id="dayWeekName-6" class="days">Вс</div>
        </div>        
        <div id="monthes" class="monthes animate__animated">
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
        <div id="years" class="years animate__animated"></div>
    </div>`;
    return contentHtml;
}

/**
 * Генерирует поле календаря
 * @param changeFirstDay Началом недели считать воскресение
 */
function generateDate(changeFirstDay = false) {
    //Отображает блок навигации при первичной генерации чисел
    const blockNav = document.getElementById('bkNav');
    if (blockNav.style.display === 'none') {
        blockNav.style.display = 'flex'
    }
    clearBlock('dBlock');
    let fullDays = 42;

    //Сохранение текущего месяца (диапазоном 1..12) и года
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

    //Установка текущего месяца и года на страницу
    let date = new Date(year, month - 1, 1);
    let prevDate = new Date(year, month - 2, 1);
    let nextDate = new Date(year, month, 1);
    addDate(date.getMonth(), date.getFullYear());

    //Установка количества дней в феврале для текущего года
    months[1] = bigYear(date.getFullYear());
    //Получение предыдущего месяца
    let prevMonth = getPrevMonth(date.getMonth());
    let weekDays = document.querySelectorAll('.days')

    //Вывод дней предыдущего месяца
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
    }

    //Вывод дней текущего месяца
    fullDays -= addDaysToCalendar(1, months[Number(month - 1)], 'green', date);

    //Вывод дней следующего, за текущем, месяца
    addDaysToCalendar(1, fullDays, 'grey', nextDate);

    //Позволяет скрывать дни прошедшего и будущего месяцев
    if (calendarData.settings.onlyActualMonth) {
        let allDays = document.querySelectorAll('.dBlockAccess-grey')
        allDays.forEach(item => {
            item.style.opacity = '0'
            item.style.pointerEvents = 'none'
        })
    }

    //Назначает выводимым дням возможность отбражать праздники
    addEventsForHoliday()
    addEventForWeather()
}

/**
 * Добавляет на страницу месяц и год
 * @param month Номер месяца
 * @param year Год
 */
function addDate(month, year) {

    const checkDay = document.getElementById('checkDay')
    checkDay.innerText = `${nameMonths[month]}, ${year}`;
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
    let styleDay = days(); //Задает стили для каждого генерируемого дня
    let flagDayNow = null;
    let flagHoliday = false;
    let styles;
    let dateNow = new Date()
    if (date.getMonth() === dateNow.getMonth() && date.getFullYear() === dateNow.getFullYear()) {
        flagDayNow = dateNow.getDate() - 1;
    }
    styles = styleDay(color);
    const calendar = document.getElementById('calendar');
    for (let i = 0; i < count; i++) {
        flagHoliday = false;
        const elem = document.createElement('div');
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
            flagHoliday = true
            styles = styleDay('orange');
            elem.classList.add('dBlockHoliday')
            elem.dataset.holiday = fullDate
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
        if (i === flagDayNow || calendarData.checkWeekday(date.getDay()) || flagHoliday) {
            styles = styleDay(color);
        }
        elem.dataset.fullDate = fullDate
        elem.classList.add('dBlock');
        elem.classList.add(`dBlockAccess-${color}`)
        elem.innerText = Number(numDay) + i;

        //Отмечаются обводкой дни с делами
        if (calendarData.settings.enabledPlaner) {
            elem.style.borderColor = calendarData.checkDate(fullDate)
            elem.classList.add(`${calendarData.checkDate(fullDate)}`)
        }
        calendar.append(elem);
    }
    return count;
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
    dBlock.set('borderColor', 'white')
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
 * Отвечает за отображение текущих времени и даты
 */
function setClock() {
    const realTime = document.getElementById('realTime')
    setInterval(() => {
        let timeNow = `${convertTime(new Date().getHours())}:${convertTime(new Date().getMinutes())}:${convertTime(new Date().getSeconds())}`
        realTime.innerText = timeNow
        if (timeNow === '00:00:00') {
            setDateNow()
            generateDate(calendarData.settings.firstDayIsMonday)
        }
    }, 1000)
}

/**
 * Устанавливает текущее значение даты
 */
function setDateNow() {
    const realDate = document.getElementById('realDate')
    const dateNow = new Date()
    realDate.innerText = `${convertTime(dateNow.getDate())} ${nameMonths[dateNow.getMonth()].toLowerCase()} ${dateNow.getFullYear()} г.`
}

/**
 * Добавляет блоки выбора года
 * @param firstYear С какого года идет добавление
 */
function addYearsToCalendar(firstYear) {
    clearBlock('bkYear')
    const years = document.getElementById('years')
    for (let i = 0; i < 16; i++) {
        const newYear = document.createElement('div')
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
    const elements = document.querySelectorAll(`.${block}`);
    if (elements.length !== 0) {
        for (const item of elements) {
            item.parentNode.removeChild(item);
        }
    }

}








