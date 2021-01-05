'use strict';

/**
 * Создает ToDoList на странице
 */
function createToDoList(date = null) {
    let mainBox = document.getElementById('mainBox')
    mainBox.insertAdjacentHTML('afterbegin', createToDoHTML(date))

    addDataToList(date)

    addEventBtnAddTask()
    addEventsForCloseAndSave()
}

/**
 * Формирует основной каркас для данныех ToDoList
 * @returns {string} Верстка основной части
 */
function createToDoHTML(date) {
    let strHTML = `
    <div id="contentToDo" class="content__todo" data-date="${date}">
        <h3 class="todo__title">Добавить дело</h3>
        <div id="insetWork" class="insert-task">
            <input type="text" id="newTask" class="edit-field edit-field_margin-size">
            <button id="addTask" class="btn btn_color-green">Добавить</button>
        </div>
        <h3 class="todo__title">Текущий список дел</h3>
        <ul id="actualTasks" class="actual-task"></ul>
        <h3 class="todo__title">Завершенные дела</h3>
        <ul id="completedTasks" class="complete-task"></ul>
        <div class="button-box button-box-position_right">
            <button id="todoSave" class="btn btn_color-green btn-small">Сохранить</button>
            <button id="todoClose" class="btn btn_color-red btn-small">Отменить</button>
        </div>
    </div>
    `
    return strHTML
}

/**
 * Формирует список дел для указанной даты
 * @param data Дата, для поиска дел
 */
function addDataToList(data) {
    if (data) {
        if (calendarData.tooDoList[data]) {
            let actualTasks = document.getElementById('actualTasks')
            let completeTsk = document.getElementById('completedTasks')
            let aTask = calendarData.tooDoList[data].actualTask
            if(aTask) {
                aTask.forEach(item => add(actualTasks, item))
            }
            let cTask = calendarData.tooDoList[data].completedTask
            if(cTask) {
                cTask.forEach(item => add(completeTsk, item))
            }
        }
    }
}

/**
 * Обработка нажатия на кнопку "Добавить"
 */
function addEventBtnAddTask() {
    let btnAddTask = document.getElementById('addTask')
    btnAddTask.addEventListener('click', function (e) {
        let insertTask = findParent(e.target, 'insert-task')
        let newTask = insertTask.querySelector('#newTask')
        let actualTasks = document.getElementById('actualTasks')
        if (newTask.value.trim() === '') {
            newTask.value = ''
            return null
        }
        add(actualTasks, newTask.value)
        newTask.value = ''
    })
}

/**
 * Формирует блок записи и добавляет в указанную категорию
 * @param taskCategory Категоря для размещения записи (выполненные/не выполненные таски)
 * @param text Тест таска
 */
function add(taskCategory, text = '') {
    let liElement = document.createElement('li')
    liElement.classList.add('task')
    let chkHTML = `
    <label class="chkTask agreement-box__checker abc-small" >
        <input name="agree" type="checkbox" class="tick agreement-box__chk chkDaySetting">
        <i class="fas fa-check"></i>
    </label>`
    let dataHTML = `<label class="text-field">${text}</label>`
    let otherContentHTML = `
    <input type="text" class="edit-field bk-hide">        
    <button class="toDoBtn btn-edit">
        <i class="fas fa-pencil-alt"></i>
    </button>
    <button class="toDoBtn btn-save bk-hide">
        <i class="fas fa-save"></i>
    </button>
    <button class="toDoBtn btn-delete">
        <i class="fas fa-eraser"></i>
    </button>`

    liElement.insertAdjacentHTML('beforeend', chkHTML)
    liElement.insertAdjacentHTML('beforeend', dataHTML)
    liElement.insertAdjacentHTML('beforeend', otherContentHTML)

    if(taskCategory.classList.contains('complete-task')){
        let textField = liElement.querySelector('.text-field')
        textField.classList.add('cross-text')
        let tickElement = liElement.querySelector('.tick')
        tickElement.checked = true;
    }

    taskCategory.insertAdjacentElement('afterbegin', liElement)

    addEventsToTaskBtns(liElement)
}

/**
 * Назначение событий для кнопок редактирования, сохранения и удаления дела
 * @param elem Элемент, в котором содержится дело
 */
function addEventsToTaskBtns(elem) {
    let tick = elem.querySelector('.chkTask')
    tick.addEventListener('click', moveElement)
    let btnEdit = elem.querySelector('.btn-edit')
    btnEdit.addEventListener('click', edit)
    let btnSave = elem.querySelector('.btn-save')
    btnSave.addEventListener('click', edit)
    let btnDelete = elem.querySelector('.btn-delete')
    btnDelete.addEventListener('click', deleteTask)
}

