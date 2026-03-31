import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

const CATEGORIES = [
  { id: 1, name: "Food", slug: "food", icon: "utensils" },
  { id: 2, name: "Fashion", slug: "fashion", icon: "shirt" },
  { id: 3, name: "Beauty", slug: "beauty", icon: "sparkles" },
  { id: 4, name: "Groceries", slug: "groceries", icon: "shopping-basket" },
  { id: 5, name: "Hair & Care", slug: "hair-care", icon: "scissors" },
  { id: 6, name: "Electronics", slug: "electronics", icon: "smartphone" },
  { id: 7, name: "Accessories", slug: "accessories", icon: "watch" },
  { id: 8, name: "Services", slug: "services", icon: "briefcase" },
];

router.get("/categories", async (req, res) => {
  try {
    const productCounts = await db
      .select({ category: productsTable.category, count: count() })
      .from(productsTable)
      .groupBy(productsTable.category);

    const countMap: Record<string, number> = {};
    productCounts.forEach(({ category, count }) => {
      const cat = CATEGORIES.find((c) => c.slug === category || c.name.toLowerCase() === category.toLowerCase());
      if (cat) {
        countMap[cat.slug] = Number(count);
      }
    });

    const categories = CATEGORIES.map((c) => ({
      ...c,
      productCount: countMap[c.slug] || 0,
    }));

    res.json({ categories });
  } catch (err) {
    req.log.error({ err }, "Failed to get categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
