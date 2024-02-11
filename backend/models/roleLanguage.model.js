const mongoose = require("mongoose");

const roleLanguageSchema = mongoose.Schema(
    {
        "name": {
            type: String,
            required : true
        },
        "language": {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: 'language'
        },
        "role": {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: 'role'
        }
    },
    {
        timestamps: true
    }
)
roleLanguageSchema.index({ "language": 1, "role": 1 }, { "unique": true });

module.exports = mongoose.model('role_language', roleLanguageSchema)