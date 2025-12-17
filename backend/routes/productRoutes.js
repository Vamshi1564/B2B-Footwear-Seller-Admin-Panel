import express from "express";
import { addProduct } from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/add",
  auth,
  upload.array("images", 5),
  addProduct
);


// router.post("/add", addProduct);


export default router;
