import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sellersTable, productsTable } from "@workspace/db";
import { eq, count, countDistinct } from "drizzle-orm";

const router: IRouter = Router();

router.get("/marketplace/stats", async (req, res) => {
  try {
    const [sellerCount] = await db.select({ count: count() }).from(sellersTable);
    const [productCount] = await db.select({ count: count() }).from(productsTable);
    const [locationCount] = await db.select({ count: countDistinct(productsTable.location) }).from(productsTable);
    const [featuredCount] = await db.select({ count: count() }).from(sellersTable).where(eq(sellersTable.isPremium, true));

    res.json({
      totalSellers: Number(sellerCount.count),
      totalProducts: Number(productCount.count),
      totalLocations: Number(locationCount.count),
      totalCategories: 8,
      featuredSellers: Number(featuredCount.count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get marketplace stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
