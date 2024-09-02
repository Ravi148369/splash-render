module.exports = (sequelize, DataTypes) => {
  const boatRuleList = sequelize.define(
    'boatRuleList',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      ruleId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  boatRuleList.associate = (models) => {
    boatRuleList.belongsTo(models.boat, {
      foreignKey: 'boatId',
      as: 'boat',
    });
    boatRuleList.belongsTo(models.boatRule, {
      foreignKey: 'ruleId',
    });
  };
  return boatRuleList;
};
