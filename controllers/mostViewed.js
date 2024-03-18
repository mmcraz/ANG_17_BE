const User = require("../models/userModel");

const screenCount = async (req, res) => {
  const users = await User.find();
  async function processAndStoreData(dataArray) {
    for (const item of dataArray) {
      const processedData = {
        userId: item._id,
        screens: {},
      };

      item.userEvents.forEach((event) => {
        Object.entries(event.screens).forEach(([screen, counts]) => {
          Object.entries(counts).forEach(([btn, count]) => {
            processedData.screens[screen] =
              (processedData.screens[screen] || 0) + count;
          });
        });
      });

      console.log("Processed Data:", processedData);
      await storeDataInDatabase(processedData);
    }
  }

  async function storeDataInDatabase(processedData) {
    console.log(
      `Storing data in the database for userId: ${processedData.userId}`
    );
  }
  processAndStoreData(users);
};

const mostViewedPage = async (req, res) => {
  try {
    const client = req.params.clientName;
    const users = await User.find({ "userInfo.clientName": client });
    if (users.length === 0) {
      return res.json({
        message: `No data found for the client name: ${client}.`,
      });
    }
    const getMostClickedScreen = (data) => {
      const screenCounts = {};
      data.forEach((item) => {
        if (item.userEvents) {
          item.userEvents.forEach((event) => {
            if (event.screens) {
              Object.entries(event.screens).forEach(([screen, counts]) => {
                if (!screenCounts[screen]) {
                  screenCounts[screen] = 0;
                }
                Object.values(counts).forEach((count) => {
                  screenCounts[screen] += count;
                });
              });
            }
          });
        }
      });
      const sortedScreens = Object.keys(screenCounts).sort(
        (a, b) => screenCounts[b] - screenCounts[a]
      );

      return {
        mostViewedPages: sortedScreens.map((screen) => ({
          pageName: screen,
          count: screenCounts[screen],
        })),
      };
    };

    const result = getMostClickedScreen(users);
    res.json(result.mostViewedPages);
  } catch (error) {
    console.error("Error processing most viewed page data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { screenCount, mostViewedPage };
