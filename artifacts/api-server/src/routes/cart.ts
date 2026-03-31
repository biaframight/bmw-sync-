import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable, insertCartItemSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cart", async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const cartItems = await db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.sessionId, sessionId));

    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const products = await db
          .select()
          .from(productsTable)
          .where(eq(productsTable.id, item.productId))
          .limit(1);
        return { ...item, product: products[0] || null };
      })
    );

    const validItems = itemsWithProducts.filter((item) => item.product !== null);
    const total = validItems.reduce((sum, item) => {
      return sum + Number(item.product!.price) * item.quantity;
    }, 0);

    res.json({ items: validItems, total, itemCount: validItems.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const data = insertCartItemSchema.parse(req.body);

    const existing = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.sessionId, data.sessionId),
          eq(cartItemsTable.productId, data.productId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(cartItemsTable)
        .set({ quantity: existing[0].quantity + (data.quantity || 1) })
        .where(eq(cartItemsTable.id, existing[0].id))
        .returning();
      return res.status(201).json(updated[0]);
    }

    const inserted = await db.insert(cartItemsTable).values(data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/cart/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
