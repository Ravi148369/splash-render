module.exports = (sequelize, DataTypes) => {
  const userBankAccount = sequelize.define(
    'userBankAccount',
    {
      userId: {
        type: DataTypes.INTEGER(11),
        comment: 'owner user id',
        allowNull: false,
      },
      accountHolderName: {
        type: DataTypes.STRING(100),
      },
      email: {
        type: DataTypes.STRING(100),
      },
      bankName: {
        type: DataTypes.STRING(50),
      },
      bankLocation: {
        type: DataTypes.STRING(100),
      },
      accountNumber: {
        type: DataTypes.STRING(100),
      },
      routingNumber: {
        type: DataTypes.STRING(100),
      },
      stripeAccountId: {
        type: DataTypes.STRING(256),
      },
      description: {
        type: DataTypes.TEXT,
      },
      taxClassification: {
        type: DataTypes.STRING(120),
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

  userBankAccount.associate = (models) => {
    userBankAccount.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return userBankAccount;
};
