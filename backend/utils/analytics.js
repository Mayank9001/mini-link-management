const mongoose = require("mongoose");
const VisitLog = require("../models/visitLogs.model");
const Link = require("../models/link.model");

const getUserClickAnalytics = async (userId) => {
  try {
    const shortLinks = await Link.find({ userId: userId });
    // console.log("sl", shortLinks);
    const shortLinkValues = shortLinks.map((link) => link.shortLink);
    // console.log("slv", shortLinkValues);

    // Device Type Clicks
    const deviceTypeClicks = await VisitLog.aggregate([
      { $match: { shortLink: { $in: shortLinkValues } } },
      { $group: { _id: "$deviceType", clicks: { $sum: 1 } } },
    ]);

    // Date-Wise Clicks
    const dateWiseClicks = await VisitLog.aggregate([
      { $match: { shortLink: { $in: shortLinkValues } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$timestamp" },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);
    return { deviceTypeClicks, dateWiseClicks };
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw error;
  }
};

module.exports = { getUserClickAnalytics };
