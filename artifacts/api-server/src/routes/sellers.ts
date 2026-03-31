import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sellersTable, productsTable, insertSellerSchema } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sellers/featured", async (req, res) => {
  try {
    const sellers = await db
      .select()
      .from(sellersTable)
      .where(eq(sellersTable.isPremium, true))
      .limit(8);
    res.json({ sellers, total: sellers.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get featured sellers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sellers", async (req, res) => {
  try {
    const { location, category } = req.query;
    const conditions = [];

    if (location && typeof location === "string") {
      conditions.push(ilike(sellersTable.location, `%${location}%`));
    }

    const sellers = await db
      .select()
      .from(sellersTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const filtered = category && typeof category === "string"
      ? sellers.filter((s) => s.categories?.includes(category))
      : sellers;

    res.json({ sellers: filtered, total: filtered.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get sellers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sellers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const sellers = await db.select().from(sellersTable).where(eq(sellersTable.id, id)).limit(1);
    if (sellers.length === 0) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const seller = sellers[0];
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.sellerId, id))
      .limit(20);

    res.json({ ...seller, products });
  } catch (err) {
    req.log.error({ err }, "Failed to get seller");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/sellers", async (req, res) => {
  try {
    const data = insertSellerSchema.parse(req.body);
    const inserted = await db.insert(sellersTable).values(data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create seller");
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
