const mongoose = require("mongoose");

const summonerSchema = mongoose.Schema(
    {
        "summonerId": {
            type: String,
            required: true
        },
        "accountId": {
            type: String,
            required: true
        },
        "puuid": {
            type: String,
            required: true
        },
        "server": {
            type: String,
            required: true
        },
        "summonerName": {
            type: String,
            required: true
        },
        "riotName": {
            type: String,
            required: true
        },
        "tag": {
            type: String,
            required: true
        },
        "profileIconId": {
            type: Number,
            required: true
        },
        "summonerLevel": {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)

summonerSchema.index({ "summonerId": 1, "accountId": 1, "puuid": 1 }, { "unique": true });
module.exports = mongoose.model('summoner', summonerSchema)