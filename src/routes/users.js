const router = require('express').Router();
const passport = require('passport');
const User = require('../models/Users');

const { isNotAuthenticated } = require('../helpers/auth')
/* Rutas get */
router.get('/users/signup', isNotAuthenticated, (req, res) => {
    res.render('users/signup');
})
router.get('/users/signin', isNotAuthenticated, (req, res) => {
    res.render('users/signin');
});

/* Rutas post */
router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    const errors = [];
    if (!name) {
        errors.push({ text: 'Por favor Ingrese su nombre' })
    };
    if (!email) {
        errors.push({ text: 'Ingrese su email' })
    };
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseña tiene que ser iguales' })
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña tiene que tener mas de 4 caracteres' })
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email });

    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'El email esta siendo usado');
            res.redirect('/users/signup');
        } else {
            const NewUser = new User({ name, email, password, });
            NewUser.password = await NewUser.encriptarContraseña(password)
            await NewUser.save();
            req.flash('success_msg', 'Te acabas de registrar !');
            res.redirect('/users/signin')
        }
    }
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes/all-notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

/* ruta para cerrar sesion */

router.get('/users/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg','Adiossss');
    res.redirect('/users/signin');
})


module.exports = router;

