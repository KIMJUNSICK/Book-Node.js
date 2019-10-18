import Sequelize from "sequelize";
import Config from "../config/config";
import User from "./User";
import Post from "./Post";
import HashTag from "./HashTag";

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

// Relationship: 1:N
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// M:N
db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });

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
