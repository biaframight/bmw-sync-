import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, insertProductSchema } from "@workspace/db";
import { eq, and, gte, lte, ilike, or } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

router.get("/products/featured", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.isSponsored, true))
      .limit(10);
    res.json({ products, total: products.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get featured products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/nearby", async (req, res) => {
  try {
    const location = req.query.location as string;
    if (!location) {
      return res.status(400).json({ error: "location is required" });
    }
    const products = await db
      .select()
      .from(productsTable)
      .where(ilike(productsTable.location, `%${location}%`))
      .limit(20);
    res.json({ products, total: products.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get nearby products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, search, sellerId, limit = 50, offset = 0 } = req.query;
    const conditions = [];

    if (category && typeof category === "string") {
      conditions.push(eq(productsTable.category, category));
    }
    if (location && typeof location === "string") {
      conditions.push(ilike(productsTable.location, `%${location}%`));
    }
    if (sellerId) {
      conditions.push(eq(productsTable.sellerId, Number(sellerId)));
    }
    if (search && typeof search === "string") {
      conditions.push(
        or(
          ilike(productsTable.title, `%${search}%`),
          ilike(productsTable.description, `%${search}%`)
        )!
      );
    }

    const products = await db
      .select()
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(Number(limit))
      .offset(Number(offset));

    const filtered = products.filter((p) => {
      if (minPrice && Number(p.price) < Number(minPrice)) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });

    res.json({ products: filtered, total: filtered.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (products.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const product = products[0];
    res.json({
      ...product,
      images: product.images || [product.imageUrl].filter(Boolean),
      deliveryOptions: product.deliveryOptions || [],
      paymentMethods: product.paymentMethods || [],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const data = insertProductSchema.parse(req.body);
    const inserted = await db.insert(productsTable).values(data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
