const express = require("express");
const { item, list, dishesRemove } = require("../controllers/menu");

var router = express.Router();

router.post("/", item);
router.get("/", list);
router.delete("/", dishesRemove);
module.exports = router;
