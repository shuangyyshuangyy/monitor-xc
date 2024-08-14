import { Options } from "../types/index";
import { createRouterEvent } from "../utils/createRouterEvent";
import { reportTracker } from "./reportTracker";
import { setUserId } from "./setUserId";
import { jsError, promiseError, resourceError } from "./errorReport";
import xcCollection from "./performance";
import { validPageStayTime } from "../constants/index";
import { listenMouseEvent } from "./domReport";
const _window = window as any;//在 TypeScript 中避免类型检查错误，方便后续对 _window 对象的扩展和修改。
class Monitor {
  public options: Options;
  public pageStartTime: number;
  public currentPage: string;
  constructor(options: Options) {
    this.options = options;//用于存储传入的配置
    _window.Monitor = {
      _requestUrl_: this.options.requestUrl,//请求URL
      _appId_: this.options.appId,//应用ID
    };
    this.pageStartTime = this.getTime();//记录页面开始的时间。
    this.currentPage = _window.location.href;//记录当前页面的URL。
    this.addEventListener();//添加全局事件监听器。
    //根据配置项，决定是否启动不同的监控任务
    if (this.options.routerTracker) {
      this.installRouteTracker();
    }
    if (this.options.domTracker) {
      this.installMouseTracker();
    }
    if (this.options.jsError) {
      this.installErrorTracker();
    }
    if (this.options.performanceTracker) {
      this.installPerformanceTracker();
    }
  }
  // 重写两个方法 添加全局监听事件
  addEventListener() {
    _window.history["pushState"] = createRouterEvent("pushState");
    _window.history["replaceState"] = createRouterEvent("replaceState");
  }
  // 监听路由变化统计pv
  installRouteTracker() {
    this.getStayTime();
  }
  // 监听鼠标事件操作
  installMouseTracker() {
    listenMouseEvent();
  }
  installErrorTracker() {
    this.errorTrackerReport();
  }
  installPerformanceTracker() {
    new xcCollection();
  }
  /**
   * 1.语法错误 比如少了一个单引号 开发编译阶段即可发现无需处理 【 x 】
   * 2.同步错误 比如使用的变量未定义 使用try catch即可捕获 开发编译阶段即可发现无需处理  【 x 】
   * 3.异步错误 无法被try catch捕获 使用 【 window.onerror 】来捕获处理 【 ✓ 】
   * 4.promise错误 【 unhandledrejection 】进行兜底 【 ✓ 】
   * 5.资源加载错误 全局监听 【 error 】进行兜底 【 ✓ 】
   */
  errorTrackerReport() {
    jsError();
    promiseError();
    resourceError();
  }

  // 统计页面停留时长
  getStayTime() {
    ["hashchange", "pushState", "replaceState", "popstate"].forEach((item) => {
      _window.addEventListener(item, (event: Event) => {
        let currentPage = _window.location.href;
        let prePage = this.currentPage;
        if (currentPage ===  prePage) return;
        this.currentPage = currentPage;
        let stayTime = this.calcStayTime() / 1000;
        if (stayTime > validPageStayTime) {
          this.pageStartTime = this.getTime();         
            // 上报PV数据
            reportTracker(
              {
                stayTime,
                currentPage,
                prePage
              },
              "PV"
            );     
        }
      });
    });
  }
  getTime() {
    return new Date().getTime();
  }
  calcStayTime() {
    return this.getTime() - this.pageStartTime;
  }
}

_window.Monitor = Monitor;
export default Monitor;
export { reportTracker, setUserId };
