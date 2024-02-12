const mongoose = require("mongoose");

const summonerSchema = mongoose.Schema(
    {
       
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('summoner', summonerSchema)