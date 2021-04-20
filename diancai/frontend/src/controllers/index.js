import indexTpl from "../views/index.art";

import Tabel from "../components/table";
import menuTpl from "../views/menu.art";
import dishesTpl from "../views/dishes.art";

let table;
const _signup = () => {
  const formdata = $("#signup-form").serialize();
  $.ajax({
    url: "/api/menu",
    method: "post",
    data: formdata,
    success: function (res) {
      if (res.code === 0) {
        $("#signup-close").click();
        _loadData();
      } else {
        alert(res.message);
      }
    },
  });
};

const _loadData = () => {
  $.ajax({
    url: "/api/menu",
    method: "get",
    success: function (res) {
      table.refresh(res.data);
    },
  });
};

const index = (router) => {
  return (req, res, next) => {
    res.render(indexTpl({}));

    $("#content").html(menuTpl({}));

    $("#signup-save").on("click", _signup);

    table = new Tabel({
      content: $("#menu"),
      tpl: dishesTpl,
      pagesize: 3,
      removeItem: {
        api: "/api/menu",
        paramsFeild: ["id"],
        success: _loadData.bind(this),
      },
    });

    _loadData();
  };
};

export default index;
