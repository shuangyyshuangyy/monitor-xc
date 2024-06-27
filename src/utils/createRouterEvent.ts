/**
 * history中pushState和replaceState无法通过window.addEventListener监听到 所以重写两个方法
 * @param type 
 * @returns 
 */
export const createRouterEvent = <T extends keyof History>(type: T) => {
  const orgin = history[type];
  return function (this: any) {
    const res = orgin.apply(this, arguments);
    //任何监听了该事件类型的监听器都会接收到这个事件，并执行相应的处理函数。
    const event = new Event(type);
    window.dispatchEvent(event);
    return res;
  };
};
