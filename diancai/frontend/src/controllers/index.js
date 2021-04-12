import indexTpl from "../views/index.art";
import loginTpl from "../views/login.art";
import menuTpl from "../views/menu.art";
import dishesTpl from "../views/dishes.art";
import pagenationTpl from "../views/pagenation.art";

const _handleSubmit = (router) => {
  return (event) => {
    event.preventDefault();
    router.go("/index");
  };
};

const _signup = () => {
  const formdata = $("#signup-form").serialize();
  $.ajax({
    url: "/api/menu",
    method: "post",
    data: formdata,
    success: function (res) {
      if (res.code === 0) {
        $("#signup-close").click();
      } else {
        alert(res.message);
      }
    },
  });
};

const _list = () => {
  $.ajax({
    url: "/api/menu",
    method: "get",
    success: function (res) {
      $("#list-content").html(dishesTpl({ data: res.data }));
      $("#pagenation").html(pagenationTpl({ total: res.data.length }));
    },
  });
};

const login = (router) => {
  return (req, res, next) => {
    res.render(loginTpl({}));
    $("#login").on("click", _handleSubmit(router));
  };
};

const index = (router) => {
  return (req, res, next) => {
    res.render(indexTpl({}));

    $("#content").html(menuTpl({}));

    _list();

    $("#signup-save").on("click", _signup);
  };
};

export { index, login };
