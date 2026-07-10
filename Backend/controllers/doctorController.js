const Doctor = require('../models/Doctor');
const { getDoctorsDirectory } = require('../services/doctorAiService');

/**
 * Haversine formula to calculate distance between two points
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Get nearby doctors within specified radius from user's location
 * Uses MongoDB 2dsphere index for efficient geospatial queries
 * 
 * Query params:
 * - lat: user's latitude (required)
 * - lng: user's longitude (required)
 * - radius: search radius in km (default: 50)
 * - specialization: filter by specialization (optional)
 * - maxFee: maximum consultation fee (optional)
 */
exports.fetchNearbyDoctors = async (req, res) => {
    try {
        const savedDoctors = await Doctor.find({ userId: req.user.id }).select('-__v').lean();

        if (savedDoctors.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: savedDoctors.length,
            data: savedDoctors
        });
    } catch (error) {
        console.error('Error in fetchNearbyDoctors:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching doctors'
        });
    }
};

exports.refreshNearbyDoctors = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        console.log('Refreshing doctors for location:', userLat, userLng);

        if (isNaN(userLat) || isNaN(userLng) || userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude'
            });
        }

        const generatedDoctors = await getDoctorsDirectory(userLat, userLng);
        const rawDoctorList = Array.isArray(generatedDoctors?.data)
            ? generatedDoctors.data
            : Array.isArray(generatedDoctors)
                ? generatedDoctors
                : [];

        const doctorList = rawDoctorList.map((doc) => ({
            ...doc,
            userId: req.user.id,
        }));

        await Doctor.deleteMany({ userId: req.user.id });

        if (doctorList.length > 0) {
            await Doctor.insertMany(doctorList);
        }

        return res.status(200).json({
            success: true,
            count: doctorList.length,
            summary: generatedDoctors?.summary || 'Doctors refreshed successfully.',
            data: doctorList
        });
    } catch (error) {
        console.error('Error in refreshNearbyDoctors:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error refreshing doctors'
        });
    }
};

