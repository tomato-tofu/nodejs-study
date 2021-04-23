// 辅助工具函数
// 绑定key上对应的值，从vm.$data中取到
const getValue = (vm, expr) => {
  expr = expr.split("."); // [message, a, b, c]
  return expr.reduce((prev, next) => {
    return prev[next];
  }, vm.$data);
};
// 获取文本编译后的对应的数据test
const getTextValue = (vm, expr) => {
  return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
    return getValue(vm, args[1]);
  });
};

const compileUtil = {
  // 解析v-text
  text(node, vm, expr) {
    node.textContent = getValue(vm, expr);
    new Watcher(vm, expr, (newValue) => {
      console.log("执行watch text1");
      node.textContent = newValue;
    });
  },
  textContent(node, vm, expr) {
    node.textContent = getTextValue(vm, expr);
    new Watcher(vm, expr, (newValue) => {
      node.textContent = newValue;
    });
  },
  // 解析v-html
  html(node, vm, expr) {
    this.updater.htmlUpdater(node, getValue(vm, expr));
    new Watcher(vm, expr, (newValue) => {
      console.log("执行watch html");
      this.updater.htmlUpdater(node, newValue);
    });
  },
  // 解析v-model
  model(node, vm, expr) {
    const that = this;
    this.updater.modelUpdater(node, getValue(vm, expr));

    node.addEventListener("input", function () {
      // 下面这个写法不能深度改变数据
      // vm.$data[expr] = this.value
      that.setVal(vm, expr, this.value);
    });
    new Watcher(vm, expr, (newValue) => {
      console.log("执行watch model ");
      this.updater.modelUpdater(node, newValue);
    });
  },
  // 解析v-on
  eventHandler(node, vm, expr, event) {
    const [, eventType] = event.split(":");
    const fn = vm.$methods && vm.$methods[expr];
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm));
    }
  },

  setVal(vm, expr, value) {
    let data = vm.$data;
    let arr = expr.split(".");
    arr.forEach((key, index) => {
      if (index < arr.length - 1) {
        data = data[key];
      } else {
        data[key] = value;
      }
    });
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = typeof value === "undefined" ? "" : value;
    },
    modelUpdater(node, value) {
      node.value = typeof value === "undefined" ? "" : value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
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

    Array.from(childs).forEach((node) => {
      fragment.appendChild(node);
    });
    return fragment;
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach((node) => {
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
    return node.nodeType === 3;
  }
  isDerective(attrName) {
    return attrName.indexOf("v-") >= 0;
  }
  isEventDirective(attrName) {
    return attrName.indexOf("on") >= 0;
  }
  isEventDirectiveBySuger(attrName) {
    return attrName.indexOf("@") >= 0;
  }
  compileElementNode(node) {
    let attrs = node.attributes;
    //[...attrs].forEach((attr) => {
    Array.from(attrs).forEach((attr) => {
      const attrName = attr.name;
      if (this.isDerective(attrName)) {
        const expr = attr.value;
        const [, eventType] = attrName.split("-");
        if (this.isEventDirective(eventType)) {
          compileUtil.eventHandler(node, this.vm, expr, eventType);
        } else if (this.isEventDirectiveBySuger(attrName)) {
          const [, eventType] = attrName.split("@");
          compileUtil.eventHandler(node, this.vm, expr, eventType);
        } else {
          try {
            compileUtil[eventType](node, this.vm, expr);
          } catch (e) {
            throw e;
          }
        }
      }
    });
  }
  compileTextNode(node) {
    let expr = node.textContent;
    compileUtil.textContent(node, this.vm, expr);
  }
}

class Observe {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    if (!data || typeof data !== "object") {
      return;
    }
    // 将数据一一劫持
    // 先获取到data的key和value
    Object.keys(data).forEach((key) => {
      // 数据劫持
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]);
    });
  }
  defineReactive(obj, key, value) {
    let _this = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        // 在取值时将订阅者push入订阅者数组
        Dep.target && dep.addSub(Dep.target);
        // 当取值时调用
        return value;
      },
      set(newValue) {
        //当data属性中设置新值得时候 更改获取的新值
        if (newValue !== value) {
          // _this.observe(newValue); // 如果是对象继续劫持
          value = newValue;
          dep.notify(); //通知所有人 数据更新了
        }
      },
    });
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}

/*
Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是:

1、在自身实例化时往属性订阅器(dep)里面添加自己

2、自身必须有一个update()方法

3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
*/
class Watcher {
  constructor(vm, expr, cb) {
    // 获取当前订阅者
    Dep.target = this;
    // 触发getter，当前订阅者添加订阅器中 在 劫持数据时，将订阅者放到订阅者数组
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 初始化时缓存当前的值
    this.value = this.get();
    // 重置订阅者
    Dep.target = null;
  }

  get() {
    // 获取文本编译后的对应的数据
    if (/\{\{(.+?)\}\}/g.test(this.expr)) {
      return getTextValue(this.vm, this.expr);
    } else {
      return getValue(this.vm, this.expr);
    }
  }

  update() {
    const oldValue = this.value;
    this.value = this.get();
    // 更新的值 与 以前的值 进行比对， 如果发生变化就更新方法
    if (this.value !== oldValue) {
      this.cb(this.value, oldValue);
    }
  }
}

export default class MVVM {
  constructor({ el, data, methods }) {
    this.$el = el;
    this.$data = data;
    this.$methods = methods;
    // 属性代理，实现 vm.xxx -> vm._data.xxx
    for (let key in this.$data) {
      this.proxy(key);
    }
    if (this.$el) {
      // 先劫持填充的数据
      new Observe(this.$data);
      // 再解析使用的数据
      new Compile(this.$el, this);
    }
  }
  proxy(key) {
    Object.defineProperty(this, key, {
      configurable: false,
      enumerable: true,
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      },
    });
  }
}
