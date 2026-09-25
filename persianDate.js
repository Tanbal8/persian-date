class PersianDate {
    constructor(year, month, day, dayNumber) {
        try {
            if (typeof year === 'string') year = Number(year);
            if (typeof month === 'string') month = Number(month);
            if (typeof day === 'string') day = Number(day);
            if (typeof dayNumber === 'string') dayNumber = Number(dayNumber);
        }
        catch (error) {
            throw new Error('Invalid values');
        }
        if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31 ||
            (month > 6 && day > 30) ||
            (month === 12 && day > 29 && !this.isLeapYear(year))
        ) {
            throw new Error(`Invalid date ${year}/${month}/${day}`);
        }
        this.setDate(year, month, day, dayNumber);
    }
    nextDay() {
        const newDate = this.copy();
        newDate.day++;
        newDate.dayNumber = (newDate.dayNumber + 1) % 7;
        if (newDate.day > newDate.monthDays) {
            if (newDate.month === 12) newDate.setDate(newDate.year + 1, 1, 1);
            else newDate.setDate(newDate.year, newDate.month + 1, 1);
        }
        else newDate._updateInformation();
        return newDate;
    }
    previousDay() {
        const newDate = this.copy();
        newDate.day--;
        newDate.dayNumber = newDate.dayNumber > 0 ? newDate.dayNumber - 1 : 6;
        if (newDate.day < 1) {
            if (newDate.month === 1) newDate.setDate(newDate.year - 1, 12, newDate.isLeapYear(newDate.year - 1) ? 30 : 29)
            else newDate.setDate(newDate.year, newDate.month - 1, newDate.calculateMonthDays());
        }
        else newDate._updateInformation();
        return newDate;
    }
    nextWeek() {
        return this.next('day', 7);
    }
    previousWeek() {
        return this.previous('day', 7);
    }
    nextMonth() {
        const newDate = this.copy();
        newDate.month++;
        if (newDate.month > 12) {
            newDate.month = 1;
            newDate.year++;
        }
        if (newDate.day > newDate.calculateMonthDays()) newDate.day = newDate.calculateMonthDays();
        newDate.dayNumber = mode(newDate.dayNumber + (this.monthDays % 7) + (newDate.day - this.day), 7);
        newDate._updateInformation();
        return newDate;
    }
    previousMonth() {
        const newDate = this.copy();
        newDate.month--;
        if (newDate.month < 1) {
            newDate.month = 12;
            newDate.year--;
        }
        if (newDate.day > newDate.calculateMonthDays()) newDate.day = newDate.calculateMonthDays();
        newDate.dayNumber = mode(newDate.dayNumber - ((newDate.calculateMonthDays() - newDate.day + this.day) % 7), 7);        newDate._updateInformation();
        return newDate;
    }
    nextYear() {
        const newDate = this.copy();
        newDate.year++;
        if (newDate.month === 12 && newDate.day === 30 && !newDate.isLeapYear()) newDate.day = 29;
        newDate.dayNumber = mode(this.dayNumber + (this.isLeapYear() ? 2 : 1), 7);
        newDate._updateInformation();
        return newDate;
    }
    previousYear() {
        const newDate = this.copy();
        newDate.year--;
        if (newDate.month === 12 && newDate.day === 30 && !newDate.isLeapYear()) newDate.day = 29;
        const newDayNumber = mode(newDate.dayNumber - (newDate.isLeapYear() ? 2 : 1), 7);
        newDate.dayNumber = newDayNumber;
        newDate._updateInformation();
        return newDate;
    }
    next(unit, count = 1) {
        const lowerCaseUnit = this._unitCheck(unit);
        let currentDate = this.copy();
        switch (lowerCaseUnit) { // Just for performance
            case 'day':
                let checkedDays = 0;
                while (checkedDays < count) {
                    const currentDateCopy = currentDate.copy()
                    if (count - checkedDays >= 366) {
                        currentDate = currentDate.nextYear();
                    }
                    else if (count - checkedDays >= 31) {
                        currentDate = currentDate.nextMonth();
                    }
                    else {
                        currentDate = currentDate.nextDay();
                    }
                    checkedDays += currentDate.diff(currentDateCopy);
                }
                break;
            case 'week':
                currentDate = this.next('day', count * 7);
                break;
            default:
                for (let a = 0 ; a < count ; a++) {
                    currentDate = currentDate[`next${capitalize(lowerCaseUnit)}`]();
                }
                break;
        }
        return currentDate;
    }
    previous(unit, count = 1) {
        const lowerCaseUnit = this._unitCheck(unit);
        let currentDate = this.copy();
        switch (lowerCaseUnit) { // Just for performance
            case 'day':
                let checkedDays = 0;
                while (checkedDays < count) {
                    const currentDateCopy = currentDate.copy()
                    if (count - checkedDays >= 366) {
                        currentDate = currentDate.previousYear();
                    }
                    else if (count - checkedDays >= 31) {
                        currentDate = currentDate.previousMonth();
                    }
                    else {
                        currentDate = currentDate.previousDay();
                    }
                    checkedDays += currentDate.diff(currentDateCopy);
                }
                break;
            case 'week':
                currentDate = this.previous('day', count * 7);
                break;
            default:
                for (let a = 0 ; a < count ; a++) {
                    currentDate = currentDate[`previous${capitalize(lowerCaseUnit)}`]();
                }
                break;
        }
        return currentDate;
    }
    getWeekDays() {
        let currentDay = this.startOf('week');
        const days = [];
        for (let a = 0 ; a < 7 ; a++) {
            days.push(currentDay.copy());
            currentDay = currentDay.nextDay();
        }
        return days;
    }
    getMonthDays() {
        const firstDayNumber = mode(this.dayNumber - (this.day - 1), 7);
        const days = Array.from({ length: this.monthDays }, (_, index) =>
            new PersianDate(this.year, this.month, index + 1, (firstDayNumber + index) % 7)
        );
        return days;
    }
    getYearDays(wholeYear = false) {
        let nthDayOfYear = this.nthDayOfYear();
        let firstDayNumber = mode(this.dayNumber - (nthDayOfYear - 1), 7);
        const endMonth = wholeYear ? 12 : this.month;
        const days = [];
        for (let month = 1 ; month <= endMonth ; month++) {
            for (let day = 1 ; day <= this.calculateMonthDays(month) ; day++) {
                days.push(new PersianDate(this.year, month, day, (firstDayNumber + days.length) % 7));
            }
        }
        return days;
    }
    getDayNumber() {
        const today = PersianDate.today();
        const diff = today.isBefore(this)
            ? today.diff(this)
            : -today.diff(this);

        return mode(today.dayNumber + diff, 7);
    }
    get(unit, daysCount = 0) {
        const customUnits = ['next', 'previous'];
        const lowerCaseUnit = this._unitCheck(unit, [], customUnits);
        if (unit === 'day') return [this.copy()];
        if (customUnits.includes(unit)) {
            let currentDate = this.copy();
            const days = [];
            for (let a = 0 ; a < daysCount ; a++) {
                days.push(currentDate.copy());
                currentDate = currentDate[`${unit}Day`]();
            }
            return days;
        }
        else return this[`get${capitalize(lowerCaseUnit)}Days`]()
    }
    startOf(unit) {
        const lowerCaseUnit = this._unitCheck(unit, ['day']);
        switch (lowerCaseUnit) {
            case 'week':
                return this.previous('day', this.dayNumber);
            case 'month': {
                const diffDays = this.day - 1;
                const newDayNumber = mode(this.dayNumber - diffDays, 7);
                return new PersianDate(this.year, this.month, 1, newDayNumber);
            }
            case 'year': {
                const diffDays = this.nthDayOfYear() - 1;
                const newDayNumber = mode(this.dayNumber - diffDays, 7);
                return new PersianDate(this.year, 1, 1, newDayNumber);
            }
            default:
                break;
        }
    }
    endOf(unit) {
        const lowerCaseUnit = this._unitCheck(unit, ['day']);
        switch (lowerCaseUnit) {
            case 'week':
                return this.next('day', 6 - this.dayNumber);
            case 'month': {
                const diffDays = this.calculateMonthDays() - this.day;
                const newDayNumber = (this.dayNumber + diffDays) % 7;
                return new PersianDate(this.year, this.month, 1, newDayNumber)
            }
            case 'year': {
                const diffDays = this.calculateYearDays() - this.nthDayOfYear();
                const newDayNumber = (this.dayNumber + diffDays) % 7;
                return new PersianDate(this.year, 12, this.calculateMonthDays(12), newDayNumber)
            }
            default:
                break;
        }
    }
    nthDayOfYear() {
        let nth = 0;
        for (let month = 1 ; month < this.month ; month++) {
            nth += this.calculateMonthDays(month);
        }
        nth += this.day;
        return nth;
    }
    toNumber() {
        return this.year * 10000 + this.month * 100 + this.day;
    }
    isBefore(otherDate) {
        return this.toNumber() < otherDate.toNumber();
    }
    isAfter(otherDate) {
        return this.toNumber() > otherDate.toNumber();
    }
    isSame(otherDate) {
        return this.toNumber() === otherDate.toNumber();
    }
    isToday() {
        return this.isSame(PersianDate.today());
    }
    isBeforeToday() {
        return this.isBefore(PersianDate.today());
    }
    isAfterToday() {
        return this.isAfter(PersianDate.today());
    }
    isLeapYear(year = this.year) {
        const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
        let jp = breaks[0], jump = 0;
        for (const jm of breaks.slice(1)) {
            jump = jm - jp;
            if (year < jm) break;
            jp = jm;
        }
        let n = year - jp;
        if (n >= jump) return false;
        if (jump - n < 6) n += Math.floor((jump + 4) / 33) * 33 - jump;
        return (((n + 1) % 33) % 4 === 0) && !(jump === 33 && ((n + 1) % 33) === 1);
    }
    diff(otherDate) {
        let olderDate = this.isBefore(otherDate) ? this : otherDate;
        let newerDate = this.isAfter(otherDate) ? this : otherDate;
        if (this.year === otherDate.year) {
            return newerDate.nthDayOfYear() - olderDate.nthDayOfYear();
        }
        else {
            let days = 0;
            for (let year = olderDate.year + 1 ; year < newerDate.year ; year++) {
                days += this.calculateYearDays(year);
            }
            days += olderDate.calculateYearDays() - olderDate.nthDayOfYear() + 1;
            days += newerDate.nthDayOfYear();
            return days;
        }
    }
    calculateMonthDays(month = this.month, year = this.year) {
        if (month <= 6) return 31;
        if (month < 12) return 30;
        return this.isLeapYear(year) ? 30 : 29;
    }
    calculateYearDays(year = this.year) {
        return this.isLeapYear(year) ? 366 : 365;
    }
    copy() {
        return new PersianDate(this.year, this.month, this.day, this.dayNumber);
    }
    _unitCheck(unit, invalids = [], valids = []) {
        const lowerCaseUnit = unit;
        if (
            (!['day', 'week', 'month', 'year'].includes(lowerCaseUnit) &&
            !valids.includes(lowerCaseUnit)) ||
            invalids.includes(lowerCaseUnit)
        ) {
            console.error('Error', 'Invalid time unit');
            return;
        }
        return lowerCaseUnit;
    }
    setDate(year, month, day, dayNumber = null) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.dayNumber = dayNumber ?? this.getDayNumber();
        this._updateInformation();
    }
    _updateInformation() {
        this.dayName = weekDays[this.dayNumber];
        this.monthName = persianMonths[this.month - 1];
        this.monthDays = this.calculateMonthDays();
    }
    toString(showYear = false) {
        return `${this.day} ${this.monthName}${showYear ? ' ' + this.year : ''}`;
    }
    toDate(seprator = '-') {
        return `${this.year.toString()}${seprator}${this.month.toString().padStart(2, '0')}${seprator}${this.day.toString().padStart(2, '0')}`
    }
}

PersianDate.today = () => {
    const today = new Intl.DateTimeFormat("fa-u-nu-latn").format(Date.now()).split("/");
    const dayNumber = (new Date().getDay() + 1) % 7;
    return new PersianDate(...today.map(Number), dayNumber);
}

PersianDate.parseDate = (date, seprator = '-') => {
    const isValid = new RegExp(
        `^\\d{4}${seprator}\\d{2}${seprator}\\d{2}$`
    ).test(date);
    if (!isValid) {
        throw new Error(`Invalid format: ${date}\nIt should be YYYY-MM-DD`);
    }
    return new PersianDate(...date.split(seprator))
}

const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

const mode = (number, mode = 7) => ((number % mode) + mode) % mode

const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

export default PersianDate;
export {
    weekDays,
    persianMonths,
};