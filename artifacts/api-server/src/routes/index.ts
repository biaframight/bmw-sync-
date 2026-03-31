import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import sellersRouter from "./sellers";
import categoriesRouter from "./categories";
import reviewsRouter from "./reviews";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import marketplaceRouter from "./marketplace";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(sellersRouter);
router.use(categoriesRouter);
router.use(reviewsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(marketplaceRouter);

export default router;
