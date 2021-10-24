const express = require("express");
const Notes = require("../models/Notes");
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Route-1: fetching notes of a user using get: /api/notes/fetchallnotes  login required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const note = await Notes.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route-2: adding notes of a user using post: /api/notes/addnotes  login required
router.post(
  "/addnotes",
  fetchUser,
  [
    //here we use express validator to make unique
    body("title", "title length should be min 3 characters").isLength({
      min: 3,
    }),
    body(
      "description",
      "description length should be min 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route-3: update notes of a user using put: /api/notes/updatenotes/:id  login required
router.put("/updatenotes/:id", fetchUser, async (req, res) => {
  // Destructuring
  const { title, description, tag } = req.body;
  try {
    // create new note and copy the value from req.body
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //find the id
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    // checking the id of fetch user is equal to note.user
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }
    //  update the notes by setting it with new note
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route-4: deleting notes of a user using delete: /api/notes/deletenotes/:id  login required
router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  try {
    //find the id
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    // verifying that the user owns that note or not
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
