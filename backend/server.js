const express = require('express');
const app = express();
const PORT = 3000;

const connectDB = require("./config/db")
require('dotenv').config()

connectDB();

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey || req.body.apiKey;
    if (!apiKey) {
        return res.status(401).json({ message: "API Key est requis" });
    }
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: "API Key invalide" });
    }
    next();
};

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/admin/champions", apiKeyMiddleware, require("./routes/adminChampion.routes"))
app.use("/admin/languages", apiKeyMiddleware, require("./routes/adminLanguage.routes"))
app.use("/admin/roles", apiKeyMiddleware, require("./routes/adminRole.routes"))

app.use("/champions", require("./routes/champion.routes"))
app.use("/languages", require("./routes/language.routes"))
app.use("/roles", require("./routes/role.routes"))


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose s\'est mal passé!');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
