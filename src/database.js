const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/note-notes-cuaderno', {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(db=>console.log('DB is connect'))
.catch(err=>console.error(err))