class Pcalendar {

    constructor(el) {
        this.el = el;
        this.$el = document.querySelector(el);
        this.currDate = {};
        this.daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
        this.months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

        this.lastMonth = this.lastMonth.bind(this);
        this.currMonth = this.currMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);

        this.setCurrDate();
        this.render();
    }

    render() {
        this.$el.innerHTML = "";
        this.showMonth(this.currDate.year, this.currDate.month);
        this.showButtons();
    }

    setCurrDate() {
        let currDate = new Date();
        this.currDate.year = currDate.getFullYear();
        this.currDate.month = currDate.getMonth();
        this.currDate.day = currDate.getDate();
    }

    get getDate() {
        return this.currDate;
    }
}


Pcalendar.prototype.showMonth = function (year, month) {

    let firstDayOfMonth = new Date(year, month, 1).getDay(), // № первого дня недели месяца
        lastDateOfMonth = new Date(year, month + 1, 0).getDate(), //  число последнего дня месяца
        lastDayOfMonth = new Date(year, month + 1, 0).getDay(), //  № последнего дня месяца
        lastDayOfLastMonth = (month !== 0) ? new Date(year, month, 0).getDate() : 31; // число последнего дня предыдущего. месяца

    if (firstDayOfMonth == 0) { firstDayOfMonth = 7; }

    let table = document.createElement('table');
    table.append(this.calendHeader(year, month));
    table.append(this.weekRow());

    let rows = "";
    let day = 1;

    do {
        let dayOfWeek = new Date(year, month, day).getDay();

        if (dayOfWeek == 1) { rows += "<tr>"; }

        if (day == 1 && dayOfWeek !== 1) {
            let lastDays = lastDayOfLastMonth - firstDayOfMonth + 2;
            for (let i = lastDays; i <= lastDayOfLastMonth; i++) {
                rows += this.createTd(i, { class: 'pcalendar_not-current' }).outerHTML;
            }
        }

        if (this.currDate.year == new Date().getFullYear() && this.currDate.month == new Date().getMonth() && this.currDate.day == day) {
            rows += this.createTd(day, { class: 'pcalendar_today', day: dayOfWeek }).outerHTML;
        } else {
            rows += this.createTd(day, { day: dayOfWeek }).outerHTML;
        }

        if (day == lastDateOfMonth && dayOfWeek !== 0) {
            for (let k = 1; k <= 7 - lastDayOfMonth; k++) {
                rows += this.createTd(k, { class: 'pcalendar_not-current' }).outerHTML
            }
        }

        if (dayOfWeek == 0) { rows += "</tr>"; }

        day++;
    } while (day <= lastDateOfMonth);

    table.insertAdjacentHTML('beforeend', rows);
    this.$el.append(table);
}


Pcalendar.prototype.showButtons = function () {
    let buttons = document.createElement('div');
    buttons.classList.add('pcalendar__buttons');

    let buttonPrev = document.createElement('button');
    buttonPrev.innerHTML = '<figure class="icon icon-left-open"></figure>';
    buttons.append(buttonPrev);
    buttonPrev.addEventListener('click', this.lastMonth);

    let buttonCurr = document.createElement('button');
    buttonCurr.innerHTML = '<figure class="icon icon-calendar-empty"></figure>';

    if (this.isCurrentMonth()) { buttonCurr.disabled = true; }

    buttons.append(buttonCurr);
    buttonCurr.addEventListener('click', this.currMonth)

    let buttonNext = document.createElement('button');
    buttonNext.innerHTML = '<figure class="icon icon-right-open"></figure>';
    buttons.append(buttonNext);
    buttonNext.addEventListener('click', this.nextMonth);

    this.$el.append(buttons);
}


Pcalendar.prototype.lastMonth = function () {
    if (this.currDate.month == 0) {
        this.currDate.month = 11;
        this.currDate.year = this.currDate.year - 1;
    }
    else {
        this.currDate.month = this.currDate.month - 1;
    }

    this.render();
}


Pcalendar.prototype.currMonth = function () {
    let date = new Date();
    this.currDate.month = date.getMonth();
    this.currDate.year = date.getFullYear();

    this.render();
}


Pcalendar.prototype.nextMonth = function () {
    if (this.currDate.month == 11) {
        this.currDate.month = 0;
        this.currDate.year = this.currDate.year + 1;
    }
    else {
        this.currDate.month = this.currDate.month + 1;
    }

    this.render();
}


Pcalendar.prototype.createTd = function (text = '', props = {}) {
    let td = document.createElement('td');
    td.innerText = text;

    if (props.hasOwnProperty('class')) { td.classList.add(props.class) };

    if (props.hasOwnProperty('day')) {
        if (props.day == 0 || props.day == 6) {
            td.classList.add('pcalendar_holiday');
        }
    }

    return td;
}


Pcalendar.prototype.calendHeader = function (year, month) { // Строка: месяц и год
    let tr = document.createElement('tr'),
        td = document.createElement('td');

    td.classList.add('pcalendar_bold');
    td.colSpan = 7;
    td.innerText = `${this.months[month]}, ${year}`;
    tr.append(td);

    return tr;
}


Pcalendar.prototype.weekRow = function () { // Строка: дни недели(пн, вт, ... вс)
    let tr = document.createElement('tr');

    for (let i = 0; i < this.daysOfWeek.length; i++) {
        let td = document.createElement('td');
        td.innerText = this.daysOfWeek[i];

        switch (i) {
            case 5:
            case 6:
                td.className = 'pcalendar_bold pcalendar_holiday';
                break;
            default:
                td.className = 'pcalendar_bold';
        }

        tr.append(td);
    }

    return tr;
}


Pcalendar.prototype.isCurrentMonth = function () {
    let date = new Date();

    return (this.currDate.month == date.getMonth() && this.currDate.year == date.getFullYear());
}



let cal = new Pcalendar('.cal_1');

