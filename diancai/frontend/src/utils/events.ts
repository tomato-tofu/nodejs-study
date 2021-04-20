interface Dispatch {
  handle: (type: string, args?: any) => void;
  install: (type: string) => Dispatch;
  uninstall: (type: string) => Dispatch;
  add: (type: string, callback: () => void) => Dispatch;
}

export default class DispatchingCenter implements Dispatch {
  private evenetList: object;

  constructor() {
    this.evenetList = new Object();
  }

  public handle(type: string, args) {
    if (this.evenetList.hasOwnProperty(type)) {
      for (let i = 0; i < this.evenetList[type].length; i++) {
        this.evenetList[type][i](args);
      }
    } else {
      throw new Error("namespace not found");
    }
  }

  public install(type: string): Dispatch {
    this.evenetList[type] = [];
    return this;
  }

  public uninstall(type: string): Dispatch {
    if (this.evenetList.hasOwnProperty(type)) {
    } else {
      throw new Error("namespace not found");
    }
    return this;
  }

  public add(type: string, callback: () => void): Dispatch {
    if (this.evenetList.hasOwnProperty(type)) {
      this.evenetList[type].push(callback);
    } else {
      throw new Error("namespace not found");
    }
    return this;
  }
}
