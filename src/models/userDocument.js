import config from '../config';
import utility from '../services/utility';

const defaultUserDocument = `${config.app.baseUrl}public/default-images/userDocument.png`;

module.exports = (sequelize, DataTypes) => {
  const userDocument = sequelize.define(
    'userDocument',
    {
      userDocument: {
        type: DataTypes.STRING,
        set(val) {
          let tmpStr = val;
          tmpStr = tmpStr.replace(/\\/g, '/');
          this.setDataValue('userDocument', tmpStr);
        },
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approve', 'reject'),
        defaultValue: 'pending',
      },
      userDocumentUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const str = this.get('userDocument');
          return utility.getImage(str, defaultUserDocument);
        },
      },
    },
    {
      underscored: true,
    },
  );

  userDocument.associate = (models) => {
    userDocument.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };

  return userDocument;
};
