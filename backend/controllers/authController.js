import db from "../config/db.js";

// ✅ Register a new retailer
export const registerRetailer = async (req, res) => {
  try {
    const {
      phone,
      company_name,
      owner_name,
      gst_number,
      address_line1,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    const gstCertificate = req.files?.gstCertificate?.[0]?.path || null;
    const shopPhoto = req.files?.shopPhoto?.[0]?.path || null;

    // Check if user already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE phone=?",
      [phone]
    );

    if (existing.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Insert user into database
    const [result] = await db.query(
      `INSERT INTO users
       (phone, role, approval_status, company_name, owner_name, gst_number,
        address_line1, city, state, pincode, latitude, longitude,
        gst_certificate, shop_photo)
       VALUES (?, 'retailer', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        phone,
        company_name,
        owner_name,
        gst_number || null,
        address_line1,
        city,
        state,
        pincode,
        latitude,
        longitude,
        gstCertificate,
        shopPhoto,
      ]
    );

    // Return full user info
    res.json({
      id: result.insertId,
      storeName: company_name,     // map to frontend
      name: owner_name,            // map to frontend
      phone,
      verificationStatus: "pending",
      message: "Retailer registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ Fetch user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    res.json({
      id: user.id,
      storeName: user.company_name,
      name: user.owner_name,
      phone: user.phone,
      verificationStatus: user.approval_status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
