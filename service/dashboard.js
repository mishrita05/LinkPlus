const url = require("../models/url");
const mongoose = require("mongoose");

async function fetchDashboardStats(userId)  {
    const stats = await url.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                totalUrls: {
                    $sum: 1,
                },
                activeUrls: {
                    $sum: {
                        $cond: [
                            {
                                $or: [
                                    {
                                        $eq: [
                                            "$expiresAt",
                                            null,
                                        ],
                                    },
                                    {
                                        $gt: [
                                            "$expiresAt",
                                            new Date(),
                                        ],
                                    },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
                expiredUrls: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    {
                                        $ne: [
                                            "$expiresAt",
                                            null
                                        ]
                                    },
                                    {
                                        $lt: [
                                            "$expiresAt",
                                            new Date()
                                        ]
                                    }
                                ]
                            },
                            1,
                            0
                        ],
                    },
                },
                healthyLinks: {
                    $sum: {
                        $cond:[
                            {
                                $eq:[
                                    "$healthStatus",
                                    "Healthy",
                                ],
                            },
                            1,
                            0
                        ]
                    },
                },
                brokenLinks: {
                    $sum: {
                        $cond:[
                            {
                                $eq:[
                                    "$healthStatus",
                                    "Broken",
                                ],
                            },
                            1,
                            0
                        ]
                    },
                },
                totalClicks: {
                    $sum: {
                        $size: "$visitHistory"
                    }
                },
            },
        },
    ]);
    return stats;
}

module.exports = {
    fetchDashboardStats,
};