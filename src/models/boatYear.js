module.exports = (sequelize, DataTypes) => {
  const boatYear = sequelize.define(
    'boatYear',
    {
      year: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
    },
    {
      underscored: true,
    },
  );

  boatYear.loadScopes = () => {
    boatYear.addScope('activeState', {
      where: {
        status: 'active',
      },
    });
  };

  return boatYear;
};
