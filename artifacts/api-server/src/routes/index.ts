import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adsRouter from "./ads";
import statsRouter from "./stats";
import brandingRouter from "./branding";
import adminRouter from "./admin";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import unitsRouter from "./units";
import promotionPricesRouter from "./promotion-prices";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adsRouter);
router.use(statsRouter);
router.use(brandingRouter);
router.use(adminRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(unitsRouter);
router.use(promotionPricesRouter);

export default router;
