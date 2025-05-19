const GuideApplication = require('../../models/Guide/newGuide');
const Guide = require('../../models/Guide/Guide.model');
const fs = require('fs');
const path = require('path');

// Apply as a guide
exports.applyAsGuide = async (req, res) => {
    try {
        const {
            fullname,
            age,
            dateOfBirth,
            gender,
            contactNumber,
            email,
            address,
            about,
            workExperience
        } = req.body;

        // Check if email already exists
        const existingGuide = await GuideApplication.findOne({ email });
        if (existingGuide) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Handle file uploads
        const profilePicPath = req.files['profilePic'] ? `/uploads/guides/${req.files['profilePic'][0].filename}` : null;
        const certificatePath = req.files['certificate'] ? `/uploads/guides/${req.files['certificate'][0].filename}` : null;

        // Create new guide application
        const guideApplication = new GuideApplication({
            fullname,
            age,
            dateOfBirth,
            gender,
            contactNumber,
            email,
            address,
            about,
            workExperience,
            profilePic: profilePicPath,
            certificate: certificatePath,
            isApproved: false
        });

        await guideApplication.save();

        res.status(201).json({
            message: 'Guide application submitted successfully',
            guide: guideApplication
        });
    } catch (error) {
        console.error('Error in applyAsGuide:', error);
        res.status(500).json({ message: 'Error submitting guide application', error: error.message });
    }
};

// Get all guide applications
exports.getAllApplications = async (req, res) => {
    try {
        console.log('=== Guide Applications API Call ===');
        console.log('Fetching all guide applications...');
        
        // Log the database query
        const applications = await GuideApplication.find().sort({ createdAt: -1 });
        console.log('Database query result:', applications);
        console.log('Number of applications found:', applications.length);
        
        // Log the response being sent
        console.log('Sending response to client...');
        res.status(200).json(applications);
        console.log('Response sent successfully');
    } catch (error) {
        console.error('Error in getAllApplications:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Error fetching applications', 
            error: error.message 
        });
    }
};

// Get single guide application
exports.getApplicationById = async (req, res) => {
    try {
        const application = await GuideApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching application', error: error.message });
    }
};

// Approve guide application
exports.approveApplication = async (req, res) => {
    try {
        const application = await GuideApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if guide already exists with this email
        const existingGuide = await Guide.findOne({ email: application.email });
        if (existingGuide) {
            return res.status(400).json({ message: 'A guide with this email already exists' });
        }

        // Create new guide from application
        const newGuide = new Guide({
            fullname: application.fullname,
            age: application.age,
            dateOfBirth: application.dateOfBirth,
            gender: application.gender,
            contactNumber: application.contactNumber,
            email: application.email,
            address: application.address,
            about: application.about,
            workExperience: application.workExperience,
            profilePic: application.profilePic
        });

        await newGuide.save();

        // Update application status
        application.isApproved = true;
        await application.save();

        res.status(200).json({ 
            message: 'Application approved and guide created successfully', 
            guide: newGuide 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error approving application', error: error.message });
    }
};

// Reject guide application
exports.rejectApplication = async (req, res) => {
    try {
        const application = await GuideApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Delete uploaded files
        if (application.profilePic) {
            const profilePicPath = path.join(__dirname, '../../', application.profilePic);
            fs.unlink(profilePicPath, (err) => {
                if (err) console.error('Error deleting profile picture:', err);
            });
        }

        if (application.certificate) {
            const certificatePath = path.join(__dirname, '../../', application.certificate);
            fs.unlink(certificatePath, (err) => {
                if (err) console.error('Error deleting certificate:', err);
            });
        }

        // Delete the application
        await GuideApplication.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Application rejected and deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting application', error: error.message });
    }
};
