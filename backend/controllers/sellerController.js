import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* ================= CREATE SELLER ================= */
export const createSeller = async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      password,
      gstNumber,
      pan,
      moq,
      deliveryCharge,
      pincodes = [],
    } = req.body;

    if (!businessName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    /* ---------- USERS ---------- */
    const [userResult] = await db.query(
      `INSERT INTO users
  (
    name,
    company_name,
    owner_name,
    email,
    phone,
    password_hash,
    role,
    approval_status,
    status,
    gst_number,
    pan
  )
  VALUES (?, ?, ?, ?, ?, ?, 'seller', 'pending', 'inactive', ?, ?)`,
      [
        ownerName, // name
        businessName,
        ownerName,
        email,
        phone,
        passwordHash,
        gstNumber || null,
        pan || null,
      ]
    );

    const userId = userResult.insertId;

    /* ---------- MOQ ---------- */
    await db.query(
      `INSERT INTO user_moq_rules (user_id, moq_amount, free_delivery)
       VALUES (?, ?, 0)`,
      [userId, moq || 0]
    );

    /* ---------- DELIVERY ---------- */
    await db.query(
      `INSERT INTO user_delivery_charges (user_id, charge_amount, charge_type)
       VALUES (?, ?, 'flat')`,
      [userId, deliveryCharge || 0]
    );

    /* ---------- PINCODES ---------- */
    for (const raw of pincodes) {
      const pincode = String(raw).trim();

      if (!pincode) continue;
      if (!/^\d{6}$/.test(pincode)) continue; // optional validation

      await db.query(
        `INSERT INTO seller_pincodes (user_id, pincode)
     VALUES (?, ?)`,
        [userId, pincode]
      );
    }

    res.status(201).json({ message: "Seller created (Approval Pending)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SELLERS ================= */
export const getSellers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
  u.id,
  u.company_name AS businessName,
  u.owner_name AS ownerName,
  u.email,
  u.phone,
  u.status,
  u.approval_status,
  u.created_at,
  u.gst_number AS gstNumber,
  u.pan,
  m.moq_amount AS moq,
  d.charge_amount AS deliveryCharge,
  GROUP_CONCAT(p.pincode) AS pincodes
FROM users u
LEFT JOIN user_moq_rules m ON u.id = m.user_id
LEFT JOIN user_delivery_charges d ON u.id = d.user_id
LEFT JOIN seller_pincodes p ON u.id = p.user_id
WHERE u.role = 'seller'
GROUP BY u.id
ORDER BY u.created_at DESC
    `);

    res.json(
      rows.map((r) => ({
        ...r,
        pincodes: r.pincodes ? r.pincodes.split(",") : [],
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateSellerActiveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  await db.query(
    `UPDATE users SET status = ? WHERE id = ? AND role = 'seller'`,
    [status, id]
  );

  res.json({ message: "Seller status updated" });
};

export const updateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      ownerName,
      phone,
      gstNumber,
      pan,
      moq,
      deliveryCharge,
      pincodes = [],
    } = req.body;

    /* -------- USERS -------- */
    await db.query(
      `UPDATE users
       SET company_name = ?, owner_name = ?, phone = ?, gst_number = ?, pan = ?
       WHERE id = ? AND role = 'seller'`,
      [businessName, ownerName, phone, gstNumber, pan, id]
    );

    /* -------- MOQ -------- */
    await db.query(
      `UPDATE user_moq_rules SET moq_amount = ? WHERE user_id = ?`,
      [moq || 0, id]
    );

    /* -------- DELIVERY -------- */
    await db.query(
      `UPDATE user_delivery_charges SET charge_amount = ? WHERE user_id = ?`,
      [deliveryCharge || 0, id]
    );

    /* -------- PINCODES -------- */
    await db.query(`DELETE FROM seller_pincodes WHERE user_id = ?`, [id]);

    for (const raw of pincodes) {
      const pincode = String(raw).trim();
      if (!pincode) continue;

      await db.query(
        `INSERT INTO seller_pincodes (user_id, pincode) VALUES (?, ?)`,
        [id, pincode]
      );
    }

    res.json({ message: "Seller updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSeller = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `UPDATE users SET status = 'deleted' WHERE id = ? AND role = 'seller'`,
    [id]
  );

  res.json({ message: "Seller deleted" });
};

export const approveSeller = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `UPDATE users 
     SET approval_status='approved', status='active'
     WHERE id=? AND role='seller'`,
    [id]
  );

  res.json({ message: "Seller approved" });
};
