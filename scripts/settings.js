'use strict'

/**
 * Формирует (в виде строки) данные окна настроек
 * @returns {string} Строка с HTML каркасом настроек
 */
function createPopupSettingHTML() {
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
        <div id="popupWeatherCity" class="agreement-box">
            <label class="agreement-box__text popup__text" for="">
                 Текущий город: 
            </label>
             <input id="textWeather" name="agree" type="text" class="edit-field edit-field_margin-size edit-field_width-middle edit-field_text-position-right">
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
