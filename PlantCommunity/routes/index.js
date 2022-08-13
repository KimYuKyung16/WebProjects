const express = require('express');
var fs = require('fs');
const app = express();
const cors = require('cors');
const ejs = require("ejs");
const router = express.Router();

app.use(express.static('public'));


module.exports = router