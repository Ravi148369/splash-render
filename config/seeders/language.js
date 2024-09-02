"use strict";

const table = "languages";
const listArray = [{ language_name: "English" }];
const data = listArray.map((element, index) => ({
  language_name: element.language_name,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
