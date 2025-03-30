const Package = require("../../models/Admin/packageModel");
const fs = require('fs');
const path = require('path');

exports.addPackage = async (req, res) => {
  try {
    // Create a new package object from request body
    const packageData = new Package({
      ...req.body,
      images: req.files ? req.files.map(file => `/uploads/packages/${file.filename}`) : []
    });
    
    const savedPackage = await packageData.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    // Remove uploaded files if there was an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(400).json({ error: error.message });
  }
};

// Get all packages (unchanged)
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single package by ID (unchanged)
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a package with images
exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) return res.status(404).json({ message: "Package not found" });
    
    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Add new images
      const newImages = req.files.map(file => `/uploads/packages/${file.filename}`);
      
      // If keepExistingImages flag is set, combine with existing images
      if (req.body.keepExistingImages === 'true' && package.images) {
        updateData.images = [...package.images, ...newImages];
      } else {
        // Delete old images if they're being replaced
        if (package.images && package.images.length > 0) {
          package.images.forEach(imagePath => {
            const fullPath = path.join(__dirname, '../..', imagePath);
            fs.unlink(fullPath, err => {
              if (err && !err.code === 'ENOENT') console.error('Error deleting old image:', err);
            });
          });
        }
        updateData.images = newImages;
      }
    }
    
    // Handle image removal if specified
    if (req.body.removeImages && Array.isArray(JSON.parse(req.body.removeImages))) {
      const imagesToRemove = JSON.parse(req.body.removeImages);
      
      // Delete specified images
      imagesToRemove.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../..', imagePath);
        fs.unlink(fullPath, err => {
          if (err && !err.code === 'ENOENT') console.error('Error deleting image:', err);
        });
      });
      
      // Update images array
      if (updateData.images) {
        updateData.images = updateData.images.filter(img => !imagesToRemove.includes(img));
      } else if (package.images) {
        updateData.images = package.images.filter(img => !imagesToRemove.includes(img));
      }
    }
    
    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedPackage);
  } catch (error) {
    // Remove newly uploaded files if there was an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a package with image cleanup
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) return res.status(404).json({ message: "Package not found" });
    
    // Delete associated images
    if (package.images && package.images.length > 0) {
      package.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../..', imagePath);
        fs.unlink(fullPath, err => {
          if (err && !err.code === 'ENOENT') console.error('Error deleting image:', err);
        });
      });
    }
    
    await Package.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};