import { Router } from "express";
import { db, mediaTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateMediaBody, DeleteMediaParams, ListMediaQueryParams } from "@workspace/api-zod";
import { requireAuth } from "./auth";

const router = Router();

router.get("/media", async (req, res) => {
  const parsed = ListMediaQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { category, section } = parsed.data;
  let conditions: any[] = [];
  if (category) conditions.push(eq(mediaTable.category, category));
  if (section) conditions.push(eq(mediaTable.section, section));

  const items = conditions.length > 0
    ? await db.select().from(mediaTable).where(and(...conditions))
    : await db.select().from(mediaTable);

  const mapped = items.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));
  res.json(mapped);
});

router.post("/media", requireAuth, async (req, res) => {
  const parsed = CreateMediaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [created] = await db.insert(mediaTable).values({
    category: parsed.data.category,
    section: parsed.data.section,
    url: parsed.data.url,
    type: parsed.data.type,
    youtubeId: parsed.data.youtubeId ?? null,
  }).returning();
  res.status(201).json({
    ...created,
    createdAt: created.createdAt.toISOString(),
  });
});

router.delete("/media/:id", requireAuth, async (req, res) => {
  const parsed = DeleteMediaParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(mediaTable).where(eq(mediaTable.id, parsed.data.id));
  res.json({ success: true, message: "Deleted" });
});

export default router;
