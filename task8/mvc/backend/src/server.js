const express = require("express");
const app = express();
const studentRoutes = require("./routes/student.routes");


const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(studentRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});