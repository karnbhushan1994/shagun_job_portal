import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getCompany, postCompany, updateCompanyById  ,getCompanyById,deleteCompany } from "../controllers/companyController.js";

const router = express.Router();

router.get("/getCompany", isAuthenticated, getCompany);
router.post("/post", isAuthenticated, postCompany);
router.put("/company/:id", isAuthenticated, updateCompanyById);
router.get("/getCompany/:id", isAuthenticated, getCompanyById);
router.delete("/:id", isAuthenticated, deleteCompany);

export default router;