const menusModal = require("../modals/menus");
const item = async (req, res, next) => {
  res.set("content-type", "application/json;charset=utf-8");

  const { name } = req.body;
  const findFlag = await menusModal.findOne(name);

  if (findFlag) {
    res.render("fail", {
      record: JSON.stringify("菜名已存在"),
    });
  } else {
    // 写入数据库
    const result = await menusModal.signup(name);

    // 返回用户信息
    res.render("succ", {
      data: JSON.stringify({ name }),
    });
  }
};

const list = async (req, res, next) => {
  res.set("content-type", "application/json;charset=utf-8");

  const list = await menusModal.getAll();
  res.render("succ", {
    data: JSON.stringify(list),
  });
};

const dishesRemove = async (req, res, next) => {
  res.set("content-type", "application/json;charset=utf-8");
  const { id } = req.body;
  const result = await menusModal.remove(id);
  console.log(result);
  if (result) {
    res.render("succ", {
      data: JSON.stringify("删除成功!"),
    });
  } else {
    res.render("fail", {
      data: JSON.stringify("删除失败!"),
    });
  }
};

module.exports = { item, list, dishesRemove };
