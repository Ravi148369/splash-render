const table = "sales_taxes";
const listArray = [
  {
    id: 1,
    zipCode: 16103,
    salesTax: 10,
    taxType: "percentage",
  },
];
const data = listArray.map((element) => ({
  id: element.id,
  zip_code: element.zipCode,
  sales_tax: element.salesTax,
  tax_type: element.taxType,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface) => queryInterface.bulkDelete(table, null, {}),
};
