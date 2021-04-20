interface TableRemoveItem {
  api: String;
  paramsFeild: String[];
  success?: Function;
}

interface TableOptions {
  content: JQuery;
  tpl: Function;
  pagenumber?: number;
  pagesize?: number;
  removeItem?: TableRemoveItem;
}
