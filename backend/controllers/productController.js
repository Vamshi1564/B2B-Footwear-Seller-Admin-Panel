import db from "../config/db.js";

export const addProduct = async (req, res) => {
  console.log("🔥 ADD PRODUCT CONTROLLER HIT");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      name,
      description,
      mrp,
      wholesale_price,
      category_id,
      stock,
    } = req.body;

    const seller_id = req.user.id;

    const [productResult] = await db.query(
      `INSERT INTO products 
      (seller_id, name, description, mrp, wholesale_price, category_id, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        seller_id,
        name,
        description,
        Number(mrp),
        Number(wholesale_price),
        Number(category_id),
        Number(stock),
      ]
    );

    const productId = productResult.insertId;

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await db.query(
          `INSERT INTO product_images (product_id, image_url, is_primary)
           VALUES (?, ?, ?)`,
          [productId, req.files[i].filename, i === 0 ? 1 : 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
