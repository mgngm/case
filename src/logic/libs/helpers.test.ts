/* eslint-disable @typescript-eslint/no-loss-of-precision */
import {
  formatCount,
  constructValueDisplayString,
  formatPercentageDisplayString,
  sortStringsAscending,
  sortStringsDescending,
} from 'src/logic/libs/helpers';

describe('logic/libs/helpers.ts', () => {
  describe('constructValueDisplayString', () => {
    const inputs = [
      { input: 1233.123122, dp: 2, formatNumber: false, output: '1233.12' },
      { input: 1233.123122, dp: 2, formatNumber: true, output: '1.23k' },
      { input: 33, dp: 2, formatNumber: true, output: '33' },
      { input: 44.5, dp: 3, formatNumber: true, output: '44.500' },
      { input: 999.02, dp: 1, formatNumber: true, output: '999' },
      { input: 999.024434, dp: 5, formatNumber: true, output: '999.02443' },
      { input: 999.0434343434343432, dp: 0, formatNumber: true, output: '999' },
      { input: 15999.0434343434343432, dp: 0, formatNumber: true, output: '16k' },
      { input: 15999.0434343434343432, dp: 0, formatNumber: false, output: '15999' },
      { input: 431239.0434343434343432, dp: 2, formatNumber: false, output: '431239.04' },
      { input: 431239.0434343434343432, dp: 2, formatNumber: true, output: '431.24k' },
      { input: 99123.0434343434343432, dp: 0, formatNumber: false, output: '99123' },
      { input: 99123.0434343434343432, dp: 0, formatNumber: true, output: '99k' },
      { input: 999129837192837.0434343434343432, dp: 0, formatNumber: true, output: '999129837m' },
      { input: 99988322.0434343434343432, dp: 2, formatNumber: true, output: '99.99m' },
      { input: 99912.0434343434343432, dp: 0, formatNumber: true, output: '100k' },
      { input: 993219.0434343434343432, dp: 0, formatNumber: true, output: '993k' },
      { input: 'gobbledegook', dp: 0, formatNumber: false, output: 'gobbledegook' },
      { input: 'gobbledegook', dp: 2, formatNumber: false, output: 'gobbledegook' },
      { input: 'gobbledegook', dp: 3, formatNumber: false, output: 'gobbledegook' },
      { input: 'gobbledegook', dp: 4, formatNumber: false, output: 'gobbledegook' },
      { input: 'gobbledegook', dp: 5, formatNumber: false, output: 'gobbledegook' },
    ];

    inputs.forEach((test) => {
      it(`Formats ${test.input} correctly for output, ${
        test.formatNumber ? 'formatting it correctly' : 'without formatting it'
      }`, () => {
        expect(constructValueDisplayString(test.input, test.dp, test.formatNumber)).toBe(test.output);
      });
    });
  });
  describe('formatCount', () => {
    const inputs = [
      { input: 1, output: '1' },
      { input: 1000, output: '1,000' },
      { input: 10000, output: '10,000' },
      { input: 100000, output: '100,000' },
      { input: 1000000, output: '1,000,000' },
      { input: 10000000, output: '10,000,000' },
      { input: 100000000, output: '100,000,000' },
      { input: 1000000000, output: '1,000,000,000' },
    ];
    inputs.forEach((test) => {
      it(`Formats ${test.input} correctly for output`, () => {
        expect(formatCount(test.input)).toBe(test.output);
      });
    });
  });

  describe('formatPercentageDisplayString', () => {
    const inputs = [
      { val: 1, total: 100, output: '1.0%' },
      { val: 999, total: 1000, output: '99.9%' },
      { val: 1000, total: 50, output: '2000.0%' },
      { val: 999999, total: 5000000, output: '20.0%' },
      { val: 1000000, total: 900000000, output: '0.1%' },
      { val: 696000000, total: 900000000, output: '77.3%' },
    ];
    inputs.forEach((test) => {
      it(`Formats percentage string correctly ${test.val} with a total of ${test.total}`, () => {
        expect(formatPercentageDisplayString(test.val, test.total)).toBe(test.output);
      });
    });
  });

  describe('string sorting', () => {
    const testConditions = [
      { unsorted: ['a', 'B', 'c'], sorted: ['a', 'B', 'c'] },
      { unsorted: ['z', 'l', 'a'], sorted: ['a', 'l', 'z'] },
      { unsorted: ['A', 'B', 'a', 'b'], sorted: ['a', 'A', 'b', 'B'] },
      { unsorted: ['1', '2', 'a', 'b', 'A', 'B'], sorted: ['1', '2', 'a', 'A', 'b', 'B'] },
      { unsorted: ['!1', '1', 'a', 'b', 'A', 'B'], sorted: ['!1', '1', 'a', 'A', 'b', 'B'] },
      { unsorted: ['$', '&', '*', '!', '%', '£'], sorted: ['!', '$', '%', '&', '*', '£'] },
      { unsorted: ['one', 'two', 'three'], sorted: ['one', 'three', 'two'] },
      { unsorted: ['One', 'one', 'Two', 'two'], sorted: ['one', 'One', 'two', 'Two'] },
      { unsorted: ['1', '2', '01', '10', '74', '02'], sorted: ['01', '02', '1', '10', '2', '74'] },
      { unsorted: [9, '6', '01', 2, '74', '02'], sorted: ['01', '02', 2, '6', '74', 9] },
      { unsorted: [9, '6', '01', 2, '74', '02'], sorted: ['01', '02', 2, '6', '74', 9] },
      {
        unsorted: ['10.1.4.9', '1.2.3.4', '1.1.1.1', '2.2.2.2'],
        sorted: ['1.1.1.1', '1.2.3.4', '10.1.4.9', '2.2.2.2'],
      },
    ];
    describe('sortStringsAscending', () => {
      testConditions.forEach(({ unsorted, sorted: expected }) => {
        it(`should sort strings '${unsorted.toString()}' into '${expected.toString()}'`, () => {
          const sorted = unsorted.slice().sort(sortStringsAscending);
          expect(sorted).toStrictEqual(expected);
        });
      });
    });

    describe('sortStringsDescending', () => {
      testConditions.forEach(({ unsorted, sorted: expected }) => {
        it(`should sort strings '${unsorted.toString()}' into '${expected.toString()}'`, () => {
          const sorted = unsorted.slice().sort(sortStringsDescending);
          expect(sorted).toStrictEqual(expected.reverse());
        });
      });
    });
  });
});
