const table = 'states';
const listArray = [
  {
    id: '3613', country_id: '223', name: 'Alabama', state_code: 'AL', status: 'active',
  },
  {
    id: '3614', country_id: '223', name: 'Alaska', state_code: 'AK', status: 'active',
  },
  {
    id: '3616', country_id: '223', name: 'Arizona', state_code: 'AZ', status: 'active',
  },
  {
    id: '3617', country_id: '223', name: 'Arkansas', state_code: 'AR', status: 'active',
  },
  {
    id: '3624', country_id: '223', name: 'California', state_code: 'CA', status: 'active',
  },
  {
    id: '3625', country_id: '223', name: 'Colorado', state_code: 'CO', status: 'active',
  },
  {
    id: '3626', country_id: '223', name: 'Connecticut', state_code: 'CT', status: 'active',
  },
  {
    id: '3627', country_id: '223', name: 'Delaware', state_code: 'DE', status: 'active',
  },
  {
    id: '3630', country_id: '223', name: 'Florida', state_code: 'FL', status: 'active',
  },
  {
    id: '3631', country_id: '223', name: 'Georgia', state_code: 'GA', status: 'active',
  },
  {
    id: '3633', country_id: '223', name: 'Hawaii', state_code: 'HI', status: 'active',
  },
  {
    id: '3634', country_id: '223', name: 'Idaho', state_code: 'ID', status: 'active',
  },
  {
    id: '3635', country_id: '223', name: 'Illinois', state_code: 'IL', status: 'active',
  },
  {
    id: '3636', country_id: '223', name: 'Indiana', state_code: 'IN', status: 'active',
  },
  {
    id: '3637', country_id: '223', name: 'Iowa', state_code: 'IA', status: 'active',
  },
  {
    id: '3638', country_id: '223', name: 'Kansas', state_code: 'KS', status: 'active',
  },
  {
    id: '3639', country_id: '223', name: 'Kentucky', state_code: 'KY', status: 'active',
  },
  {
    id: '3640', country_id: '223', name: 'Louisiana', state_code: 'LA', status: 'active',
  },
  {
    id: '3641', country_id: '223', name: 'Maine', state_code: 'ME', status: 'active',
  },
  {
    id: '3643', country_id: '223', name: 'Maryland', state_code: 'MD', status: 'active',
  },
  {
    id: '3644', country_id: '223', name: 'Massachusetts', state_code: 'MA', status: 'active',
  },
  {
    id: '3645', country_id: '223', name: 'Michigan', state_code: 'MI', status: 'active',
  },
  {
    id: '3646', country_id: '223', name: 'Minnesota', state_code: 'MN', status: 'active',
  },
  {
    id: '3647', country_id: '223', name: 'Mississippi', state_code: 'MS', status: 'active',
  },
  {
    id: '3648', country_id: '223', name: 'Missouri', state_code: 'MO', status: 'active',
  },
  {
    id: '3649', country_id: '223', name: 'Montana', state_code: 'MT', status: 'active',
  },
  {
    id: '3650', country_id: '223', name: 'Nebraska', state_code: 'NE', status: 'active',
  },
  {
    id: '3651', country_id: '223', name: 'Nevada', state_code: 'NV', status: 'active',
  },
  {
    id: '3652', country_id: '223', name: 'New Hampshire', state_code: 'NH', status: 'active',
  },
  {
    id: '3653', country_id: '223', name: 'New Jersey', state_code: 'NJ', status: 'active',
  },
  {
    id: '3654', country_id: '223', name: 'New Mexico', state_code: 'NM', status: 'active',
  },
  {
    id: '3655', country_id: '223', name: 'New York', state_code: 'NY', status: 'active',
  },
  {
    id: '3656', country_id: '223', name: 'North Carolina', state_code: 'NC', status: 'active',
  },
  {
    id: '3657', country_id: '223', name: 'North Dakota', state_code: 'ND', status: 'active',
  },
  {
    id: '3659', country_id: '223', name: 'Ohio', state_code: 'OH', status: 'active',
  },
  {
    id: '3660', country_id: '223', name: 'Oklahoma', state_code: 'OK', status: 'active',
  },
  {
    id: '3661', country_id: '223', name: 'Oregon', state_code: 'OR', status: 'active',
  },
  {
    id: '3663', country_id: '223', name: 'Pennsylvania', state_code: 'PA', status: 'active',
  },
  {
    id: '3665', country_id: '223', name: 'Rhode Island', state_code: 'RI', status: 'active',
  },
  {
    id: '3666', country_id: '223', name: 'South Carolina', state_code: 'SC', status: 'active',
  },
  {
    id: '3667', country_id: '223', name: 'South Dakota', state_code: 'SD', status: 'active',
  },
  {
    id: '3668', country_id: '223', name: 'Tennessee', state_code: 'TN', status: 'active',
  },
  {
    id: '3669', country_id: '223', name: 'Texas', state_code: 'TX', status: 'active',
  },
  {
    id: '3670', country_id: '223', name: 'Utah', state_code: 'UT', status: 'active',
  },
  {
    id: '3671', country_id: '223', name: 'Vermont', state_code: 'VT', status: 'active',
  },
  {
    id: '3673', country_id: '223', name: 'Virginia', state_code: 'VA', status: 'active',
  },
  {
    id: '3674', country_id: '223', name: 'Washington', state_code: 'WA', status: 'active',
  },
  {
    id: '3675', country_id: '223', name: 'West Virginia', state_code: 'WV', status: 'active',
  },
  {
    id: '3676', country_id: '223', name: 'Wisconsin', state_code: 'WI', status: 'active',
  },
  {
    id: '3677', country_id: '223', name: 'Wyoming', state_code: 'WY', status: 'active',
  },
  {
    id: '3970', country_id: '223', name: 'District of Columbia', state_code: 'DC', status: 'active',
  },
];
const data = listArray.map((element, index) => ({
  id: element.id,
  country_id: element.country_id,
  name: element.name,
  state_code: element.state_code,
  status: element.status,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(table, data, {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete(table, null, {}),
};
