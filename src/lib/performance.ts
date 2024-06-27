import { performanceOptions } from "../types/index";
import { reportTracker } from "./reportTracker";
class xcCollection {
  public perCollection: performanceOptions;
  constructor() {
    this.perCollection = {
      FP: 0,
      FCP: 0,
      LCP: 0,
    };
    this.getPerformance();
  }


  getPerformance() {
    let isFirstScreen = window.sessionStorage.getItem("xc_firstScreen") === null;
    if (!isFirstScreen) return;
    const observer = new PerformanceObserver((list) => {
      let entries = list.getEntries();
      for (let entry of entries) {
        const time = Number((entry.startTime).toFixed(2));
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-paint') {
            this.perCollection.FP = time;
          } else if (entry.name === 'first-contentful-paint') {
            this.perCollection.FCP = time;
          }
        }
        if (entry.entryType === 'largest-contentful-paint') {
          this.perCollection.LCP = time;
        }
      }
      window.sessionStorage.setItem(
        "xc_firstScreen",
        JSON.stringify(this.perCollection)
      );
    });
    observer.observe({ entryTypes: ["paint", "largest-contentful-paint"] });
    window.addEventListener('load', () => {
      //避免load事件触发时，可能页面的绘制性能条目（如FP、FCP、LCP）还未生成
      setTimeout(() => {
        observer.disconnect();
        reportTracker(
          {
            data: this.perCollection,
          },
          "Performance"
        );
      }, 1000);
    });
  }
}

export default xcCollection;
