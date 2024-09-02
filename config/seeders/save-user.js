"use strict";

const table = "users";
const listArray = [
  {
    email: "backend@mailinator.com",
    password: "$2a$08$dQWrGSXodiFE5gn7jphCB.tAFU30pzBRSueeBewbhTxfEnr8l/1FK",
    first_name: "admin",
    last_name: "",
    username: "admin",
    status: "active",
    country_code: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
  },
];
const data = listArray.map((element, index) => ({
  email: element.email,
  password: element.password,
  first_name: element.first_name,
  last_name: element.last_name,
  username: element.username,
  country_code: element.country_code,
  phone_number: element.phone_number,
  gender: element.gender,
  date_of_birth: element.date_of_birth,
  status: element.status,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
