const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postschema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['public', 'private'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Post', Postschema);
