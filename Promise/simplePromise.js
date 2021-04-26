class SimplePromise {
  constructor(executor) {
    this.successCallback = void 666;
    this.failCallback = void 0;
    this.$status = "pending";
    executor(this.resolve.bind(this), this.reject.bind(this));
    // fn.resolve();
  }
  then(fn) {
    if (this.value) {
      fn(this.value);
    }
    return this;
  }
  catch(fn) {
    fn(this.err);
    return this;
  }
  resolve(value) {
    if (this.$status === "pending") {
      this.$status = null;
      this.value = value;
    }
  }
  reject(err) {
    if (this.$status === "pending") {
      this.$status = "fail";
      this.err = err;
    }
  }
}
