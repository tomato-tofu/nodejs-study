import Pagination from "./pagination";

export default class Table {
  pagenumber: number;
  pagesize: number;
  tpl: any;
  content: JQuery<HTMLElement>;
  pagination: Pagination;
  data: any[];
  removeItem: TableRemoveItem;
  constructor(options: TableOptions) {
    this.pagenumber = options.pagenumber || 1;
    this.pagesize = options.pagesize || 10;
    this.tpl = options.tpl;
    this.removeItem = options.removeItem;
    this.content = options.content.find("#list-content");

    this.content.on("click", ".remove", this.remove());

    this.pagination = new Pagination(options.content, this.pagesize);
    this.pagination.on("change", this.render.bind(this));
  }

  refresh(data) {
    this.data = data;
    this.pagination.total = this.data.length;
  }
  render(pageNo = 1) {
    this.content.html(
      this.tpl({
        data: this.data.slice(
          (pageNo - 1) * this.pagesize,
          pageNo * this.pagesize
        ),
      })
    );
  }
  add() {}

  remove() {
    const that = this;
    const { api, paramsFeild } = this.removeItem;
    return function () {
      $.ajax({
        url: `${api}`,
        method: "delete",
        data: Object.assign(
          that.parseArrFeild2Obj.apply(this, [paramsFeild]),
          {}
        ),
        success: (res) => {
          if (res.code === 0) {
            if (
              (that.data.length - 1) % that.pagination.pagesize === 0 &&
              that.pagination.currPage > 1
            ) {
              that.pagination.currPage--;
            }
            that.removeItem.success && that.removeItem.success();
          } else {
            alert(res.message);
          }
        },
      });
    };
  }
  edit() {}

  private parseArrFeild2Obj(params): Object {
    let obj = {};
    for (let i = 0; i < params.length; i++) {
      obj[`${params[i]}`] = $(this).data(`${params[i]}`);
    }
    return obj;
  }
}
