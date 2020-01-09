const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const { isAuthenticated } = require('../helpers/auth')
/* Rutas get */

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note')
});
router.get('/notes/all-notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc' });
    res.render('notes/all-notes', { notes });

});
router.get('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndRemove({ _id: req.params.id });
    res.redirect('/notes/all-notes');
});
router.get('/notes/edit/:id', async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id })
    res.render('notes/edit', { note })
})

/* Rutas post */
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    if (!title) {
        errors.push({ text: 'Please write a title' })
    };
    if (!description) {
        errors.push({ text: 'Please write a description' })
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        await newNote.save();
        res.redirect('/notes/all-notes');
    }
});
router.post('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body
    await Note.findByIdAndUpdate(id, { title, description });
    res.redirect('/notes/all-notes')

})
module.exports = router;