const express = require("express");
const dbConnection = require("./dbConnection");
const app = express();

app.use(express.json());

app.get('/',(req, res)=>{
    res.send('kanban backend server setup');
})

app.listen(3000, () => {
  console.log("Server started");
});
