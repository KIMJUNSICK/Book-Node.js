import local from "./localStrategy";
import kakao from "./kakaoStrategy";
import db from "../models";

const { User } = db;

export default passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["id", "nick"], as: "Followers" },
        { model: User, attributes: ["id", "nick"], as: "Followings" }
      ]
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
