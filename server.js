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
  .connect("mongodb+srv://zechfc:1MUWT0zP7sfVjzfJ@cluster0.q3aseaf.mongodb.net/")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const craftSchema = new mongoose.Schema({
  _id: String,
  name: String,
  image: String,
  description:String,
  supplies:[String]
});

//show our index file when they go to the root of our website
const Craft = mongoose.model("Recipe", craftSchema);

app.get("/", (req, res)=>{
  res.sendFile(__dirname + "/index.html");
});



let crafts = [];

crafts[0] = {
  _id: 0,
  name: "Beaded JellyFish",
  image: "crafts/bead-jellyfish.jpg",
  description: "Create a hanging jellyfish using eggcartons and multicolored beads",
  supplies: ["String", "egg cartons", "beads"]
};
crafts[1] = {
  _id: 1,
  name: "Character Bookmarks",
  image: "crafts/bookmarks.jpeg",
  description: "Create a little birdy bookmark to always remin you were you were",
  supplies: ["yellow construction paper",
  "orange construction paper",
  "black construction paper"]
};
crafts[2] = {
  _id: 2,
  name: "Button Flowers",
  image: "crafts/button-flowers.jpeg",
  description: "Create a fun bouquet of flowers with your favorite buttons",
  supplies: [
      "multicolored buttons",
      "multicolored flet",
      "green straws",
      "ribbon"
    ]
};
crafts[3] = {
  _id: 3,
  name: "Cheerio Necklaces",
  image: "crafts/cheerio-necklace.webp",
  description: "Create a fun and edible necklace",
  supplies: [
    "Cheerios or Fruit Loops",
    "Elastic string"
  ]
}

//my crafts list
// app.get("/api/crafts", (req,res) => {
// console.log("Someone is requesting our api")

// console.log(crafts);
// res.json(crafts);
// });


app.get("/api/crafts", (req, res)=>{
    res.send(crafts);
});

app.post("/api/crafts", upload.single("img"), (req, res) => {
  const result = validateCraft(req.body);

  if(result.error){
    console.log("test")
    res.status(400).send(result.error.details[0].message);
  }

    const craft = {
      _id : crafts.length + 1,
      image: req.body.image,
      name: req.body.name,
      description:req.body.description,
      supplies:req.body.supplies.split(",")
    }

    if(req.file){
      craft.image = "crafts/" + req.file.filename;
    }

    crafts.push(craft);
    res.send(crafts);
});


app.put("/api/crafts/:id", upload.single("img"), (req, res) => {
  const craft = crafts.find((r) => r._id === parseInt(req.params.id));

  console.log("I found the craft " + craft.name);

  if(!craft){
    res.send(404).send("craft with given id was not found");
  }

  const result = validateCraft(req.body);

  
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  craft.name = req.body.name;
  craft.description = req.body.description;
  craft.supplies = req.body.supplies.split(",");


  console.log("yay validated");
  if (req.file) {
    craft.image = "crafts/" + req.file.filename;
  }

  res.send(crafts);
});

app.delete("/api/crafts/:id", (req, res) => {
  const craft = crafts.find((r) => r._id === parseInt(req.params.id));

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