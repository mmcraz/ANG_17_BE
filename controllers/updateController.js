const mongoose = require("mongoose");
const User = require("../models/userModel");
const signUp = require('../models/signUp');

/* Node Js debugging 

1. Run node --inspect index.js
2. Chrome search bar type 'chrome://inspect'
3. Under "Remote Target," you should see your Node.js application listed. Click "Inspect" to open Chrome DevTools and start debugging.
*/

const updateData = async (req, res) => {
  const userId = req.params.userId;
 
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

 

    const clientPayload = req.body;

    clientPayload.forEach((clientEvent) => {
      const existingEvent = user.userEvents.find(
        (existingEvent) => existingEvent.date === clientEvent.date
      );

      if (existingEvent) {
        Object.keys(clientEvent).forEach((screenKey) => {
          if (screenKey !== "date") {
            if (!existingEvent.screens) {
              existingEvent.screens = {};
            }

            if (!existingEvent.screens[screenKey]) {
              existingEvent.screens[screenKey] = {};
            }

            Object.entries(clientEvent[screenKey]).forEach(([key, value]) => {
              if (existingEvent.screens[screenKey][key]) {
                existingEvent.screens[screenKey][key] += value;
              } else {
                existingEvent.screens[screenKey][key] = value;
              }
            });
          }
        });
      } else {
        const newUserEvent = {
          date: clientEvent.date,
          screens: {},
        };

        Object.keys(clientEvent).forEach((screenKey) => {
          if (screenKey !== "date") {
            newUserEvent.screens[screenKey] = { ...clientEvent[screenKey] };
          }
        });

        user.userEvents.push(newUserEvent);
      }
    });
    user.userEvents.forEach((userEvent) => {
      let totalCount = 0;
      if (userEvent.screens) {
        Object.keys(userEvent.screens).forEach((screenKey) => {
          Object.values(userEvent.screens[screenKey]).forEach((value) => {
            totalCount += value;
          });
        });
      }
      userEvent.totalCount = totalCount;
    });
    user.markModified("userEvents");

    try {
      await user.save();
    } catch (error) {
      console.error("Error saving user:", error);
    }

    res.json({ message: "User events updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const user = async (req, res) => {
  const userId = req.body.userName;
  const userPassword = req.body.password;


  try {
    const users = await signUp.find({ "email": userId });

    if (users.length === 0) {
      return res.status(401).json({ message: 'User does not exist.' });
    }

    if (users[0].password !== userPassword) {
      return res.status(404).json({ message: "Wrong passcode" });
    }

    res.json(users)
  } catch (error) {
    console.error('Error creating config:', error);
    res.status(500).json({ message: 'User does not exist.' });
  }
};

const getUsersData = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    console.error("Error retrieving data from MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = { updateData, user, getUsersData };
