const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1 : get user notes : GET "/api/notes/fetchnotes"

router.get('/fetchnotes', fetchuser, async (req, res) => {
  try {
    
    const note=await Notes.find({user:req.user.id});
    res.send(note);

  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error");
  }
});
// Route 2 : post user notes : post "/api/notes/addnote"

router.post( "/addnote",
  [
    body("title", "title must be atleast 3 char ").isLength({ min: 3 }),
    body("description", "description must be atleat 5 char").isLength({min: 5}),
  ],
  fetchuser,
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    try {
     const {title,description,tag}=req.body;
      const note =await new Notes({title,description,tag,user:req.user.id });
      await note.save();
      res.json(note);
    } 
    catch (err) {
      console.log(err.message);
      res.status(500).send("some error");
    }
  }
);
// Route 3 : Update user notes : post "/api/notes/updatenote/:id"

router.put('/updatenote/:id',fetchuser, async(req,res)=>{
  const {title,description,tag}=req.body;
  const newnote={}
  if(title){newnote.title=title;}
  if(description){newnote.description=description;}
  if(tag){newnote.tag=tag;}

  let note=await Notes.findById(req.params.id);
  if(!note){
   return  res.status(404).send("not found");
  }
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not allowed");
  }
  note=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
res.json(note);

})
// Route 4 : Delete user notes : post "/api/notes/deletenote/:id"

router.delete('/deletenote/:id',fetchuser, async(req,res)=>{
  const {title,description,tag}=req.body;
  const newnote={}
  if(title){newnote.title=title;}
  if(description){newnote.description=description;}
  if(tag){newnote.tag=tag;}

  // find the note to be deleted
  let note=await Notes.findById(req.params.id);
  if(!note){
   return  res.status(404).send("not found");
  }
  // allow deletion only if user owns this note
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not allowed");
  }
  note=await Notes.findByIdAndDelete(req.params.id)
  res.json({"success":"Note has benn deleted",note});


})



module.exports = router;
