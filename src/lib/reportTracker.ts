/**
 * @data 上传的数据
 *
 */
import { reportType } from "../constants/index";
const _window = window as any;
export const reportTracker = <T>(data: T, type?: reportType) => {
  const params = {
    ...data,
    //了解用户使用的操作系统类型、浏览器类型和版本号等信息
    ua: _window.navigator.userAgent,
    type,
    appId: _window.Monitor._appId_, 
  };
  if (navigator.sendBeacon) {
    // 支持sendBeacon的浏览器
    navigator.sendBeacon(
      _window.Monitor._requestUrl_,
      new Blob([JSON.stringify(params)], {
        type: "application/json; charset=UTF-8",
      })
    );
  } else {
    // 不支持sendBeacon的浏览器
    let oImage = new Image();
    oImage.src = `${_window.Monitor._requestUrl_}?logs=${JSON.stringify(
      params
    )}`;
  }
};
