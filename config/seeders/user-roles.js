"use strict";

const table = "user_roles";
const listArray = [{ user_id: "1", role_id: "1" }];
const data = listArray.map((element, index) => ({
  user_id: element.user_id,
  role_id: element.role_id,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
