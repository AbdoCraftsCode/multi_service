

import mongoose from "mongoose";

const hatapSchema = new mongoose.Schema(
    {
        name1: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true }
        },
        name2: {
            en: { type: String,  trim: true },
            ar: { type: String,  trim: true }
        },
     

        country: {
            en: { type: String,  trim: true },
            ar: { type: String,  trim: true }
        },
        // animalTypes: [{
        //     ar: { type: String, trim: true,  },
        //     en: { type: String, trim: true,  }
        // }],


        stoargecondition: {
            en: { type: String, },
            ar: { type: String, }


        },

 
        tableData: [{
            name: {
                en: { type: String,  trim: true },
                ar: { type: String,  trim: true }
            },
            value: {
                en: { type: String, required: true, trim: true },
                ar: { type: String, required: true, trim: true }
            }
        }],
    
        order: {
            type: Number,
            default: 0
        },

      
        newprice: { type: String, },
        oldprice: { type: String,  },
        description: {
            en: { type: String,  },
            ar: { type: String,  }
        },
        quantity: {
            en: { type: String,  trim: true },
            ar: { type: String, trim: true }
        },
        image:[{
            secure_url: { type: String },
            public_id: { type: String },
        }],
        logo: [{
            secure_url: { type: String },
            public_id: { type: String },
        }],
        // category: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Category",
      
        // },
      
        
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }


    },
    { timestamps: true }
);

export const HatapModel = mongoose.model("Hatap", hatapSchema);




