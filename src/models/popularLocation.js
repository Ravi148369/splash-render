import config from '../config';
import utility from '../services/utility';

const defaultPopularLocationImage = `${config.app.baseUrl}public/default-images/popularLocation.png`;

module.exports = (sequelize, DataTypes) => {
  const popularLocation = sequelize.define(
    'popularLocation',
    {
      popularLocationImage: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('popularLocationImage', tmpStr);
        },
      },
      location: {
        type: DataTypes.STRING,
      },
      locationAddress: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active',
      },
      popularLocationImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('popularLocationImage');
          return utility.getImage(str, defaultPopularLocationImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  return popularLocation;
};
