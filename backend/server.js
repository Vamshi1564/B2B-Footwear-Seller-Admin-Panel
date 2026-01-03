import express from "express";
import cors from "cors";
import path from "path";
import bannerRoutes from "./routes/banner.routes.js";
import couponRoutes from "./routes/couponRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "backend/uploads"))
);

app.use("/api/banners", bannerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/sellers", sellerRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
