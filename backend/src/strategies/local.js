import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user.model';

passport.serializeUser((user, done) => {
    console.log('inside serizalize, user: ', user);
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    console.log('inside deserizalize, username: ', username);
    try {
        const user = await User.findOne({ username: username }).exec();

        if (user) {
            done(null, user);
        }
    } catch (error) {
        done(error, false);
    }
});

passport.use(
    'local',
    new LocalStrategy(async (username, password, done) => {
        try {
            // try to find the user in the database
            const user = await User.findOne({ username: username }).exec();

            console.log('inside LocalStrategy');

            // if no user was found
            if (!user) {
                done(null, false);
            }

            // check if the password sent over with the request matches the one in the database
            const match = await user.checkPassword(password);

            if (!match) {
                done(null, false);
            }

            done(null, user);
        } catch (error) {
            console.log(error);
            done(error, false);
        }
    })
);
