'use strict'

/**
 * Задает обработку событий для навигационных кнопок
 */
function setBtnNav() {
    let checkDay = document.getElementById('checkDay')
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
    let btnUp = document.getElementById('btnUp')
    let btnDown = document.getElementById('btnDown')
    btnDown.addEventListener('click', function () {
        if (checkDay.dataset.stat === 'calendar') {
            saveMonth++;
            if (saveMonth > 12) {
                saveMonth = 1
                saveYear++;
            }
            generateDate()
        }
        else if (checkDay.dataset.stat === 'monthes'){
            saveYear++;
            checkDay.innerText=`${saveYear} г.`
        }
        else if (checkDay.dataset.stat === 'years'){
            saveYear+=16
            checkDay.innerText=`${saveYear} - ${saveYear+15}`
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
            generateDate()
        }
        else if (checkDay.dataset.stat === 'monthes'){
            saveYear--;
            checkDay.innerText=`${saveYear} г.`
        }
        else if (checkDay.dataset.stat === 'years'){
            saveYear-=16
            checkDay.innerText=`${saveYear} - ${saveYear+15}`
            addYearsToCalendar(saveYear)
        }
    })

    //Переход между месяцами при нажатии на дни календаря, отмеченные серым
    let calendar = document.getElementById('calendar')
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
            generateDate()
        }
    })

    //Задание эффекта наведения и нажатия на текущю дату
    let realDate = document.getElementById('realDate')
    realDate.addEventListener('mouseover', function () {
        realDate.style.color = 'blue'
        realDate.style.cursor = 'pointer'
    })
    realDate.addEventListener('mouseout', function () {
        realDate.style.color = 'darkorchid'
        realDate.style.cursor = 'default'
    })
    realDate.addEventListener('click', function () {
        if (checkDay.dataset.stat==='monthes'){
            setCalendarArea(checkDay, 'monthes', 'calendar')
        }
        if (checkDay.dataset.stat==='years'){
            setCalendarArea(checkDay, 'years', 'calendar')
        }
        saveMonth = (new Date().getMonth()) + 1
        saveYear = new Date().getFullYear()
        generateDate()
    })

    let monthes = document.getElementById('monthes')
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
    monthes.addEventListener('click',function (e) {
        let elem=e.target
        if(elem.classList.contains('month')){
            saveMonth=elem.dataset.monnum
            generateDate()
            setCalendarArea(checkDay, 'monthes', 'calendar')
        }
    })

    let years = document.getElementById('years')
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
    years.addEventListener('click',function (e) {
        let elem=e.target
        if (elem.classList.contains('bkYear')){
            saveYear=elem.dataset.year
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
    let prev = document.getElementById(prevArea)
    let next = document.getElementById(nextArea)
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

function addEventToDays() {
    let calendar = document.getElementById('calendar')
    calendar.addEventListener('mouseover', function (e) {
        let elem = e.target
        if (elem.classList.contains('dBlock')) {
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
            elem.style.borderColor = 'white'
        }
    })

}