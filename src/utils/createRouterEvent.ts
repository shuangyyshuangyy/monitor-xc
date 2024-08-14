/**
 * history中pushState和replaceState无法通过window.addEventListener监听到 所以重写两个方法
 * @param type 
 * @returns 
 */
export const createRouterEvent = <T extends keyof History>(type: T) => {
  // 在调用原始方法之后，手动触发了自定义的事件。这样就可以通过监听这些自定义事件来得知 pushState 和 replaceState 的调用情况。
  const orgin = history[type];
  return function (this: any) {
    const res = orgin.apply(this, arguments);
    //任何监听了该事件类型的监听器都会接收到这个事件，并执行相应的处理函数。
    const event = new Event(type);
    window.dispatchEvent(event);
    return res;
  };
};
