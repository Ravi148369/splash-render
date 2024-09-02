"use strict";

const table = "static_content_managements";
const listArray = [
  {
    id: "1",
    page_name: "About",
    meta_title: "About",
    meta_description: "About",
    content: "About",
  },
  {
    id: "2",
    page_name: "Privacy Policy",
    meta_title: "Privacy Policy",
    meta_description: "Privacy Policy",
    content: "Privacy Policy",
  },
  {
    id: "3",
    page_name: "Terms & Conditions",
    meta_title: "Terms & Conditions",
    meta_description: "Terms & Conditions",
    content: "Terms & Conditions",
  },
  {
    id: "4",
    page_name: "Legal Notice",
    meta_title: "Legal Notice",
    meta_description: "Legal Notice",
    content: "Legal Notice",
  },
  {
    id: "5",
    page_name: "Help",
    meta_title: "Help",
    meta_description: "Help",
    content: "Help",
  },
];
const data = listArray.map((element, index) => ({
  id: element.id,
  page_name: element.page_name,
  meta_title: element.meta_title,
  meta_description: element.meta_description,
  content: element.content,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete(table, null, {}),
};
