import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable, productsTable, insertReviewSchema } from "@workspace/db";
import { eq, avg } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews", async (req, res) => {
  try {
    const productId = Number(req.query.productId);
    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId));

    const avgResult = await db
      .select({ avg: avg(reviewsTable.rating) })
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId));

    const averageRating = Number(avgResult[0]?.avg || 0);

    res.json({ reviews, averageRating, total: reviews.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const data = insertReviewSchema.parse(req.body);
    const inserted = await db.insert(reviewsTable).values(data).returning();

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, data.productId));
    
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await db
      .update(productsTable)
      .set({ rating: avgRating, reviewCount: reviews.length })
      .where(eq(productsTable.id, data.productId));

    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create review");
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
