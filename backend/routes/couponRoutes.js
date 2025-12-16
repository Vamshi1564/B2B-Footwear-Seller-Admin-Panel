import express from "express";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.get("/", getCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
