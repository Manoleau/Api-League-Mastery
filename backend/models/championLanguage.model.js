const mongoose = require("mongoose");

const championLanguageSchema = mongoose.Schema(
    {
        "name": {
            type: String,
            required : true
        },
        "name_alt": {
            type: String,
            required : true
        },
        "title": {
            type: String,
            required : true
        },
        "language": {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: 'language'
        },
        "champion":{
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: 'champion'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('champion_language', championLanguageSchema)