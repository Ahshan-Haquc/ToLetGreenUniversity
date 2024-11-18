const PostShareModel = require("../models/postShareSchema");

const availableSeatFetch = async (req, res, next) => {
  console.log("working available seat fetch middleware.");
  try {
    //all post share collection fetch korlam
    const postInfo = await PostShareModel.find({});

    //total koto gula seat available post ase ta getch korlm
    const totalSeatAvailable = await PostShareModel.find({available:'yes'});

    req.totalSeatAvailable = totalSeatAvailable;
    req.totalSeatAvailableLength = totalSeatAvailable.length;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = availableSeatFetch;

