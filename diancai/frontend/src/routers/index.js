import SMERouter from "sme-router";
import { login, index } from "../controllers/index";

const router = new SMERouter("root");

router.route("/", login(router));

router.route("/login", login(router));

router.route("/index", index(router));

export default router;
