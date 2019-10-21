export default (sequelize, DataTypes) =>
  sequelize.define(
    "domain",
    {
      host: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      clientSecret: {
        type: DataTypes.STRING(40),
        allowNull: false
      }
    },
    {
      validate: {
        unknownType() {
          console.log(this.type, this.type !== "free", this.type !== "premium");
          if (this.type !== "free" && this.type !== "premium") {
            throw new Error("type must be free of premium");
          }
        }
      },
      timestamps: true,
      paranoid: true
    }
  );
