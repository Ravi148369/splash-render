module.exports = (sequelize, DataTypes) => {
  const boatRule = sequelize.define(
    'boatRule',
    {
      name: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
    },
    {
      underscored: true,
    },
  );

  boatRule.loadScopes = () => {
    boatRule.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  return boatRule;
};
