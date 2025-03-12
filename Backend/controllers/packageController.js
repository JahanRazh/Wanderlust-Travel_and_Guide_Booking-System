const Packages = require("../models/packageModel");

const getAllpackages = async (req, res, next) => {
    let package;
    try {
        package = await Packages.find();
    } catch (err) {
        console.log(err);
    }
    if (!package) {
        return res.status(404).json({ message: "No projects Found" });
    }
    return res.status(200).json({ package });

//display all projects

};

//data insert
const addpackages = async (req, res, next) => {
    const {packageName,
        timeDuration,
        hotelName,
        guideName,
        climateZone,
        pricePP,
        description } = req.body;
    let package;
    try {
        package = new Packages({
         
            
            packageName,
            timeDuration,
            hotelName,
            guideName,
            climateZone,
            pricePP,
            description

        });
        await package.save();
    } catch (err) {
        console.log(err);
    }
    //not insert projects
    if (!package) {
        return res.status(400).json({ message: "Unable to Add project" });
    }
    return res.status(202).json({ package });
};

//get by id

const getId = async (req, res, next) => {
   
const id = req.params.id;
let package;
try {
    package = await Packages.findById(id);

} catch (err) {
    console.log(err);
}
if (!package) {
    return res.status(404).json({ message: "No package Found" });
}
return res.status(200).json({ package });
};

//update db

const updatePackages = async (req, res, next) => {
    const id = req.params.id;
    const { packageName,timeDuration,hotelName,guideName,climateZone,pricePP,description } = req.body;
    let package;
    try {
        package = await Packages.findByIdAndUpdate(id, {

            packageName,
            timeDuration,
            hotelName,
            guideName,
            climateZone,
            pricePP,
            description
        });
        package = await package.save();
    } catch (err) {
        console.log(err);
    }
    if (!package) {
        return res.status(404).json({ message: "Unable to Update package" });
    }
    return res.status(200).json({ package });

};

//delete package

const deletePackages = async (req, res, next) => {
    const id = req.params.id;
    let package;
    try {
        package = await Packages.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!package) {
        return res.status(404).json({ message: "Unable to Delete package" });
    }
    return res.status(200).json({ package });

};
   



    
exports.getAllpackages = getAllpackages;
exports.addpackages = addpackages;
exports.getId = getId;
exports.updatePackages = updatePackages;
exports.deletePackages = deletePackages;
