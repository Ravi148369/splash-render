const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const city = sequelize.define(
    'city',
    {
      name: {
        type: DataTypes.STRING(100),
      },
      stateId: {
        type: DataTypes.INTEGER,
      },
      stateCode: {
        type: DataTypes.STRING(10),
      },
      countryId: {
        type: DataTypes.INTEGER,
      },
      countryCode: {
        type: DataTypes.STRING(10),
      },
      createdById: {
        type: DataTypes.INTEGER,
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
    },
    {
      underscored: true,
    },
  );

  city.loadScopes = () => {
    city.addScope('activeCity', {
      where: {
        status: 'active',
      },
    });

    city.addScope('notDeletedCity', {
      where: {
        status: { [Op.ne]: 'deleted' },
      },
    });
  };

  city.associate = (models) => {
    city.belongsTo(models.state, {
      foreignKey: 'stateId',
    });
    city.belongsTo(models.country, {
      foreignKey: 'countryId',
    });
  };
  return city;
};
