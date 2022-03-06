const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
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
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);