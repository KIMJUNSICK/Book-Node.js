export default (sequelize, DataTypes) =>
  sequelize.define(
    "hashtag",
    {
      content: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
      }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
