const mongoose = require("mongoose");

const championMasterySchema = mongoose.Schema(
    {
        "championLevel": {
            type: Number,
            required: true
        },
        "championPoints": {
            type: Number,
            required: true
        },
        "championPointsSinceLastLevel": {
            type: Number,
            required: true
        },
        "championPointsUntilNextLevel": {
            type: Number,
            required: true
        },
        "chestGranted": {
            type: Boolean,
            required: true
        },
        "summoner": {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'summoner',
            required: true,
        },
        "champion": {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'champion',
            required: true,
        }
    },
    {
        timestamps: true
    }
)

championMasterySchema.index({ "summoner": 1, "champion": 1 }, { "unique": true });

module.exports = mongoose.model('champion_mastery', championMasterySchema)