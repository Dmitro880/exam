import { arraySize, validate, validateIndex, resize } from './variant8';

// Імітація залежностей, які очікує код
global.DimensionError = class extends Error {
  constructor(actual, expected, relation) {
    super(`DimensionError: ${actual} ${relation || '!=='} ${expected}`);
  }
};
global.IndexError = class extends Error {
  constructor(index, length) {
    super(`IndexError: ${index} (length: ${length})`);
  }
};
const isNumber = (x) => typeof x === 'number';
const isInteger = (x) => Number.isInteger(x);
const format = (x) => JSON.stringify(x);

// Передаємо імітації в глобальну область, щоб функції їх бачили
global.isNumber = isNumber;
global.isInteger = isInteger;
global.format = format;

describe('Утиліти для масивів — Варіант 8', () => {

  describe('arraySize', () => {
    test('1. розмір одновимірного масиву', () => {
      expect(arraySize([1, 2, 3])).toEqual([3]);
    });

    test('2. розмір двовимірного масиву', () => {
      expect(arraySize([[1, 2], [3, 4]])).toEqual([2, 2]);
    });

    test('3. розмір порожнього масиву', () => {
      expect(arraySize([])).toEqual([0]);
    });

    test('4. розмір масиву з різною вкладеністю (береться по першому елементу)', () => {
      expect(arraySize([[1, 2], 3])).toEqual([2, 2]);
    });

    test('5. повертає порожній масив для не-масиву', () => {
      expect(arraySize(42)).toEqual([]);
    });

    test('31. розмір тривимірного масиву', () => {
      expect(arraySize([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])).toEqual([2, 2, 2]);
    });

    test('32. розмір масиву з null як першим елементом', () => {
      expect(arraySize([null, 2, 3])).toEqual([3]);
    });

    test('33. розмір масиву з undefined', () => {
      expect(arraySize([undefined])).toEqual([1]);
    });

    test('34. розмір масиву з об\'єктом', () => {
      expect(arraySize([{a: 1}])).toEqual([1]);
    });

    test('35. розмір глибоко вкладеного масиву (4 рівні)', () => {
      expect(arraySize([[[[1]]]])).toEqual([1, 1, 1, 1]);
    });

    test('36. розмір для null', () => {
      expect(arraySize(null)).toEqual([]);
    });

    test('37. розмір для undefined', () => {
      expect(arraySize(undefined)).toEqual([]);
    });

    test('38. розмір для строки', () => {
      expect(arraySize('test')).toEqual([]);
    });

    test('39. розмір масиву з одним порожнім підмасивом', () => {
      expect(arraySize([[]])).toEqual([1, 0]);
    });

    test('40. розмір масиву великої довжини', () => {
      const arr = new Array(1000).fill(1);
      expect(arraySize(arr)).toEqual([1000]);
    });
  });

  describe('validate', () => {
    test('6. валідний одновимірний масив', () => {
      expect(() => validate([1, 2], [2])).not.toThrow();
    });

    test('7. валідний двовимірний масив', () => {
      expect(() => validate([[1], [2]], [2, 1])).not.toThrow();
    });

    test('8. помилка, якщо довжина першого виміру не збігається', () => {
      expect(() => validate([1, 2, 3], [2])).toThrow(DimensionError);
    });

    test('9. помилка, якщо вкладений елемент не є масивом, а мав би бути', () => {
      expect(() => validate([[1], 2], [2, 1])).toThrow(DimensionError);
    });

    test('10. помилка, якщо елемент є масивом, а мав би бути значенням', () => {
      expect(() => validate([[1]], [1])).toThrow(DimensionError);
    });

    test('41. валідний тривимірний масив', () => {
      expect(() => validate([[[1, 2]], [[3, 4]]], [2, 1, 2])).not.toThrow();
    });

    test('42. помилка на другому рівні вкладеності', () => {
      expect(() => validate([[1, 2], [3]], [2, 2])).toThrow(DimensionError);
    });

    test('43. помилка на третьому рівні вкладеності', () => {
      expect(() => validate([[[1], [2, 3]]], [1, 2, 2])).toThrow(DimensionError);
    });

    test('44. валідація масиву з нулями', () => {
      expect(() => validate([0, 0, 0], [3])).not.toThrow();
    });

    test('45. валідація масиву з null значеннями', () => {
      expect(() => validate([null, null], [2])).not.toThrow();
    });

    test('46. помилка при надлишковій вкладеності на останньому рівні', () => {
      expect(() => validate([[[1]], [[2]]], [2, 1])).toThrow(DimensionError);
    });

    test('47. валідація квадратної матриці 3x3', () => {
      expect(() => validate([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [3, 3])).not.toThrow();
    });

    test('48. помилка для неквадратної матриці', () => {
      expect(() => validate([[1, 2], [3, 4, 5]], [2, 2])).toThrow(DimensionError);
    });

    test('49. валідація порожнього двовимірного масиву', () => {
      expect(() => validate([[], []], [2, 0])).not.toThrow();
    });

    test('50. помилка при змішаних типах на останньому рівні', () => {
      expect(() => validate([[1, [2]], [3, 4]], [2, 2])).toThrow(DimensionError);
    });
  });

  describe('validateIndex', () => {
    test('11. валідний індекс', () => {
      expect(() => validateIndex(2, 5)).not.toThrow();
    });

    test('12. помилка на дробовий індекс', () => {
      expect(() => validateIndex(2.5)).toThrow(TypeError);
    });

    test('13. помилка на відʼємний індекс', () => {
      expect(() => validateIndex(-1, 5)).toThrow(IndexError);
    });

    test('14. помилка, якщо індекс >= довжини', () => {
      expect(() => validateIndex(5, 5)).toThrow(IndexError);
    });

    test('15. не кидає помилку, якщо довжина не вказана', () => {
      expect(() => validateIndex(10)).not.toThrow();
    });

    test('51. нульовий індекс валідний', () => {
      expect(() => validateIndex(0, 5)).not.toThrow();
    });

    test('52. індекс на межі (length - 1)', () => {
      expect(() => validateIndex(4, 5)).not.toThrow();
    });

    test('53. помилка для NaN', () => {
      expect(() => validateIndex(NaN, 5)).toThrow(TypeError);
    });

    test('54. помилка для Infinity', () => {
      expect(() => validateIndex(Infinity, 5)).toThrow(TypeError);
    });

    test('55. помилка для від\'ємного дробового числа', () => {
      expect(() => validateIndex(-2.5, 5)).toThrow(TypeError);
    });

    test('56. помилка для boolean', () => {
      expect(() => validateIndex(true, 5)).toThrow(TypeError);
    });

    test('57. помилка для null', () => {
      expect(() => validateIndex(null, 5)).toThrow(TypeError);
    });

    test('58. помилка для undefined', () => {
      expect(() => validateIndex(undefined, 5)).toThrow(TypeError);
    });

    test('59. помилка для об\'єкта', () => {
      expect(() => validateIndex({}, 5)).toThrow(TypeError);
    });

    test('60. помилка для масиву', () => {
      expect(() => validateIndex([1], 5)).toThrow(TypeError);
    });
  });

  describe('resize', () => {
    test('16. збільшення одновимірного масиву (заповнення 0)', () => {
      const arr = [1, 2];
      expect(resize(arr, [4])).toEqual([1, 2, 0, 0]);
    });

    test('17. збільшення з кастомним defaultValue', () => {
      const arr = [1];
      expect(resize(arr, [3], null)).toEqual([1, null, null]);
    });

    test('18. зменшення одновимірного масиву', () => {
      const arr = [1, 2, 3, 4];
      expect(resize(arr, [2])).toEqual([1, 2]);
    });

    test('19. зміна розміру на двовимірний', () => {
      const arr = [1];
      const result = resize(arr, [2, 2], 0);
      expect(result).toEqual([[1, 0], [0, 0]]);
    });

    test('20. зменшення двовимірного масиву', () => {
      const arr = [[1, 2], [3, 4]];
      expect(resize(arr, [1, 1])).toEqual([[1]]);
    });

    test('21. помилка, якщо перший аргумент не масив', () => {
      expect(() => resize(null, [2])).toThrow('Array expected');
    });

    test('22. помилка при спробі зробити скаляр (size=[])', () => {
      expect(() => resize([], [])).toThrow('Resizing to scalar is not supported');
    });

    test('23. помилка, якщо в size є неціле число', () => {
      expect(() => resize([], [2.5])).toThrow(TypeError);
    });

    test('24. помилка, якщо в size є відʼємне число', () => {
      expect(() => resize([], [-1])).toThrow(TypeError);
    });

    test('61. зміна розміру до тривимірного масиву', () => {
      const arr = [1];
      const result = resize(arr, [2, 2, 2], 0);
      expect(result).toEqual([[[1, 0], [0, 0]], [[0, 0], [0, 0]]]);
    });

    test('62. збереження існуючих даних при збільшенні', () => {
      const arr = [[1, 2], [3, 4]];
      const result = resize(arr, [3, 3], 5);
      expect(result).toEqual([[1, 2, 5], [3, 4, 5], [5, 5, 5]]);
    });

    test('63. зменшення з втратою даних', () => {
      const arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      expect(resize(arr, [2, 2])).toEqual([[1, 2], [4, 5]]);
    });

    test('64. resize порожнього масиву до розміру [3]', () => {
      const arr = [];
      expect(resize(arr, [3], 1)).toEqual([1, 1, 1]);
    });

    test('65. resize з defaultValue як string', () => {
      const arr = [];
      expect(resize(arr, [2], 'x')).toEqual(['x', 'x']);
    });

    test('66. resize з defaultValue як boolean', () => {
      const arr = [true];
      expect(resize(arr, [3], false)).toEqual([true, false, false]);
    });

    test('67. помилка для не-масиву як другий аргумент', () => {
      expect(() => resize([1], 5)).toThrow('Array expected');
    });

    test('68. помилка для строки як перший аргумент', () => {
      expect(() => resize('test', [2])).toThrow('Array expected');
    });

    test('69. помилка для NaN в розмірі', () => {
      expect(() => resize([], [NaN])).toThrow(TypeError);
    });

    test('70. помилка для Infinity в розмірі', () => {
      expect(() => resize([], [Infinity])).toThrow(TypeError);
    });

    test('71. resize зі збереженням 0 розміру в одному вимірі', () => {
      const arr = [[], [], []];
      expect(resize(arr, [2, 0])).toEqual([[], []]);
    });

    test('72. збільшення з 0 до іншого розміру', () => {
      const arr = [];
      expect(resize(arr, [2, 3], 7)).toEqual([[7, 7, 7], [7, 7, 7]]);
    });

    test('73. зміна розміру з видаленням рівня вкладеності', () => {
      const arr = [[[1]], [[2]]];
      const result = resize(arr, [2]);
      expect(result).toEqual([1, 2]);
    });

    test('74. додавання рівня вкладеності до скалярних значень', () => {
      const arr = [1, 2, 3];
      const result = resize(arr, [2, 2], 0);
      expect(result).toEqual([[1, 0], [2, 0]]);
    });

    test('75. resize без зміни розміру', () => {
      const arr = [1, 2, 3];
      expect(resize(arr, [3])).toEqual([1, 2, 3]);
    });

    test('76. resize двовимірного до більшого двовимірного', () => {
      const arr = [[1]];
      expect(resize(arr, [2, 3], 9)).toEqual([[1, 9, 9], [9, 9, 9]]);
    });

    test('77. resize з defaultValue = undefined', () => {
      const arr = [1];
      expect(resize(arr, [3])).toEqual([1, 0, 0]);
    });

    test('78. помилка для порожнього size масиву', () => {
      expect(() => resize([1, 2], [])).toThrow('Resizing to scalar is not supported');
    });

    test('79. resize складного вкладеного масиву', () => {
      const arr = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
      const result = resize(arr, [1, 1, 1]);
      expect(result).toEqual([[[1]]]);
    });

    test('80. помилка для size з нулем як не останній елемент', () => {
      const arr = [];
      const result = resize(arr, [0, 2], 1);
      expect(result).toEqual([]);
    });
  });

  describe('Глибока перевірка рекурсії та крайових випадків', () => {
    test('25. resize: перетворення значення в масив при додаванні виміру', () => {
      const arr = [1];
      resize(arr, [1, 1]);
      expect(Array.isArray(arr[0])).toBe(true);
    });

    test('26. resize: видалення вкладеності при зменшенні кількості вимірів', () => {
      const arr = [[ [1] ]];
      resize(arr, [1]);
      expect(arr).toEqual([1]);
    });

    test('27. validate: перевірка порожнього масиву проти розміру [0]', () => {
      expect(() => validate([], [0])).not.toThrow();
    });

    test('28. validate: перевірка скаляра (size.length === 0)', () => {
      expect(() => validate([1], [])).toThrow(DimensionError);
    });

    test('29. validateIndex: перевірка типу string', () => {
      expect(() => validateIndex('1')).toThrow(TypeError);
    });

    test('30. resize: перевірка збереження посилань (in-place)', () => {
      const arr = [1, 2];
      const returnedArr = resize(arr, [3]);
      expect(returnedArr).toBe(arr);
    });

    test('81. arraySize: глибоко вкладений масив (5 рівнів)', () => {
      expect(arraySize([[[[[1]]]]])).toEqual([1, 1, 1, 1, 1]);
    });

    test('82. validate: валідація глибоко вкладеного масиву', () => {
      expect(() => validate([[[[1]]]], [1, 1, 1, 1])).not.toThrow();
    });

    test('83. validate: скаляр не масив валідний для size []', () => {
      expect(() => validate(5, [])).not.toThrow();
    });

    test('84. resize: множинні рівні вкладеності з нулями', () => {
      const arr = [];
      const result = resize(arr, [2, 0, 3], 1);
      expect(result).toEqual([[], []]);
    });

    test('85. validateIndex: великий валідний індекс', () => {
      expect(() => validateIndex(999999, 1000000)).not.toThrow();
    
    });

    test('87. arraySize: масив з вкладеними порожніми масивами', () => {
      expect(arraySize([[], [], []])).toEqual([3, 0]);
    });

    test('88. validate: помилка для змішаної структури глибоко', () => {
      expect(() => validate([[[1, 2]], [[3], [4, 5]]], [2, 2, 2])).toThrow(DimensionError);
    });

    test('89. resize: збереження структури при resize до того ж розміру', () => {
      const arr = [[1, 2], [3, 4]];
      const original = JSON.parse(JSON.stringify(arr));
      resize(arr, [2, 2]);
      expect(arr).toEqual(original);
    });

    test('90. validateIndex: помилка для від\'ємної довжини масиву', () => {
      expect(() => validateIndex(0, -1)).toThrow(IndexError);
    });
  });
});