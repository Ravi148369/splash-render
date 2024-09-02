"use strict";

const table = "roles";
const listArray = [
  { role: "admin" },
  { role: "renter" },
  { role: "owner" },
  { role: "user" },
];
const data = listArray.map((element, index) => ({
  role: element.role,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
