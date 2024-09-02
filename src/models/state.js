const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const state = sequelize.define(
    'state',
    {
      name: {
        type: DataTypes.STRING(100),
      },
      stateCode: {
        type: DataTypes.STRING(10),
      },
      countryId: {
        type: DataTypes.INTEGER,
      },
      createdById: {
        type: DataTypes.INTEGER,
      },
      updatedById: {
        type: DataTypes.INTEGER,
      },
      deletedById: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active',
      },
      countryCode: {
        type: DataTypes.STRING(2),
      },
      fipsCode: {
        type: DataTypes.STRING(3),
      },
      iso2: {
        type: DataTypes.STRING(2),
      },
      type: {
        type: DataTypes.STRING(255),
      },
      latitude: {
        type: DataTypes.STRING(20),
      },
      longitude: {
        type: DataTypes.STRING(20),
      },
      flag: {
        type: DataTypes.TINYINT(1),
      },
      wikiDataId: {
        type: DataTypes.STRING(255),
      },
    },
    {
      underscored: true,
    },
  );

  state.loadScopes = () => {
    state.addScope('activeState', {
      where: {
        status: 'active',
      },
    });

    state.addScope('notDeletedState', {
      where: {
        status: { [Op.ne]: 'deleted' },
      },
    });
  };

  state.associate = (models) => {
    // associations can be defined here
    state.hasMany(models.city, {
      foreignKey: 'stateId',
    });
    state.belongsTo(models.country, {
      foreignKey: 'countryId',
    });
  };

  return state;
};
