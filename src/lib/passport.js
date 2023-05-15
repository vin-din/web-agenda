const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0){
        const user = rows[0];
        const validPass = await helpers.matchPass(password, user.password);
        if(validPass){
            done(null, user, req.flash('agendado', 'Bienvenido' + user.username));
        } else {
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','El usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0){
        return done(null, false, req.flash('message','El usuario ya existe'));
    } else {
        const { fullname } = req.body;
        const newuser = {
            username,
            password,
            fullname
        };
        newuser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ?', [newuser]);
        newuser.id = result.insertId;
        return done (null, newuser);
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});