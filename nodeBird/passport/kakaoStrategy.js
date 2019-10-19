import kakao from "passport-kakao";
import db from "../models";

const KakaoStrategy = kakao.Strategy;
const { User } = db;

export default passport => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const existingUser = await User.find({
            snsId: profile.id,
            provider: "kakao"
          });
          if (existingUser) {
            done(null, existingUser);
          } else {
            const newUser = await User.create({
              // eslint-disable-next-line no-underscore-dangle
              email: profile._json && profile._json.kaccount_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao"
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
