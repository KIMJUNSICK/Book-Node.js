import local from "passport-local";
import bcrypt from "bcrypt";
import db from "../models";

const LocalStrategy = local.Strategy;
const { User } = db;

export default passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const existingUser = await User.find({ where: { email } });
          if (existingUser) {
            const result = await bcrypt.compare(
              password,
              existingUser.password
            );
            if (result) {
              done(null, existingUser);
            } else {
              done(null, false, { message: "password is not valid" });
            }
          } else {
            done(null, false, { message: "Email Not Found" });
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
