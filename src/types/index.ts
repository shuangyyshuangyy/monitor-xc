/**
 * @requestUrl 上报地址
 * @routerTracker 是否开启路由上报
 * @domTracker 是否开启dom元素比如点击 双击 右键菜单等用户行为信息上报
 * @jsError 是否开启js错误时信息上报
 *
 */
export interface MonitorOptions {
  appId: string;
  requestUrl: string;
  routerTracker: boolean;
  domTracker: boolean;
  jsError: boolean;
  performanceTracker: boolean;
}

export interface Options extends Partial<MonitorOptions> {
  appId: string;
  requestUrl: string;
}

export enum MonitorConfig {
  version = "1.0.0",
}

export interface performanceOptions {
  FP: number;//绘制第一个像点的时间，白屏时间
  FCP: number;//第一个DOM元素绘制完成
  LCP: number;//最大内容绘制完成的时间
}
