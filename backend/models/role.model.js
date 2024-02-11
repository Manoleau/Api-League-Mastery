const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
    {
        "default_name": {
            type: String,
            required : true,
            unique: true
        },
        "image_icon": {
            type: String,
            required : true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('role', roleSchema)