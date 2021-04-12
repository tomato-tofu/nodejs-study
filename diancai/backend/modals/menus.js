const { Menus } = require("../utils/db");

const findOne = async (name) => {
  return Menus.findOne({ name });
};

const signup = (name) => {
  return Menus({
    name,
  }).save();
};

const getAll = () => {
  return Menus.find();
};

module.exports = {
  signup,
  findOne,
  getAll,
};
