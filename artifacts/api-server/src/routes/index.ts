import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adsRouter from "./ads";
import statsRouter from "./stats";
import brandingRouter from "./branding";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adsRouter);
router.use(statsRouter);
router.use(brandingRouter);
router.use(adminRouter);

export default router;
