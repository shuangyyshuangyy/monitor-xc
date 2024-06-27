import { reportTracker } from "./reportTracker";
const _window = window as any;

export const listenMouseEvent = () => {
  const mouseEventArr:string[] = ["click", "dbclick", "contextmenu"];
  mouseEventArr.forEach((event) => {
    _window.addEventListener(event, (e: Event) => {
      const target = e.target as HTMLElement;
      const trackerKey =
        target.getAttribute("tracker-key") ||
        target.offsetParent?.getAttribute("tracker-key");
      // 上报数据
      if (trackerKey) {
        reportTracker(
          {
            event,
            trackerKey,
            targetType:target.tagName,
          },
          "Mouse Event"
        );
      }
    });
  });
};
