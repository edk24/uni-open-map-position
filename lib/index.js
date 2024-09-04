import { gcj02_to_bd09, gcj02_to_wgs84 } from "./utils";
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
export var openMap = function (lnglat, target_name, source_application) {
    var lng = lnglat[0], lat = lnglat[1]; // GCJ-02 国测
    var _a = gcj02_to_bd09(lnglat), bdlng = _a[0], bdlat = _a[1]; // BD-09 百度
    if (plus.os.name == 'Android') {
        var hasBaiduMap = plus.runtime.isApplicationExist({
            pname: 'com.baidu.BaiduMap',
            action: 'baidumap://',
        });
        var hasAmap = plus.runtime.isApplicationExist({
            pname: 'com.autonavi.minimap',
            action: 'androidamap://',
        });
        var urlBaiduMap_1 = "baidumap://map/marker?location=".concat(bdlat, ",").concat(bdlng, "&title=").concat(target_name, "&src=").concat(source_application);
        var urlAmap_1 = "androidamap://viewMap?sourceApplication=".concat(source_application, "&poiname=").concat(target_name, "&lat=").concat(lat, "&lon=").concat(lng, "&dev=0");
        if (hasAmap && hasBaiduMap) {
            plus.nativeUI.actionSheet({
                title: '选择地图应用',
                cancel: '取消',
                buttons: [{ title: '百度地图' }, { title: '高德地图' }],
            }, function (e) {
                switch (e.index) {
                    case 1:
                        plus.runtime.openURL(urlBaiduMap_1);
                        break;
                    case 2:
                        plus.runtime.openURL(urlAmap_1);
                        break;
                }
            });
        }
        else if (hasAmap) {
            plus.runtime.openURL(urlAmap_1);
        }
        else if (hasBaiduMap) {
            plus.runtime.openURL(urlBaiduMap_1);
        }
        else { // 其他地图，如国外的谷歌地图
            var _b = gcj02_to_wgs84(lnglat), wgslng = _b[0], wgslat = _b[1]; // WGS-84
            var url = "geo:".concat(wgslat, ",").concat(wgslng, "?q=").concat(source_application);
            plus.runtime.openURL(url, function () {
                // 打开失败时
                plus.nativeUI.alert('本机未安装指定地图应用！');
            });
        }
    }
    else {
        // iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
        plus.nativeUI.actionSheet({
            title: '选择地图应用',
            cancel: '取消',
            buttons: [
                { title: 'Apple地图' },
                { title: '百度地图' },
                { title: '高德地图' }
            ],
        }, function (e) {
            var url = '';
            switch (e.index) {
                case 1:
                    url = "http://maps.apple.com/?q=".concat(source_application, "&ll=").concat(lat, ",").concat(lng, "&spn=0.008766,0.019441");
                    break;
                case 2:
                    url = "baidumap://map/marker?location=".concat(bdlat, ",").concat(bdlng, "&title=").concat(target_name, "&src=").concat(source_application);
                    break;
                case 3:
                    url = "iosamap://viewMap?sourceApplication=".concat(source_application, "&poiname=").concat(target_name, "&lat=").concat(lat, "&lon=").concat(lng, "&dev=0");
                    break;
                default:
                    break;
            }
            if (url != '') {
                plus.runtime.openURL(url, function () {
                    plus.nativeUI.alert('本机未安装指定的地图应用！');
                });
            }
        });
    }
};
