let X1 = [
  0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0,
];
const X2 = [
  0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0,
];

function fullFillArray(n, m) {
  // Якщо n дорівнює 1, створюємо одновимірний масив
  if (n === 1) {
    return Array.from({ length: m }, () =>
      parseFloat(getRandomArbitrary(0.1, 0.9).toFixed(1))
    );
  }

  // Інакше створюємо двовимірний масив
  const array = [];
  for (let i = 0; i < n; i++) {
    array[i] = []; // Ініціалізуємо кожен рядок як порожній масив
    for (let j = 0; j < m; j++) {
      // Заповнюємо елемент рандомним числом з одним десятковим місцем
      array[i][j] = parseFloat(getRandomArbitrary(0.1, 0.9).toFixed(1));
    }
  }

  return array;
}

// 1.

// ПЕРША ІНІЦІАЛІЗАЦІЯ
const firstTable = fullFillArray(6, 25);

// Виводимо масив у вигляді таблиці
console.table(firstTable);

const secondTable = fullFillArray(1, 6);
console.table(secondTable);

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function findSignal(table, letter) {
  const result = table.map((row) => {
    const sum = row.reduce((sum, value, colIndex) => {
      return sum + value * letter[colIndex];
    }, 0);
    return parseFloat(sum.toFixed(1));
  });
  return result;
}

const signalAFirstLetter = findSignal(firstTable, X1);
console.log("signal first: ", signalAFirstLetter);

const signalASecondLetter = findSignal(firstTable, X2);
console.log("signal second: ", signalASecondLetter);

function averageOfArrays(array1, array2) {
  const totalSum = [...array1, ...array2].reduce((acc, num) => acc + num, 0);
  const totalCount = array1.length + array2.length;
  const average = totalCount > 0 ? totalSum / totalCount : 0; // Уникаємо ділення на нуль
  return parseFloat(average.toFixed(1)); // Округлення до одного знака після коми
}

const theta = averageOfArrays(signalAFirstLetter, signalASecondLetter);
console.log("theta is: ", theta);

function findSignalsUU(array, criterion) {
  // Перевірка, чи аргумент є числом
  if (typeof array === "number") {
    return array >= criterion ? 1 : 0;
  }

  // Якщо аргумент - масив, виконуємо map для кожного елемента
  return array.map((element) => (element >= criterion ? 1 : 0));
}

const excitedArrayFirst = findSignalsUU(signalAFirstLetter, theta);
const excitedArraySecond = findSignalsUU(signalASecondLetter, theta);

function createLetterTables(array1, array2, comparisonArray) {
  const averageValue = averageOfArrays(array1, array2);
  const maskArray = comparisonArray.map((element) => (element >= averageValue ? 1 : 0));

  // Ініціалізуємо масиви для першої та другої "літери" з нулями
  const firstLetterTable = Array(comparisonArray.length).fill(0);
  const secondLetterTable = Array(comparisonArray.length).fill(0);

  // Заповнюємо масиви на основі маски
  for (let i = 0; i < comparisonArray.length; i++) {
    if (maskArray[i] === 1) {
      firstLetterTable[i] = comparisonArray[i]; // Додаємо елемент з secondTable у першу літеру
      secondLetterTable[i] = 0; // Заповнюємо нулями
    } else {
      secondLetterTable[i] = comparisonArray[i]; // Додаємо елемент з secondTable у другу літеру
      firstLetterTable[i] = 0; // Заповнюємо нулями
    }
  }

  return { firstLetterTable, secondLetterTable };
}

// Використовуємо функцію
const { firstLetterTable, secondLetterTable } = createLetterTables(excitedArrayFirst, excitedArraySecond, secondTable);

console.log("firstLetterTable: ", firstLetterTable);
console.log("secondLetterTable: ", secondLetterTable);

function multiplyAndSumArrays(array1, array2) {
  if (array1.length !== array2.length) {
    throw new Error("Масиви повинні бути однакової довжини.");
  }

  const result = array1.reduce(
    (sum, element, index) => sum + element * array2[index],
    0
  );

  return parseFloat(result.toFixed(1));
}
// console.log(excitedArrayFirst, excitedArraySecond);

