const mongoose = require('mongoose')

const watcherSchema = new mongoose.Schema({
    EncodedURL: {
        type: String,
        required: true,
        trim: true,
    },
    NumberOfTheaters: {
        type: Number,
        default: false
    },
    TheaterList: {
        type : String ,
        default : ""
    },
    movieName : {
        type : String
    },
    TicketURL : {
        type : String
    }
}, {
    timestamps: true
})
const Watcher = mongoose.model('Watcher', watcherSchema)

module.exports = Watcher