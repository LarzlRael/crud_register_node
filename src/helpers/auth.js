const helper = {};
helper.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'no authorized');
    res.redirect('/users/signin');
};
helper.isNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'no authorized');
    res.redirect('/notes/all-notes');
};


module.exports = helper;