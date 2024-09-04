# uni-open-map-position

uniapp 移动端APP打开地图应用导航，标记位置信息

**兼容性**

| APP | 微信小程序 | H5 |
| :---: | :---: | :---: |
| ✅ | ❌ | ❌ |

## 功能

- [x] 打开地图应用标注位置，可进行导航
- [x] 百度坐标系偏差修正
- [x] 检查用户手机是否安装高德、百度等地图，单个地图应用直接打开。多个提供选择 [百度地图，高德地图、Apple地图]
- [x] 无法找到国内通用地图时，通过geo协议打开任何地图，并且坐标系转换为 wgs-84

## 导出方法

- openMap([纬度，经度], 目的地标注, 来源应用): 打开移动端地图APP导航
- gcj02_to_bd09(): 传入gcj02坐标系，转换为bd09坐标系
- gcj02_to_wgs84()
- wgs84_to_gcj02()
- bd09_to_gcj02()

**注意：如果找不到

## 示例代码

```javascript
import { openMap } from 'uni-open-map-position';

openMap([106.628201, 26.646694], '贵阳市', '我的测试应用');
```

## 坐标系

| 坐标系 | APP | 备注 |
| :--- | :--- | :--- |
| WGS-84 | 谷歌地图、必应地图、苹果地图 | 目前广泛使用的GPS全球卫星定位系统使用的坐标系 |
| GCJ-02 | 高德地图、腾讯地图 | 火星坐标系，由中国国家测绘局制订的地理信息系统的坐标系统。由WGS84坐标系经加密后的坐标系。 |
| BD-09 | 百度地图 | 百度坐标系，在GCJ02坐标系基础上再次加密 |

**非中国地区地图，服务坐标统一使用WGS84坐标。**

- [来源 - 百度地图-JSAPI-坐标转换](https://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/coorinfo)

## 参考资料

- [plus.runtime.isApplicationExist](https://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.isApplicationExist)
- [plus.nativeUI.actionSheet](https://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.actionSheet)
- [plus.runtime.openURL](https://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.openURL)