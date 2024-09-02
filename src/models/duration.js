module.exports = (sequelize, DataTypes) => {
  const duration = sequelize.define(
    'duration',
    {
      duration: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        comment: 'duration in hours, max 24',
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

  duration.associate = () => {
    // associations can be defined here
  };
  return duration;
};