/**
 * Позволяет редактировать созданную запись
 * @param event Событие отработанное на элементе
 */
function edit(event) {
    let parentLi = findParent(event.target, 'task')
    let btnEdit = parentLi.querySelector('.btn-edit')
    let btnSave = parentLi.querySelector('.btn-save')
    let lbField = parentLi.querySelector('.text-field')
    let txtField = parentLi.querySelector('.edit-field')

    if (parentLi.classList.contains('blockEdit')) {
        if (txtField.value.trim() !== '') {
            lbField.innerText = txtField.value
        }
        txtField.classList.add('bk-hide')
        lbField.classList.remove('bk-hide')
        btnEdit.classList.remove('bk-hide')
        btnSave.classList.add('bk-hide')
        parentLi.classList.remove('blockEdit')
    } else {
        txtField.value = lbField.innerText
        txtField.classList.remove('bk-hide')
        lbField.classList.add('bk-hide')
        btnEdit.classList.add('bk-hide')
        btnSave.classList.remove('bk-hide')
        parentLi.classList.add('blockEdit')
    }


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
 * Удаляет выбранную запись из листа
 * @param event Событие отработанное на элементе
 */
function deleteTask(event) {
    let parentLi = findParent(event.target, 'task')
    parentLi.remove()
}

/**
 * Перемещение дел между списками с актуальными делами и нет
 * @param event Событие нажатия для чекбокса дела
 */
function moveElement(event) {
    let parentLi = findParent(event.target, 'task')
    let actualTasks = document.getElementById('actualTasks')
    let completedTasks = document.getElementById('completedTasks')
    let tickElement = parentLi.querySelector('.tick')
    let textField = parentLi.querySelector('.text-field')

    if (tickElement.checked) {
        tickElement.checked = false;
        textField.classList.remove('cross-text')
        completedTasks.removeChild(parentLi)
        actualTasks.insertAdjacentElement('afterbegin', parentLi)
    } else {
        tickElement.checked = true;
        textField.classList.add('cross-text')
        actualTasks.removeChild(parentLi)
        completedTasks.insertAdjacentElement('afterbegin', parentLi)
    }


}

/**
 * Задание событий для кнопок Save и Close
 */
function addEventsForCloseAndSave(){
    let todoSave=document.getElementById('todoSave')
    todoSave.addEventListener('click',pushSaveBtn)
    let todoClose=document.getElementById('todoClose')
    todoClose.addEventListener('click',pushCloseBtn)
}

/**
 * Нажатие кнопки Save в ToDoList
 */
function pushSaveBtn(){
    saveDataToDoList()
    updateBorderColorForDay()
    closeToDoList()
}

/**
 * Передает данные ToDoList в объект с сохранением в localStorage
 */
function saveDataToDoList(){
    let contentToDo=document.getElementById('contentToDo')
    let actualTasks=document.getElementById('actualTasks')
    let completedTasks=document.getElementById('completedTasks')
    let date=contentToDo.dataset.date
    let actualLi=actualTasks.querySelectorAll('.task')
    calendarData.clearToDoDate(date)
    actualLi.forEach(item=>{
        let text=item.querySelector('.text-field').innerText
        calendarData.addDataInToDo(date,text)
    })
    let completedLi=completedTasks.querySelectorAll('.task')
    completedLi.forEach(item=>{
        let text=item.querySelector('.text-field').innerText
        calendarData.addDataInToDo(date,text,false)
    })
    calendarData.saveToDoInLocalSt()
}

/**
 * Обновление цвета обводки элемента, после изменения дел
 */
function updateBorderColorForDay(){
    let calendar=document.getElementById('calendar')
    let contentToDo=document.getElementById('contentToDo')
    let days=calendar.querySelectorAll('.dBlock')
    for (let item of days) {
        if (item.dataset.fullDate===contentToDo.dataset.date){
            item.style.borderColor=calendarData.checkDate(contentToDo.dataset.date)
            return;
        }
    }
}

/**
 * Нажатие кнопки Close в ToDoList
 */
function pushCloseBtn(){
    closeToDoList()
}

/**
 * Закрывает ToDoList
 */
function closeToDoList(){
    let contentCalendar=document.getElementById('contentCalendar')
    let contentToDo=document.getElementById('contentToDo')
    contentToDo.classList.remove('todo_face')
    contentCalendar.classList.remove('calendar_back')
    setTimeout(()=>contentToDo.remove(),1000)
}
