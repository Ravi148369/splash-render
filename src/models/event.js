module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define(
    'event',
    {
      boatId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventType: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      numberOfAttendee: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      bookedSeat: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
      },
      hostedBy: {
        type: DataTypes.STRING,
      },
      adultPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      childrenPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(20),
      },
      description: {
        type: DataTypes.TEXT,
      },
      cancellationPolicy: {
        type: DataTypes.ENUM('flexible', 'moderate', 'strict', "super strict"),
        defaultValue: 'flexible',
      },
      status: {
        type: DataTypes.ENUM('deleted', 'pending', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'completed',
      },
      cancelReason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      canceledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      underscored: true,
    },
  );

  event.addScope('eventList', () => ({
    include: [
      {
        model: sequelize.models.boat,
        as: 'boat',
        include: [
          {
            model: sequelize.models.boatImage,
            required: false,
          },
        ],
        required: false,
      },
      {
        model: sequelize.models.eventImage,
        required: false,
      },
    ],
  }));

  event.associate = (models) => {
    event.belongsTo(models.boat, {
      foreignKey: 'boatId',
      as: 'boat',
    });
    event.belongsTo(models.user, {
      foreignKey: 'createdBy',
      as: 'user',
    });
    event.hasMany(models.eventImage, {
      foreignKey: 'eventId',
      onDelete: 'cascade',
    });
  };
  return event;
};
