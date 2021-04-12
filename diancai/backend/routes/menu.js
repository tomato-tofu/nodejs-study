const express = require("express");
const { item, list } = require("../controllers/menu");

var router = express.Router();

router.post("/", item);
router.get("/", list);

module.exports = router;
