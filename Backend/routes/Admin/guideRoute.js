const express = require("express");
const { addPackage, getPackages, getPackageById, updatePackage, deletePackage } = require("../../controllers/Admin/packageController");

const router = express.Router();

router.post("/packages", addPackage);
router.get("/packages", getPackages);
router.get("/packages/:id", getPackageById);
router.put("/packages/:id", updatePackage);
router.delete("/packages/:id", deletePackage);

module.exports = router;
