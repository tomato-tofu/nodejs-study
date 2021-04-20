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
  return Menus.find().sort({ _id: -1 });
};

const remove = (id) => {
  return Menus.findByIdAndRemove(id);
};

module.exports = {
  signup,
  findOne,
  getAll,
  remove,
};
