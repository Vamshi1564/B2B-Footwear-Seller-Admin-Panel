import express from "express";
import {
  createSeller,
  getSellers,
  updateSeller,
  deleteSeller,
  updateSellerActiveStatus,
  approveSeller,
} from "../controllers/sellerController.js";

const router = express.Router();

router.post("/", createSeller);
router.get("/", getSellers);
router.put("/:id", updateSeller);
router.delete("/:id", deleteSeller);


/* ✅ STATUS TOGGLE (THIS WAS MISSING) */
router.put("/:id/status", (req, res, next) => {
  console.log("STATUS ROUTE HIT");
  next();
}, updateSellerActiveStatus);

/* ✅ APPROVAL */
router.put("/:id/approve", approveSeller);


export default router;
