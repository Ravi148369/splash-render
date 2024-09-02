const table = 'service_fees';
const listArray = [{
  id: 1, renterFees: 0, ownerFees: 0, feesType: 'percentage', currency: 'usd',
}];
const data = listArray.map((element) => ({
  id: element.id,
  renter_fees: element.renterFees,
  owner_fees: element.ownerFees,
  fees_type: element.feesType,
  currency: element.currency,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface) => queryInterface.bulkDelete(table, null, {}),
};