const sumFirstU = multiplyAndSumArrays(firstLetterTable, secondTable);
const sumSecondU = multiplyAndSumArrays(secondLetterTable, secondTable);

// console.log(excitedArrayFirst.length, secondTable);
console.log(sumFirstU, sumSecondU);

// знаїодимо тета р використовуючи просто формулу для середнього числа
const thetaR = averageOfArrays([sumFirstU], [sumSecondU]);

console.log('theta R: ', thetaR);

// перевіряємо результат та скористаємось функцією, що порівнює числа з тетою
const excepted1 = findSignalsUU(sumFirstU, thetaR);
const excepted2 = findSignalsUU(sumSecondU, thetaR);

console.log((excepted1 < excepted2 ? "Вихідні вимоги задовільняються" :
  "не вдалось задовольнити вимоги"));
  
// 2.

const n = 0.1;

// Задаємо початкові коефіцієнти та вхідні сигнали
let weights = [...secondTable];

function generateTable(secondTable, firstLetterTable, secondLetterTable, n, theta) {
  const table = []; // ініціалізація таблиці
  const rowCount = secondTable.length; // кількість рядків у таблиці
  let sumFirstLetter = 0; // для накопичення суми першої "букви"
  let sumSecondLetter = 0; // для накопичення суми другої "букви"
  let isFirstLetterComplete = false; // прапорець для зупинки генерації першої "букви"
  let isSecondLetterComplete = false; // прапорець для зупинки генерації другої "букви"

  // Додаємо першу колонку - secondTable
  table.push([...secondTable]);

  // Генеруємо колонки, чергуючи firstLetterTable і secondLetterTable
  let columnIndex = 1; // індекс колонки, починаючи з другої колонки
  while (!(isFirstLetterComplete && isSecondLetterComplete)) {
    // Ініціалізуємо нову колонку для таблиці
    const column = Array(rowCount).fill(0);

    // Заповнюємо колонку значеннями з firstLetterTable або secondLetterTable
    const sourceArray = columnIndex % 2 === 1 ? firstLetterTable : secondLetterTable;
    for (let i = 0; i < rowCount; i++) {
      const element = sourceArray[i];
      if (element !== 0) {
        column[i] = parseFloat((element - n).toFixed(1)); // віднімаємо n від ненульових значень
      }
    }
    table.push(column); // додаємо колонку до таблиці

    // Обчислюємо суму ненульових елементів у цій колонці для поточної "букви"
    const sum = column.reduce((acc, el) => (el !== 0 ? acc + el : acc), 0);

    // Оновлюємо суму і перевіряємо, чи досягнута умова theta для кожної "букви"
    if (columnIndex % 2 === 1) {
      sumFirstLetter += sum;
      if (sumFirstLetter >= theta) isFirstLetterComplete = true;
    } else {
      sumSecondLetter += sum;
      if (sumSecondLetter >= theta) isSecondLetterComplete = true;
    }

    columnIndex++;
  }

  // Додаємо передостанній рядок для суми ненульових значень першої "букви"
  const sumFirstLetterRow = Array(table[0].length).fill('-');
  for (let col = 1; col < table[0].length; col += 2) {
    sumFirstLetterRow[col] = table[col].reduce((acc, el) => (el !== 0 ? acc + el : acc), 0);
  }
  table.push(sumFirstLetterRow);

  // Додаємо останній рядок для суми ненульових значень другої "букви"
  const sumSecondLetterRow = Array(table[0].length).fill('-');
  for (let col = 2; col < table[0].length; col += 2) {
    sumSecondLetterRow[col] = table[col].reduce((acc, el) => (el !== 0 ? acc + el : acc), 0);
  }
  table.push(sumSecondLetterRow);

  return table;
}

// Приклад використання функції
const resultTable = generateTable(secondTable, firstLetterTable, secondLetterTable, n, thetaR);
console.table(resultTable);

