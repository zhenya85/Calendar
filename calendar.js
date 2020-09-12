'use strict';

const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const nameMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let saveMonth; //Хранит указанный месяц
let saveYear;  //Хранит указанный год
let styleDay = days();

window.onload = function () {
    createCalendar();
    addCalendarStyles();
    generateDate()
    setClock()
    setDateNow()
    setBtnNav()
    addEventToDays()
}

/**
 * Добавляет разметку для календаря
 */
function createCalendar() {
    let container = document.createElement('div')
    container.style.margin = '20px'
    document.body.prepend(container);
    let contentHtml = `<div class="content">
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
            <div class="days">Пн</div>
            <div class="days">Вт</div>
            <div class="days">Ср</div>
            <div class="days">Чт</div>
            <div class="days">Пт</div>
            <div class="days">Сб</div>
            <div class="days">Вс</div>
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
    container.insertAdjacentHTML('afterbegin', contentHtml);

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

    let monthes=document.getElementById('monthes')
    monthes.classList.add('animate__animated')
    monthes.style.border = '1px solid #000'
    monthes.style.borderRadius = '10px'
    monthes.style.padding = '15px'
    monthes.style.display = 'none'
    monthes.style.gridTemplateColumns = 'repeat(4, 1fr)'
    monthes.style.gridTemplateRows = 'repeat(3, 40px)'
    monthes.style.gridGap = '5px'
    monthes.style.textAlign = 'center'

    let month=document.querySelectorAll('.month')
    month.forEach(item=>{
        item.style.border='1px solid #000'
        item.style.borderRadius='10px'
        item.style.display='flex'
        item.style.alignItems='center'
        item.style.justifyContent='center'
    })

    let years=document.getElementById('years')
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
 * Отвечает за отображение текущих времени и даты
 */
function setClock() {
    let realTime = document.getElementById('realTime')
    setInterval(() => {
        let timeNow = `${checkTime(new Date().getHours())}:${checkTime(new Date().getMinutes())}:${checkTime(new Date().getSeconds())}`
        realTime.innerText = timeNow
        if (timeNow === '00:00:00') {
            setDateNow()
            generateDate()
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
    dBlock.set('borderColor', 'white')
    dBlock.set('borderRadius', '5px')
    dBlock.set('color', '#fff')
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
        return dBlock;
    }
}

/**
 * Генерирует поле календаря
 */
function generateDate() {
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
    let date = new Date(year, month - 1, 1);
    let prevDate = new Date(year, month - 2, 1);
    let nextDate = new Date(year, month, 1);
    addDate(date.getMonth(), date.getFullYear());
    //alert(`date.getDay()=${date.getDay()},date.getDate()=${date.getDate()}`);

    months[1] = bigYear(date.getFullYear());
    let prevMonth = getPrevMonth(date.getMonth());
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
    fullDays -= addDaysToCalendar(1, months[Number(month - 1)], 'green', date);
    addDaysToCalendar(1, fullDays, 'grey', nextDate);
    //addEventToDays()
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
 * @param styleBlock Класс со стилями для данного числа
 * @returns {number} Количество добавленных блоков
 */
function addDaysToCalendar(numDay, count, color, date) {
    let flagDayNow = null;
    let styles;
    let dateNow = new Date()
    if (date.getMonth() === dateNow.getMonth() && date.getFullYear() === dateNow.getFullYear()) {
        flagDayNow = dateNow.getDate() - 1;
    }
    styles = styleDay(color);
    let calendar = document.getElementById('calendar');
    for (let i = 0; i < count; i++) {
        let elem = document.createElement('div');
        date.setDate(Number(numDay) + i);
        if (date.getDay() === 0 || date.getDay() === 6) {
            styles = styleDay('red');
        }
        if (i === flagDayNow) {
            styles = styleDay('blue');
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
        if (i === flagDayNow || date.getDay() === 0 || date.getDay() === 6) {
            styles = styleDay(color);
        }
        elem.classList.add('dBlock');
        elem.innerText = Number(numDay) + i;
        calendar.append(elem);
    }
    return count;
}

/**
 * Добавляет блоки выбора года
 * @param firstYear С какого года идет добавление
 */
function addYearsToCalendar(firstYear) {
    clearBlock('bkYear')
    let years=document.getElementById('years')
    for (let i=0;i<16;i++){
        let newYear=document.createElement('div')
        newYear.innerText=firstYear
        newYear.dataset.year=`${firstYear}`
        newYear.style.display='flex'
        newYear.style.alignItems='center'
        newYear.style.justifyContent='center'
        newYear.style.borderRadius='10px'
        newYear.style.border='1px solid black'
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

