import { Router } from "express";
import noteRoutes from "./noteRoutes";

const router = Router();

router.use("/notes", noteRoutes);

export default router;
