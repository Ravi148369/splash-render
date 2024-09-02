"use strict";

const table = "countries";
const listArray = [{ id: 223, name: "United States", country_code:"US", phone_code:1, iso3:"USA", iso2: "US", currency: "USD", status: "active" }];
const data = listArray.map((element, index) => ({
  id: element.id,
  name: element.name,
  country_code: element.country_code,
  phone_code: element.phone_code,
  iso3: element.iso3,
  iso2: element.iso2,
  currency: element.currency,
  status: element.status,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
