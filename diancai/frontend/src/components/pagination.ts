const paginationTpl = require("../views/pagination.art");
import DispatchingCenter from "../utils/events";
export default class Pagination {
  content: JQuery<HTMLElement>;
  pagesize: number;
  private _currPage: number = 1;
  private _total: number = 0;
  private dispath = new DispatchingCenter();

  constructor(content: JQuery, pagesize: number) {
    this.content = content.find("#pagination");
    this.pagesize = pagesize;
    this.content.on(
      "click",
      "li:not(:first-child,:last-child)",
      this._select()
    );

    this.content.on("click", "li:first-child", this._prev.bind(this));

    this.content.on("click", "li:last-child", this._next.bind(this));

    this.dispath.install("change");
  }

  set total(num: number) {
    this._total = num;

    const pageCount = Math.ceil(this._total / this.pagesize);
    const pageArr = new Array(pageCount);

    this.content.html(paginationTpl({ pageArr }));

    this.content.find(`li:nth-child(${this.currPage + 1})`).addClass("active");
    this.trigger("change", this.currPage);
  }

  set currPage(num: number) {
    this._currPage = num;

    this.content
      .find(`li:nth-child(${this.currPage + 1})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    this.trigger("change", num);
  }

  get currPage() {
    return this._currPage;
  }

  private _prev() {
    if (this.currPage <= 1) {
      return;
    }
    this.currPage--;
  }

  private _next() {
    if (this.currPage >= Math.ceil(this._total / this.pagesize)) {
      return;
    }
    this.currPage++;
  }

  private _select() {
    const that = this;
    return function (event) {
      that.currPage = $(this).index();
    };
  }

  private trigger(name, ...args) {
    this.dispath.handle(name, args);
  }

  on(name, callback) {
    this.dispath.add(name, callback);
  }
}
