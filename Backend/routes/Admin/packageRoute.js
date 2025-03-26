const express = require("express");
const { 
    addPackage, 
    getPackages, 
    getPackageById, 
    updatePackage, 
    deletePackage 
} = require("../../controllers/Admin/packageController");
const Package = require("../../models/Admin/packageModel"); // Make sure to import the Package model

const router = express.Router();

// Count route placed first
router.get("/packages/count", async (req, res) => {
    try {
        const count = await Package.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/packages", addPackage);
router.get("/packages", getPackages);
router.get("/packages/:id", getPackageById);
router.put("/packages/:id", updatePackage);
router.delete("/packages/:id", deletePackage);

module.exports = router;