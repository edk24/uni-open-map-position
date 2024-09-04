import { gcj02_to_bd09, gcj02_to_wgs84 } from './utils';

export * from './utils';

/**
 * 打开地图app
 *
 * @param lnglat 经纬度，GCJ-02坐标系，如[116.403322, 39.920255]
 * @param target_name 标注目的地名称
 * @param source_application 来源应用名称
 *
 * iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
 */
export const openMap = (lnglat: [number, number], target_name: string, source_application?: string) => {
  const [lng, lat] = lnglat; // GCJ-02 国测
  const [bdlng, bdlat] = gcj02_to_bd09(lnglat); // BD-09 百度

  if (plus.os.name == 'Android') {
    const hasBaiduMap = plus.runtime.isApplicationExist({
      pname: 'com.baidu.BaiduMap',
      action: 'baidumap://',
    });
    const hasAmap = plus.runtime.isApplicationExist({
      pname: 'com.autonavi.minimap',
      action: 'androidamap://',
    });
    const urlBaiduMap = `baidumap://map/marker?location=${bdlat},${bdlng}&title=${target_name}&src=${source_application}`;
    const urlAmap = `androidamap://viewMap?sourceApplication=${source_application}&poiname=${target_name}&lat=${lat}&lon=${lng}&dev=0`;
    if (hasAmap && hasBaiduMap) {
      plus.nativeUI.actionSheet(
        {
          title: '选择地图应用',
          cancel: '取消',
          buttons: [{ title: '百度地图' }, { title: '高德地图' }],
        },
        function (e: { index: number }) {
          switch (e.index) {
            case 1:
              plus.runtime.openURL(urlBaiduMap);
              break;
            case 2:
              plus.runtime.openURL(urlAmap);
              break;
          }
        },
      );
    } else if (hasAmap) {
      plus.runtime.openURL(urlAmap);
    } else if (hasBaiduMap) {
      plus.runtime.openURL(urlBaiduMap);
    } else {
      // 其他地图，如国外的谷歌地图
      const [wgslng, wgslat] = gcj02_to_wgs84(lnglat); // WGS-84
      const url = `geo:${wgslat},${wgslng}?q=${source_application}`;

      plus.runtime.openURL(url, () => {
        // 打开失败时
        plus.nativeUI.alert('本机未安装指定地图应用！');
      });
    }
  } else {
    // iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
    plus.nativeUI.actionSheet(
      {
        title: '选择地图应用',
        cancel: '取消',
        buttons: [{ title: 'Apple地图' }, { title: '百度地图' }, { title: '高德地图' }],
      },
      function (e: { index: number }) {
        let url = '';
        switch (e.index) {
          case 1:
            url = `http://maps.apple.com/?q=${source_application}&ll=${lat},${lng}&spn=0.008766,0.019441`;
            break;
          case 2:
            url = `baidumap://map/marker?location=${bdlat},${bdlng}&title=${target_name}&src=${source_application}`;
            break;
          case 3:
            url = `iosamap://viewMap?sourceApplication=${source_application}&poiname=${target_name}&lat=${lat}&lon=${lng}&dev=0`;
            break;
          default:
            break;
        }
        if (url != '') {
          plus.runtime.openURL(url, () => {
            plus.nativeUI.alert('本机未安装指定的地图应用！');
          });
        }
      },
    );
  }
};
