import indexTpl from "../views/index.art";

import menuTpl from "../views/menu.art";
import dishesTpl from "../views/dishes.art";
import paginationTpl from "../views/pagination.art";

const pagesize = 10;
let dishedsData = [];
let currPage = 1;

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
        _pagination(dishedsData.length);
      } else {
        alert(res.message);
      }
    },
  });
};

const _pagination = (total) => {
  const pageCount = Math.ceil(total / pagesize);
  const pageArr = new Array(pageCount);

  $("#pagination").html(paginationTpl({ pageArr }));
  $("#pagination li:nth-child(" + (currPage + 1) + ")").addClass("active");
};

const _loadData = () => {
  $.ajax({
    url: "/api/menu",
    method: "get",
    success: function (res) {
      dishedsData = res.data;
      _list(currPage);
      _pagination(dishedsData.length);
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

  _pagination(dishedsData.length);
  _list(currPage);
};

const _next = function () {
  if (currPage >= Math.ceil(dishedsData.length / pagesize)) {
    return;
  }
  currPage++;
  _pagination(dishedsData.length);
  _list(currPage);
};

const _select = function () {
  $(this).addClass("active").siblings().removeClass("active");
  currPage = $(this).index();
  _list(currPage);
};

const index = (router) => {
  return (req, res, next) => {
    res.render(indexTpl({}));

    $("#content").html(menuTpl({}));

    $("#list-content").on("click", ".remove", _remove);

    $("#pagination").on("click", "li:not(:first-child,:last-child)", _select);

    $("#pagination").on("click", " li:first-child", _prev);

    $("#pagination").on("click", " li:last-child", _next);

    _loadData();

    $("#signup-save").on("click", _signup);
  };
};

export default index;
