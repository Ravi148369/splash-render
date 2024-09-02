"use strict";

const table = "currencies";
const listArray = [{ currencyName: "USD" }];
const data = listArray.map((element, index) => ({
  currency_name: element.currencyName,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
