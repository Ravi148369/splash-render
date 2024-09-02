const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define(
    'country',
    {
      name: {
        type: DataTypes.STRING(100),
      },
      countryCode: {
        type: DataTypes.STRING(20),
      },
      phoneCode: {
        type: DataTypes.STRING(10),
      },
      unit: {
        type: DataTypes.STRING(50),
        comment: 'miles, kms',
      },
      cgst: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
      },
      emergencyNumber: {
        type: DataTypes.STRING(50),
      },
      iso3: {
        type: DataTypes.STRING(3),
      },
      numericCode: {
        type: DataTypes.STRING(3),
      },
      iso2: {
        type: DataTypes.STRING(2),
      },
      capital: {
        type: DataTypes.STRING(255),
      },
      currency: {
        type: DataTypes.STRING(255),
      },
      currencyName: {
        type: DataTypes.STRING(255),
      },
      currencySymbol: {
        type: DataTypes.STRING(255),
      },
      tld: {
        type: DataTypes.STRING(255),
      },
      native: {
        type: DataTypes.STRING(255),
      },
      region: {
        type: DataTypes.STRING(255),
      },
      subRegion: {
        type: DataTypes.STRING(255),
      },
      timezones: {
        type: DataTypes.TEXT,
      },
      translations: {
        type: DataTypes.TEXT,
      },
      latitude: {
        type: DataTypes.STRING(20),
      },
      longitude: {
        type: DataTypes.STRING(20),
      },
      emoji: {
        type: DataTypes.STRING(255),
      },
      emojiU: {
        type: DataTypes.STRING(255),
      },
      flag: {
        type: DataTypes.TINYINT(1),
      },
      wiki_data_id: {
        type: DataTypes.STRING(255),
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
    },
    {
      underscored: true,
    },
  );

  country.loadScopes = () => {
    country.addScope('activeCountry', {
      where: {
        status: 'active',
      },
    });

    country.addScope('notDeletedCountry', {
      where: {
        status: { [Op.ne]: 'deleted' },
      },
    });
  };

  country.associate = (models) => {
    // associations can be defined here
    country.hasMany(models.state, {
      foreignKey: 'countryId',
    });
  };

  return country;
};
