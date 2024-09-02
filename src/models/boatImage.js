import config from '../config';
import utility from '../services/utility';

const defaultBoatImage = `${config.app.baseUrl}public/default-images/boat.png`;

module.exports = (sequelize, DataTypes) => {
  const boatImage = sequelize.define(
    'boatImage',
    {
      boatId: {
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
          return utility.getImage(str, defaultBoatImage);
        },
      },
    },
    {
      underscored: true,
    },
  );

  boatImage.associate = (models) => {
    boatImage.belongsTo(models.boat, {
      foreignKey: 'boatId',
    });
  };
  return boatImage;
};
