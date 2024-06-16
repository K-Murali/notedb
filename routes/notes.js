const express = require("express");
const router = express.Router();
const multer = require("multer");
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { handle_likes } = require("../controllers/notescontroller");

// Route 1 : get user notes : GET "/api/notes/fetchnotes"
// uploading image

const multerstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images/");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    const ext = file.mimetype.split("/")[1];
    cb(null, req.body.title + Date.now() + "." + ext);
  },
});

const multerfilter = (req, file, cb) => {
  if (req.mimetype.startswith("image")) {
    cb(null, true);
  } else {
    cb(new error("please upload image type"), false);
  }
};

const upload = multer({
  storage: multerstorage,
  filter: multerfilter,
});

router.patch("/like", fetchuser, handle_likes);

router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const note = await Notes.find({ user: req.user.id }).populate("comments");
    res.send(note);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error");
  }
});

router.get("/allnotes", async (req, res) => {
  try {
    const note = await Notes.find().populate("comments");
    res.json(note);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error");
  }
});

router.get("/getbyid/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id).populate("comments user");
    res.json(note);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error");
  }
});
router.get("/getcomments/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id)
      .populate("comments")
      .select("comments");
    res.json(note);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error");
  }
});
router.post("/like/:tourid", fetchuser, async (req, res) => {
  try {
    const userid = req.user.id;
    const notes = await Notes.findById(req.params.tourid);
    console.log("user" + req.user.id);

    if (!notes) return res.status(404).json({ msg: "Note not found" });
    console.log(notes.likes);
    if (!notes.likes) {
      notes.likes = userid;

      await notes.save();
      res.json({ likes: notes.likes.length });
    }
    const hasLiked = notes.likes.includes(userid);

    if (hasLiked) {
      notes.likes = notes.likes.filter(
        (e) => e.toString() !== userid.toString()
      );
    } else {
      notes.likes.push(userid);
    }

    await notes.save();
    res.json({ likes: notes.likes.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route 2 : post user notes : post "/api/notes/addnote"
router.post(
  "/addnote",
  upload.single("photo"),
  [
    body("title", "title must be at least 3 char ").isLength({ min: 3 }),
    body("description", "description must be at least 5 char").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    try {
      const { title, description, tag, para } = req.body;
      console.log(req.body); // Ensure req.file is defined
      const note = new Notes({
        title,
        description,
        photo: req.file.filename,
        para, // Access uploaded file using req.file
        tag,
        user: req.user.id,
      });
      await note.save();
      res.json(note);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("some error");
    }
  }
);

// Route 3 : Update user notes : post "/api/notes/updatenote/:id"

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newnote = {};
  if (title) {
    newnote.title = title;
  }
  if (description) {
    newnote.description = description;
  }
  if (tag) {
    newnote.tag = tag;
  }

  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newnote },
    { new: true }
  );
  res.json(note);
});
// Route 4 : Delete user notes : post "/api/notes/deletenote/:id"

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newnote = {};
  if (title) {
    newnote.title = title;
  }
  if (description) {
    newnote.description = description;
  }
  if (tag) {
    newnote.tag = tag;
  }

  // find the note to be deleted
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }
  // allow deletion only if user owns this note
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ success: "Note has benn deleted", note });
});

module.exports = router;
