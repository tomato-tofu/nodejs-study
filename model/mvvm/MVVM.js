// 辅助工具函数
// 绑定key上对应的值，从vm.$data中取到
const getValue = (vm, expr) => {
  expr = expr.split("."); // [message, a, b, c]
  return expr.reduce((prev, next) => {
    return prev[next];
  }, vm.$data);
};
// 获取文本编译后的对应的数据
const getTextValue = (vm, expr) => {
  return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
    return getValue(vm, arguments[1]);
  });
};

const compileUtil = {
  text(node, vm, expr) {
    // 文本
    let updater = this.updater["textUpdate"];
    updater && updater(node, getTextValue(vm, expr));
  },
  model(node, vm, expr) {
    // 输入框
    let updater = this.updater["modelUpdate"];
    updater && updater(node, getValue(vm, expr));
  },
  // 更新函数
  updater: {
    // 文本赋值
    textUpdate(node, value) {
      node.textContent = value;
    },
    // 输入框value赋值
    modelUpdate(node, value) {
      node.value = value;
    },
  },
};

class Compile {
  constructor(el, vm) {
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    this.vm = vm;
    const fragment = this.node2fragment(this.$el);
    this.compile(fragment);
    this.$el.appendChild(fragment);
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
        this.compileElementNode(node);
      }

      // // 如果是文本节点,则解析差值表达式
      if (this.isTextNode(node)) {
        this.compileTextNode(node);
      }

      // 递归解析
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isTextNode(node) {
    return node.nodeType === 3 && /\{\{([^}]+)\}\}/g.test(node.textContent);
  }
  compileElementNode(node) {
    let attrs = node.attributes;
    [...attrs].forEach((attr) => {
      const attrName = attr.name;
      const [, expr] = attrName.split("-");
    });
  }
  compileTextNode(node) {
    let expr = node.textContent;
    compileUtil["text"](node, this.vm, expr);
  }
}

export default class MVVM {
  constructor({ el, data }) {
    this.$el = el;
    this.$data = data;

    if (this.$el) {
      new Compile(this.$el, this);
    } else {
      throw "undefined element";
    }
  }
}

//https://segmentfault.com/a/1190000018399478
