import indexTpl from "../views/index.art";
import loginTpl from "../views/login.art";
import menuTpl from "../views/menu.art";
import dishesTpl from "../views/dishes.art";
import paginationTpl from "../views/pagination.art";

const pagesize = 10;
let dishedsData = [];
let currPage = 1;

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
        dishedsData.unshift(res.data);
        _list(1);
        _pagination(dishedsData);
      } else {
        alert(res.message);
      }
    },
  });
};

const _pagination = (data) => {
  const total = data.length;
  const pageCount = Math.ceil(total / pagesize);
  const pageArr = new Array(pageCount);

  $("#pagination").html(paginationTpl({ pageArr }));
  $("#pagination li:nth-child(" + (currPage + 1) + ")").addClass("active");

  $("#pagination li:not(:first-child,:last-child)").on("click", _select);

  $("#pagination li:first-child").on("click", _prev);

  $("#pagination li:last-child").on("click", _next);
};

const _loadData = () => {
  $.ajax({
    url: "/api/menu",
    method: "get",
    success: function (res) {
      dishedsData = res.data;
      _list(currPage);
      _pagination(dishedsData);
    },
  });
};

const _list = (pageNo) => {
  $("#list-content").html(
    dishesTpl({
      data: dishedsData.slice((pageNo - 1) * pagesize, pageNo * pagesize),
    })
  );
};

const _remove = function () {
  $.ajax({
    url: "/api/menu",
    method: "delete",
    data: { id: $(this).data("id") },
    success: function (res) {
      if (res.code === 0) {
        if ((dishedsData.length - 1) % pagesize === 0 && currPage > 1) {
          currPage--;
        }
        _loadData();
      } else {
        alert(res.message);
      }
    },
  });
};

const _prev = function () {
  if (currPage <= 1) {
    return;
  }

  currPage--;

  _pagination(dishedsData);
  _list(currPage);
};

const _next = function () {
  if (currPage >= Math.ceil(dishedsData.length / pagesize)) {
    return;
  }
  currPage++;
  _pagination(dishedsData);
  _list(currPage);
};

const _select = function () {
  $(this).addClass("active").siblings().removeClass("active");
  currPage = $(this).index();
  _list(currPage);
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

    $("#list-content").on("click", ".remove", _remove);

    _loadData();

    $("#signup-save").on("click", _signup);
  };
};

export { index, login };
