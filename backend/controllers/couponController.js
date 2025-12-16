import db from "../config/db.js";

/* ================= CREATE ================= */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      status,
    } = req.body;

    const sql = `
      INSERT INTO coupons
      (code, discount_type, discount_value, min_order_value, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      code,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      status,
    ]);

    res.json({
      message: "Coupon created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= READ ================= */
export const getCoupons = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM coupons ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET COUPONS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE ================= */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      code,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      status,
    } = req.body;

    const sql = `
      UPDATE coupons SET
      code=?, discount_type=?, discount_value=?,
      min_order_value=?, start_date=?, end_date=?, status=?
      WHERE id=?
    `;

    await db.query(sql, [
      code,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      status,
      id,
    ]);

    res.json({ message: "Coupon updated successfully" });
  } catch (error) {
    console.error("UPDATE COUPON ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM coupons WHERE id=?", [id]);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("DELETE COUPON ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
