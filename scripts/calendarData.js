'use strict'
const calendarData = {
    settings: {
        firstDayIsMonday: true,
        onlyActualMonth: false,
        enabledPlaner: true,
        weekDays: [false, false, false, false, false, true, true],
        country: 'BY',
        saveCity: '',
        city: 'Могилёв',
        timeUpdateWeather: 1
    },
    dates: {
        'BY': {
            '01012021': ['Новый год'],
            '07012021': ['Рождество']
        }

    },
    tooDoList: {},
    weather: {
        firstDay: '',
        appid: '621b956eda4a85205fe44caea6213113',
        lang: 'ru',
        units: 'metric',
        lon: 30.3364,
        lat: 53.9139,
        daysArray: []
    },
    /**
     * Предоставляет информацию, считать ли переданный день выходным
     * @param day Передаваемый номер дня
     * @returns {boolean} Результат проверки
     */
    checkWeekday(day) {
        if (day === 0) {
            return this.settings.weekDays[6]
        } else {
            return this.settings.weekDays[day - 1]
        }
    },
    /**
     * Загружает данные о настройках из LocalStorage
     */
    loadSettings() {
        let settings = localStorage.getItem('settings')
        if (settings) {
            this.settings = Object.assign(this.settings, JSON.parse(settings))
        }
    },
    /**
     * Сохраняет данные о настройках в LocalStorage
     */
    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings))
    },
    /**
     * Проверяет, есть ли праздник в указанной дате
     * @param {string} date Дата ddmmyyyy
     * @param {boolean} getData Если данные есть - вернуть результат
     * @returns {boolean} Результат поиска true|false|[] (массив со списком праздников)
     */
    checkHoliday(date, getData = false) {
        const data = this.dates[this.settings.country]
        if (data) {
            if (getData) {
                return data[date] ? data[date] : []
            }
            return data[date] ? true : false
        }
        return false
    },
    /**
     * Загрузает данные о праздниках в объект из JSON файла
     */
    loadHolidayJSON() {
        let fileName = './holidaysBy.json'
        const file = new XMLHttpRequest();
        file.overrideMimeType('application/json')
        file.open('GET', fileName, false)
        file.send()
        if (file.status === 200) {
            let json = JSON.parse(file.responseText)
            this.dates = Object.assign(this.dates, json)
        } else {
            alert("Ошибка чтения из файла")
        }
    },
    /**
     * Загружает ToDoList из LocalStorage в объект
     */
    loadToDoList() {
        let tooDoList = localStorage.getItem('tooDoList')
        if (tooDoList) {
            this.tooDoList = Object.assign(this.tooDoList, JSON.parse(tooDoList))
        }
    },
    /**
     * Сохраняет данные ToDoList в объекте
     * @param date Дата элемента
     * @param textData Текстовое содержимое
     * @param actualCategory Запись добавлять в категорию "активные"
     */
    addDataInToDo(date, textData, actualCategory = true) {
        if (this.tooDoList[date] === undefined) {
            this.tooDoList[date] = {}
        }
        if (actualCategory) {
            if (this.tooDoList[date].actualTask === undefined) {
                this.tooDoList[date].actualTask = []
            }
            this.tooDoList[date].actualTask.unshift(textData)
        } else {
            if (this.tooDoList[date].completedTask === undefined) {
                this.tooDoList[date].completedTask = []
            }
            this.tooDoList[date].completedTask.unshift(textData)
        }
    },
    /**
     * Сохранение ToDoList в LocalStorage
     */
    saveToDoInLocalSt() {
        localStorage.setItem('tooDoList', JSON.stringify(this.tooDoList))
    },
    /**
     * Очистка старых записей ToDoList в указанном дне
     * @param date День, записи которого нужно очистить
     */
    clearToDoDate(date) {
        if (this.tooDoList[date] !== undefined) {
            delete this.tooDoList[date]
        }
    },
    /**
     * Проверка наличия записей в ToDoList и их актуальность
     * @param date Дата для проверки
     */
    checkDate(date) {
        const dateNow = new Date()
        dateNow.setHours(0, 0, 0, 0)
        const checkDate = new Date(date)
        checkDate.setHours(0, 0, 0, 0)
        //Проверка на наличие не завершенных дел
        if (this.tooDoList[date] && this.tooDoList[date].actualTask && this.tooDoList[date].actualTask.length > 0) {
            if (dateNow < checkDate) {
                return 'green';
            }
            if (dateNow.getDate() === checkDate.getDate()) {
                return 'blue';
            }
            if (dateNow > checkDate) {
                return 'red';
            }
        } else if (this.tooDoList[date] && this.tooDoList[date].completedTask && this.tooDoList[date].completedTask.length > 0) {
            return 'grey'
        }
        return 'white';
    },
    /**
     * Позволяет сохранить новый город
     * @param newCityName Название нового города
     */
    async setNewCity(newCityName) {
        let myCity = document.getElementById('myCity')
        let saveCity = calendarData.settings.city
        calendarData.settings.city = newCityName
        try {
            await getGeo()
            await getWeatherForSevenDays()
            setDataInCalendar(getStringDateNow())
        } catch (e) {
            calendarData.settings.city = saveCity
            myCity.innerText = calendarData.settings.city
        }
    }

}
