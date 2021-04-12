const express = require("express");
const path = require("path");
const fs = require("fs");
const notesdb = require("./db/db.json");
const { v4: uuidv4 } = require("uuid"); // To give each note a unique id when it's saved

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//  HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

function writeToNotesdb(notes) {
  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
    if (err) throw err;
    return true;
  });
}

// API
app.get("/api/notes", (req, res) => {
  res.json(notesdb);
});

app.post("/api/notes", (req, res) => {
  let newNotes = req.body;
  req.body.id = uuidv4().toString();
  notesdb.push(newNotes);
  writeToNotesdb(notesdb);
  res.json(req.body);
});

app.delete("/api/notes/:id", (req, res) => {
  for (let i = 0; i < notesdb.length; i++) {
    if (notesdb[i].id == req.params.id) {
      notesdb.splice(i, 1);
      break;
    }
  }
  writeToNotesdb(notesdb);
  res.json(notesdb);
});

app.listen(PORT, () => {
  console.log(`API server now listening to port ${PORT}`);
});
