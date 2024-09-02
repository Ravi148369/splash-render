import config from '../config';
import utility from '../services/utility';

const defaultEventImage = `${config.app.baseUrl}public/default-images/event.png`;

module.exports = (sequelize, DataTypes) => {
  const eventImage = sequelize.define(
    'eventImage',
    {
      eventId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('image', tmpStr);
        },
      },
      coverImage: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('image');
          return utility.getImage(str, defaultEventImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  eventImage.associate = (models) => {
    eventImage.belongsTo(models.event, {
      foreignKey: 'eventId',
      as: 'event',
    });
  };
  return eventImage;
};
