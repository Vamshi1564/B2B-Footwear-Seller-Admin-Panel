import express from "express";
import { registerRetailer } from "../controllers/authController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/register-retailer",
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "shopPhoto", maxCount: 1 },
  ]),
  registerRetailer
);

router.get("/user/:id", getUserById);

export default router;
