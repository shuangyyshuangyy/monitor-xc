### Features

✔️ PV/UV 统计
✔️ 自定义埋点上报
✔️ 错误捕获
✔️ 性能指标上报

### 安装

```shell
npm i monitor-xc
```

### 使用

```js
import Monitor, { reportTracker } from "monitor-xc";

new Monitor({
  appId: "你的项目id，用于区分项目",
  requestUrl: "上传地址",
  routerTracker: true, //是否开启pv统计
  domTracker: true, //是否开启鼠标事件比如click dbclick contextmenu的打点上报
  jsError: true, //是否开启错误捕获上报
  performanceTracker: true, //是否开启性能指标上报
});
```

### reportTracker 用于手动上报

reportTracker(data,type) data 上传的数据 type 上传的类型

类型分为 "Mouse Event" | "UV" | "PV" | "Error" | "Performance"

### 点击事件上报方式

① 组件库支持属性透传时可使用

```js
<Button tracker-key="tracker001">点击我自动上传埋点</Button>
```

目前已知不支持属性透传的组件库 vant

② 组件库不支持属性透传时可使用 reportTracker 手动上报

```js
<Button onClick={selfTracker}>点击我手动上传埋点</Button>;

const selfTracker = () => {
  reportTracker(
    {
      data: "tracker002",
      event: "click",
    },
    "Mouse Event"
  );
};
```
