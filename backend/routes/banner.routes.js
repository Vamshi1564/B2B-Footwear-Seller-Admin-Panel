import express from "express";
import {
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
  updateBannerOrder,
} from "../controllers/banner.controller.js";

import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/* ================= ROUTES ================= */

router.get("/", getBanners);

router.post(
  "/",
  auth(["admin", "seller"]),
  upload.single("image"),
  addBanner
);

router.put(
  "/:id",
  auth(["admin", "seller"]),
  upload.single("image"),
  updateBanner
);

router.put(
  "/:id/status",
  auth(["admin", "seller"]),
  updateBannerStatus
);

router.put(
  "/reorder/save",
  auth(["admin"]),
  updateBannerOrder
);

router.delete(
  "/:id",
  auth(["admin"]),
  deleteBanner
);

export default router;
