export default {
  testEnvironment: 'node',
  transform: {},

  // ✅ ВКЛЮЧАЄМО COVERAGE
  collectCoverage: true,

  // ✅ ЗВІДКИ БРАТИ ФАЙЛИ ДЛЯ ПОКРИТТЯ
  collectCoverageFrom: [
    'libs/**/*.js'
  ],

  // (необовʼязково, але дуже корисно)
  coverageReporters: ['text', 'lcov'],

  // щоб не рахувало тести і node_modules
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.test.js'
  ]
};