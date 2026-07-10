
require('dotenv').config();
const {GoogleGenAI} = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const lat = 23.401750, long = 88.461251;
const getDoctorsDirectory = async (lat = 23.401750, long = 88.461251) => {
    const interaction = await ai.interactions.create({
        model: "gemini-2.5-flash",
        input: `My latitude and longitude are ${lat} and ${long}. Give me a json file of 5 nearby doctors which will follow this json format
  {
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        enum: ['psychiatrist', 'psychologist', 'counselor', 'therapist'],
        required: true
    },

    // Professional Details
    qualifications: {
        type: [String],
        default: []
    },
    experience: {
        type: Number, // years
        default: 0
    },
    bio: {
        type: String
    },
    languages: {
        type: [String],
        default: ['English', 'Hindi']
    },

    // Location Details
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: String,
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
                validate: {
                    validator: function (v) {
                        return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
                    },
                    message: 'Invalid coordinates. Must be [longitude, latitude]'
                }
            }
        }
    },

    // Hospital/Clinic Details
    hospital: {
        name: String,
        phone: String
    },

    // Consultation Details
    fees: {
        consultationFee: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },

    // Availability
    availability: {
        isAvailable: {
            type: Boolean,
            default: true
        },
        hours: {
            monday: String,
            tuesday: String,
            wednesday: String,
            thursday: String,
            friday: String,
            saturday: String,
            sunday: String
        }
    },

    // Ratings & Reviews (for future use)
    ratings: {
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },

    // Meta Information
    dataSource: {
        type: String,
        enum: ['manual', 'google_maps', 'llm_enriched', 'api'],
        default: 'manual'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}. Give only the json format as output and nothing else`
    });
    console.log(interaction.output_text);
}
getDoctorsDirectory(lat, long).catch(console.error);
