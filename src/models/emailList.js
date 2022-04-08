const mongoose = require('mongoose')

const emailListSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
    },
}, {
    timestamps: true
})
const EmailList = mongoose.model('EmailList', emailListSchema)

module.exports = EmailList