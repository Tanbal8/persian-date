# Persian Date

A JavaScript library for working with Persian (Jalali) dates.

## Installation

```bash
npm install tanbal-persian-date
```

## Usage

```js
import PersianDate from 'tanbal-persian-date';

const date = new PersianDate(1405, 7, 3);

console.log(date.toDate());
// 1405-07-03

console.log(date.toPersianString(true));
// 3 مهر 1405
```

## Features

### Date Navigation

Move forward or backward by day, week, month, or year:

```js
date.nextDay();
date.nextWeek();
date.nextMonth();
date.nextYear();

date.previousDay();
date.previousWeek();
date.previousMonth();
date.previousYear();
```

You can also use `next()` and `previous()` with a unit and count:

```js
date.next(unit); // day | week | month | year
date.previous(unit); // day | week | month | year
date.next('day', 5);
date.previous('month', 2);
```

### Get Dates

Get dates for a day, week, month, or year:

```js
date.getWeekDays();
date.getMonthDays();
date.getYearDays();
date.get(unit); // day | week | month | year
```

Get consecutive dates before or after the current date:

```js
date.get('next'); // Tomorrow
date.get('previous'); // Yesterday
date.get('next', 3);
date.get('previous', 3);
```

For example:

```js
date.get('next', 3);
```

returns the next three dates, starting from tomorrow.

### Start & End of Units

Get the beginning or end of a week, month, or year:

```js
date.startOf(unit); // week | month | year
date.endOf(unit); // week | month | year
```

### Date Comparison

Compare Persian dates:

```js
date.isBefore(otherDate);
date.isAfter(otherDate);
date.isSame(otherDate);

date.isToday();
date.isBeforeToday();
date.isAfterToday();
```

You can also calculate the difference between two dates:

```js
date.diff(otherDate);
```

### Date Output

Convert a date to a standard date string:

```js
date.toDate();
// 1405-07-03
```

A custom separator can also be used:

```js
date.toDate('/');
// 1405/07/03
```

Get a human-readable Persian date:

```js
date.toPersianString();
// 3 مهر

date.toPersianString(true);
// 3 مهر 1405
```

`toString()` returns the same output as `toDate()`:

```js
date.toString();
// 1405-07-03
```

## Static Methods

Get today's Persian date:

```js
const today = PersianDate.today();
```

Parse a date string:

```js
const date = PersianDate.parseDate('1405-07-03');
```

A custom separator can also be used:

```js
const date = PersianDate.parseDate('1405/07/03', '/');
```

## Named Exports

The library also exports Persian weekday and month names:

```js
import PersianDate, {
    weekDays,
    persianMonths
} from 'tanbal-persian-date';
```

## License

MIT
