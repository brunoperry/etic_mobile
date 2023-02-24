import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});