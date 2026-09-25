import assert from 'node:assert';
import PersianDate from './persianDate.js';

const date1 = new PersianDate(1405, 1, 1);
const date2 = new PersianDate(1404, 12, 29);

assert.strictEqual(date1.dayNumber, 0);

// Output
assert.strictEqual(date1.toString(), '1405-01-01');
assert.strictEqual(date1.toDate(), '1405-01-01');
assert.strictEqual(date1.toDate('/'), '1405/01/01');
assert.strictEqual(date1.toPersianString(), '1 فروردین');
assert.strictEqual(date1.toPersianString(true), '1 فروردین 1405');

// Next
assert.strictEqual(date1.nextDay().toDate(), '1405-01-02');
assert.strictEqual(date2.nextDay().toDate(), '1405-01-01');
assert.strictEqual(date1.nextWeek().toDate(), '1405-01-08');
assert.strictEqual(date1.nextMonth().toDate(), '1405-02-01');
assert.strictEqual(date1.nextYear().toDate(), '1406-01-01');
assert.strictEqual(date1.next('week').toDate(), '1405-01-08');
assert.strictEqual(date1.next('month').toDate(), '1405-02-01');
assert.strictEqual(date1.next('year').toDate(), '1406-01-01');
assert.strictEqual(date1.next('week', 3).toDate(), '1405-01-22');
assert.strictEqual(date1.next('month', 3).toDate(), '1405-04-01');
assert.strictEqual(date1.next('year', 3).toDate(), '1408-01-01');

// Previous
assert.strictEqual(date1.previousDay().toDate(), '1404-12-29');
assert.strictEqual(date1.previousWeek().toDate(), '1404-12-24');
assert.strictEqual(date1.previousMonth().toDate(), '1404-12-01');
assert.strictEqual(date1.previousYear().toDate(), '1404-01-01');
assert.strictEqual(date1.previous('week').toDate(), '1404-12-24');
assert.strictEqual(date1.previous('month').toDate(), '1404-12-01');
assert.strictEqual(date1.previous('year').toDate(), '1404-01-01');
assert.strictEqual(date1.previous('week', 3).toDate(), '1404-12-10');
assert.strictEqual(date1.previous('month', 3).toDate(), '1404-10-01');
assert.strictEqual(date1.previous('year', 3).toDate(), '1402-01-01');

// Start & End
assert.strictEqual(date1.startOf('week').toDate(), '1405-01-01');
assert.strictEqual(date1.startOf('month').toDate(), '1405-01-01');
assert.strictEqual(date1.startOf('year').toDate(), '1405-01-01');
assert.strictEqual(date1.endOf('week').toDate(), '1405-01-07');
assert.strictEqual(date1.endOf('month').toDate(), '1405-01-31');
assert.strictEqual(date1.endOf('year').toDate(), '1405-12-29');

console.log('All tests passed!');