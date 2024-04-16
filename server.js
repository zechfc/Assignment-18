const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/crafts/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://zechfc:NRwjSeDyQ2gbB5B6@cluster0.q3aseaf.mongodb.net/")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const craftSchema = new mongoose.Schema({
  name: String,
  image: String,
  description:String,
  supplies:[String]
});

//show our index file when they go to the root of our website
const Craft = mongoose.model("Craft", craftSchema);



//my crafts list
// app.get("/api/crafts", (req,res) => {
// console.log("Someone is requesting our api")

// console.log(crafts);
// res.json(crafts);
// });

app.get("/", (req, res)=>{
  res.sendFile(__dirname + "/index.html");
});


app.get("/api/crafts", async (req, res) => {
  const crafts = await Craft.find();
  res.send(crafts);
});

app.get("/api/crafts/:id", async (req, res) => {
  const id = req.params.id;
  const craft = await Craft.findOne({_id:id});
  res.send(craft);
});

//why?
app.post("/api/crafts", upload.single("img"), async (req, res) => {
  const result = validateCraft(req.body);

  if(result.error){
    res.status(400).send(result.error.details[0].message);
    return;
  }

    const craft = new Craft ({
      image: req.body.image,
      name: req.body.name,
      description:req.body.description,
      supplies:req.body.supplies.split(",")
    })

    if(req.file){
      craft.image = "crafts/" + req.file.filename;
    }

    const saveResult = await craft.save();
    res.send(craft);


});


app.put("/api/crafts/:id", upload.single("image"), async (req, res) => {

  console.log("I found the craft " + craft.name);

  if(!craft){
    res.send(404).send("craft with given id was not found");
  }

  const result = validateCraft(req.body);

  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let fieldsToUpdate = {
    name:req.body.name,
    descriptiobodyn:req.body.description,
    supplies:req.body.supplies.split(",")
  };

  console.log("yay validated");

  if(req.file){
    fieldsToUpdate.image = "crafts/" + req.file.filename;
  }


  const id = req.params.id;
  const updateResult = await Craft.updateOne({_id:id},fieldsToUpdate);
  res.send(updateResult);
});

app.delete("/api/crafts/:id", async (req, res) => {
  const craft = await Craft.findByIdAndDelete(req.params.id);

  if(!craft){
    res.status(404).send("The craft with the given id was not found");
    return;
  }
  
  const index = crafts.indexOf(craft);
  crafts.splice(index, 1);
  res.send(craft);
});

const validateCraft = (craft) => {
  const schema = Joi.object({
    _id:Joi.allow(""),
    supplies:Joi.string().min(3).required(),
    name:Joi.string().min(3).required(),
    description:Joi.string().min(3).required()
  });

  return schema.validate(craft);
};

app.listen(3000, ()=> {
    console.log("I'm listening");
});