const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { isNotAuthenticated } = require('../helpers/auth')

const userSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
userSchema.methods.encriptarContraseña = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


module.exports = mongoose.model('User', userSchema);