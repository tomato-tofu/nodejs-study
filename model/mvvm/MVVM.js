class Compile {
  constructor(el, vm) {
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    this.vm = vm;
    const fragment = this.node2fragment(this.$el);
    this.compile(fragment);
  }
  node2fragment(node) {
    let fragment = document.createDocumentFragment();
    const childs = node.childNodes;

    [...childs].forEach((node) => {
      fragment.appendChild(node);
    });
    return fragment;
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    [...childNodes].forEach((node) => {
      // 如果是元素节点,则解析指令
      if (this.isElementNode(node)) {
        console.log(node);
      }

      // // 如果是文本节点,则解析差值表达式
      // if (this.isTextNode(node)) {
      //   this.compileTextNode(node);
      // }

      // // 递归解析
      // if (node.childNodes && node.childNodes.length > 0) {
      //   this.compile(node);
      // }
    });
  }
  isElementNode(node) {
    console.log(node.attributes);
    return false;
  }
  isTextNode(node) {
    // return /\{\{+d?\}\}/.test(node.text);
  }
  compileElementNode(node) {}
  compileTextNode(node) {}
}

export default class MVVM {
  constructor({ el, data }) {
    this.$el = el;
    this.$data = data;

    if (this.$el) {
      new Compile(this.$el, this);
    }
  }
}
