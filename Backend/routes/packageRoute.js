const express = require("express");
const router = express.Router();
//insert model
const package = require("../models/packageModel");
//insert user controller
const packageController = require("../controllers/packageController");

  

router.get("/",packageController.getAllpackages);
router.post("/",packageController.addpackages);
router.get("/:id",packageController.getId);
router.put("/:id",packageController.updatePackages);
router.delete("/:id",packageController.deletePackages);


module.exports = router;
