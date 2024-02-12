const mongoose = require("mongoose");

const championSchema = mongoose.Schema(
    {
        "key": {
            type: Number,
            required: true,
            unique: true
        },
        "default_name": {
            type: String,
            required: true,
            unique: true
        },
        "name_id": {
            type: String,
            required: true,
            unique: true
        },
        "default_title": {
            type: String,
            required: true,
            unique: true
        },
        "image_icon": {
            type: String,
            required: true,
            unique: true
        },
        "image_splash": {
            type: String,
            required: true,
            unique: true
        },
        "image_load_screen": {
            type: String,
            required: true,
            unique: true
        },
        "roles": {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'role'
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('champion', championSchema)