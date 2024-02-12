const express = require('express');
const app = express();
const PORT = 3000;

const connectDB = require("./config/db")
require('dotenv').config()

connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/champions", require("./routes/champion.routes"))
app.use("/languages", require("./routes/language.routes"))
app.use("/roles", require("./routes/role.routes"))

app.use("/role_languages", require("./routes/roleLanguage.routes"))
app.use("/champion_languages", require("./routes/championLanguage.routes"))


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
