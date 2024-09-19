import "@amap/amap-jsapi-types";
import { useEffect, useRef } from "react";
import "./App.css";

declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode: string };
    ___onAPILoaded?: () => void;
  }
}

function App() {
  const map = useRef<AMap.Map>();

  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode: "4eb20d0ed3cde0852ed15c7a69bbab1a",
    };

    window.___onAPILoaded = function () {
      delete window.___onAPILoaded;
      document.dispatchEvent(new Event("amapAPILoaded"));
    };

    const script = document.createElement("script");

    // AMapLoader.load后下载脚本到amap.js，实现离线加载。但是仍然需要下载瓦片数据
    script.src = "/amap.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      delete window._AMapSecurityConfig;
      delete window.___onAPILoaded;
      document.body.removeChild(script);
    };
  });

  useEffect(() => {
    // AMapLoader.load({
    //   key: "62142551fd8aea4d4e52f8381c862d53", // 申请好的Web端开发者Key，首次调用 load 时必填
    //   version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    //   plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    // })
    //   .then((amap: typeof AMap) => {
    //     console.log(amap);
    //     map.current = new amap.Map("container", {
    //       // 设置地图容器id
    //       viewMode: "3D", // 是否为3D地图模式
    //       zoom: 11, // 初始化地图级别
    //       center: [116.397428, 39.90923], // 初始化地图中心点位置
    //     });
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });

    const createMap = () => {
      map.current = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
    };

    document.addEventListener("amapAPILoaded", createMap);

    return () => {
      map.current?.destroy();
      document.removeEventListener("amapAPILoaded", createMap);
    };
  }, []);

  return <div id="container"></div>;
}

export default App;
