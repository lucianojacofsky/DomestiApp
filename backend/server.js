const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("DomestiApp backend funcionando"));

app.listen(5000, () => console.log("Servidor en puerto 5000"));