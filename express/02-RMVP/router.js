const { Router } = require("express");
const { list, ssr, ssrfile } = require("./controller.js");
const router = Router();

router.get("/list", list);

router.get("/ssr", ssr);

router.post("/ssrfile", ssrfile);

module.exports = router;
