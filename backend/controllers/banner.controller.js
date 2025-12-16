import db from "../config/db.js";

/* GET ALL BANNERS */
/* ================= GET ================= */
export const getBanners = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM banners ORDER BY display_order ASC"
  );
  res.json(rows);
};

/* ================= ADD ================= */
export const addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { title, redirect_url, status } = req.body;

    // ADMIN → NULL, SELLER → seller ID
    const seller_id =
      req.user.role === "seller" ? req.user.id : null;

    const image_url = `/uploads/banners/${req.file.filename}`;

    const [result] = await db.query(
      `INSERT INTO banners
       (title, image_url, redirect_url, status, seller_id, display_order)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [title, image_url, redirect_url || null, status, seller_id]
    );

    res.json({
      id: result.insertId,
      message: "Banner added successfully",
    });
  } catch (error) {
    console.error("ADD BANNER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



/* ================= UPDATE ================= */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, redirect_url, status } = req.body;

    let query = `UPDATE banners SET title=?, redirect_url=?, status=?`;
    let values = [title, redirect_url || null, status];

    if (req.file) {
      query += `, image_url=?`;
      values.push(`/uploads/banners/${req.file.filename}`);
    }

    query += ` WHERE id=?`;
    values.push(id);

    await db.query(query, values);

    res.json({ message: "Banner updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE ================= */
export const deleteBanner = async (req, res) => {
  await db.query("DELETE FROM banners WHERE id=?", [req.params.id]);
  res.json({ message: "Banner deleted" });
};

/* ================= STATUS ================= */
export const updateBannerStatus = async (req, res) => {
  await db.query(
    "UPDATE banners SET status=? WHERE id=?",
    [req.body.status, req.params.id]
  );
  res.json({ message: "Status updated" });
};

export const updateBannerOrder = async (req, res) => {
  const orders = req.body; // [{id, order}]

  const conn = await db.getConnection();
  await conn.beginTransaction();

  for (let item of orders) {
    await conn.query(
      "UPDATE banners SET display_order=? WHERE id=?",
      [item.order, item.id]
    );
  }

  await conn.commit();
  conn.release();

  res.json({ message: "Order updated" });
};