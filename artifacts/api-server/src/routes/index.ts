import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adsRouter from "./ads";
import statsRouter from "./stats";
import brandingRouter from "./branding";
import adminRouter from "./admin";
import adminUsersRouter from "./admin-users";
import adminStatsRouter from "./admin-stats";
import adminModesRouter from "./admin-modes";
import authRouter from "./auth";
import categoriesRouter from "./categories";
import unitsRouter from "./units";
import promotionPricesRouter from "./promotion-prices";
import plansRouter from "./plans";
import platformConfigRouter from "./platform-config";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adsRouter);
router.use(statsRouter);
router.use(brandingRouter);
router.use(adminRouter);
router.use(adminUsersRouter);
router.use(adminStatsRouter);
router.use(adminModesRouter);
router.use(authRouter);
router.use(categoriesRouter);
router.use(unitsRouter);
router.use(promotionPricesRouter);
router.use(plansRouter);
router.use(platformConfigRouter);

export default router;
