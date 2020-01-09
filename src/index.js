const express = require('express');
const exphs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const app = express();
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
/* Configuraciones iniciales */
app.set('port', process.env.PORT || 3000);
require('./config/passport')
require('./database')

/* Settings */
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
/* Middelwares */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/* Variables globales */
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user;
    next();
})

/* Routes */
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

/* Static files */
app.use(express.static(path.join(__dirname, 'public')));



/* Haciendo correr el servidor */
app.listen(app.get('port'), () => {
    console.log('server on port ' + app.get('port'));
});
