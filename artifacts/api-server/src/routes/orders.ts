import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, cartItemsTable, insertOrderSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/orders", async (req, res) => {
  try {
    const data = insertOrderSchema.parse(req.body);
    
    const cartItems = await db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.sessionId, data.sessionId));

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const inserted = await db
      .insert(ordersTable)
      .values({ ...data, status: "pending" })
      .returning();

    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, data.sessionId));

    res.status(201).json({ ...inserted[0], items: cartItems });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
