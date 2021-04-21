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
  return expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
    return getValue(vm, args[1]);
  });
};

const compileUtil = {
  // 解析v-text
  text(node, vm, expr) {
    node.textContent = getValue(vm, expr);
    new Watcher(vm, expr, (newValue) => {
      node.textContent = newValue;
    });
  },
  textContent(node, vm, expr) {
    node.textContent = getTextValue(vm, expr);
    // new Watcher(vm, expr, (newValue) => {
    //   node.textContent = newValue;
    // });
  },
  // 解析v-html
  html(node, vm, expr) {
    node.innerHTML = this.getValue(vm, expr);
    new Watcher(vm, expr, (newValue) => {
      node.innerHTML = newValue;
    });
  },
  // 解析v-model
  model(node, vm, expr) {
    node.value = this.getValue(vm, expr);
    node.addEventListener("input", () => {
      // 下面这个写法不能深度改变数据
      // vm.$data[expr] = this.value
      this.setVal(vm, expr, this.value);
    });
    new Watcher(vm, expr, (newValue) => {
      node.value = newValue;
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
  getValue(vm, expr) {
    expr = expr.split("."); // [message, a, b, c]
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = typeof value === "undefined" ? "" : value;
    },
    modelUpdater(node, value) {
      node.value = typeof value === "undefined" ? "" : value;
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
    return node.nodeType === 3;
  }
  isDerective(attrName) {
    return attrName.indexOf("v-") >= 0;
  }
  isEventDirective(attrName) {
    return attrName.indexOf("on") >= 0;
  }
  compileElementNode(node) {
    let attrs = node.attributes;
    [...attrs].forEach((attr) => {
      const attrName = attr.name;
      if (this.isDerective(attrName)) {
        const dir = attr.value; // content1

        const [, expr] = attrName.split("-");

        if (this.isEventDirective(expr)) {
          compileUtil.eventHandler(node, this.vm, dir, expr);
        } else {
          compileUtil[expr] && compileUtil[expr](node, this.vm, dir);
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
      this.observe(data[key]); // 深度递归劫持，保证子属性的值也会被劫持
    });
  }
  defineReactive(obj, key, value) {
    let _this = this;
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 在取值时将订阅者push入订阅者数组
        console.log(dep);
        Dep.target && dep.addSub(Dep.target);
        // 当取值时调用
        return value;
      },
      set(newValue) {
        //当data属性中设置新值得时候 更改获取的新值
        if (newValue !== value) {
          _this.observe(newValue); // 如果是对象继续劫持
          console.log("监听到值变化了,旧值：", value, " --> 新值：", newValue);
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
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.value = this.get();
  }

  get() {
    // 获取文本编译后的对应的数据
    // 获取当前订阅者
    Dep.target = this;
    // 触发getter，当前订阅者添加订阅器中 在 劫持数据时，将订阅者放到订阅者数组
    let value = getValue(this.vm, this.expr);
    // 重置订阅者
    Dep.target = null;
    return value;
  }

  update() {
    let newValue = get();
    let oldValue = this.value;
    // 更新的值 与 以前的值 进行比对， 如果发生变化就更新方法
    if (newValue !== oldValue) {
      this.cb(this.vm, value, oldValue);
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
      new Observe(this.$data);
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
