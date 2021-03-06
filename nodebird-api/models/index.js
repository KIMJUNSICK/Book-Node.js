import Sequelize from "sequelize";
import Config from "../config/config";
import User from "./User";
import Post from "./Post";
import HashTag from "./HashTag";
import Domain from "./Domain";

const env = process.env.NODE_ENV || "development";
const config = Config[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User(sequelize, Sequelize);
db.Post = Post(sequelize, Sequelize);
db.HashTag = HashTag(sequelize, Sequelize);
db.Domain = Domain(sequelize, Sequelize);

// Relationship: 1:N
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

// M:N
db.Post.belongsToMany(db.HashTag, { through: "PostHashtag" });
db.HashTag.belongsToMany(db.Post, { through: "PostHashtag" });

// M:M
db.User.belongsToMany(db.User, {
  foreignKey: "followingId",
  as: "Followers",
  through: "Follow"
});
db.User.belongsToMany(db.User, {
  foreignKey: "followerId",
  as: "Followings",
  through: "Follow"
});

export default db;
