require("dotenv").config();

const express = require("express");
const base64Img = require("base64-img");
const bodyParser = require("body-parser");

var fs = require("fs");
var app = express();

const port = process.env.APP_PORT;
const baseUrl =
  process.env.NODE_ENV == "development"
    ? `http://127.0.0.1:${port}`
    : `gallery.ppb.iwanprakoso.com`;

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Get all images that exist
app.get("/images", (req, res) => {
  var images = fs.readdirSync("./public");
  res.status(200).json({
    success: true,
    urls: images
      .map((image) => `${baseUrl}/${image}`)
      .filter((image) => !image.includes(".gitkeep")),
  });
  console.log(images);
});

// post image with base64 string encoded and return the public image url
app.post("/upload", (req, res) => {
  const { image } = req.body;
  base64Img.img(image, "./public", Date.now(), function (err, filepath) {
    const pathArr = filepath.split("/");
    const fileName = pathArr[pathArr.length - 1];

    res.status(200).json({
      success: true,
      url: `${baseUrl}/${fileName}`,
    });
  });
});

// delet ean image by it's name
app.delete("/:filename", (req, res) => {
  const path = "./public/" + req.params.filename;
  console.log(path);

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);

    res.status(200).json({
      success: true,
      message: "image deleted",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "image not found",
    });
  }
});

app.listen(port, () => {
  console.info(`listening on port ${port}`);
});
