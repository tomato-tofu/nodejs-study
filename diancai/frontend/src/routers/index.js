import SMERouter from "sme-router";
import index from "../controllers/index";
import login from "../controllers/login";
const router = new SMERouter("root");

router.route("/", login(router));

router.route("/login", login(router));

router.route("/menu", index(router));

export default router;
