/**
 * Возвращает количество дней февраля в зависимости от высокосного года
 * @param year Текущий год
 * @returns {number} Количество дней в феврале
 */
function bigYear(year) {
    return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) ? 29 : 28;
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
 * Позволяет выводить значения дня и месяца ввиде двухзначного числа
 * @param num Число или месяц
 * @returns {string|*} Результат ввиде двузначного числа
 */
function checkDate(num) {
    return String(num).length === 1 ? '0' + num : num
}

/**
 * Преобразует разряды времени к двузначному числу
 * @param num Принимаемое значение (часы/минуты/секунды)
 * @returns {*} Вывод результата в формате dd
 */
function convertTime(num) {
    return String(num).length === 1 ? `0${num}` : num
}

/**
 * Позволяет вернуть родителя у указанного элемента по переданному классу
 * @param elem Дочерний элемент
 * @param parentClass Класс родительского элемента
 * @returns {*} Ссылка на родительский элемент
 */
function findParent(elem, parentClass) {
    return elem.classList.contains(parentClass) ? elem : findParent(elem.parentNode, parentClass)
}

/**
 * Позволяет получить текущую дату
 * @returns {string} Текущая дата 'yyyy/mm/dd'
 */
function getStringDateNow() {
    const date = new Date()
    let fullDate = `${date.getFullYear()}/${checkDate(date.getMonth() + 1)}/${checkDate(date.getDate())}`
    return fullDate;
}
