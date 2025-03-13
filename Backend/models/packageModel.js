const mongoose = require("mongoose");
const SchemaPackage = mongoose.Schema;

const packageSchema = new SchemaPackage({
    
   
    packageName: {
        type: String,
        required: true,
    },
    timeDuration: {
        type: String,
        required: true,
        trim:true,
        maxLength:50
    },
    
    hotelName: {
        type: String,
        required: true,
        trim:true,
        maxLength:50
    },
    guideName: {
        type: String,
        required: true,
        trim:true,
        maxLength:50
    },
 
    climateZone: {
        type: String,
        required: true,
        trim:true,
        maxLength:50
    },
    
    pricePP: {
        type: Number,
        required: true,
        trim:true,
        maxLength:50
    },
    description : {
        type: String,
        required: true,
        trim:true,
        
    },
});

module.exports = mongoose.model(
"packageModel", //file name
packageSchema //function name
)