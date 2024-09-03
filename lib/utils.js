// 坐标转换
// WGS84：为一种大地坐标系，也是目前广泛使用的GPS全球卫星定位系统使用的坐标系。
// GCJ02：又称火星坐标系，是由中国国家测绘局制订的地理信息系统的坐标系统。由WGS84坐标系经加密后的坐标系
// BD09：为百度坐标系，在GCJ02坐标系基础上再次加密。其中bd09ll表示百度经纬度坐标，bd09mc表示百度墨卡托米制坐标。
// h5在微信浏览器里、uniapp是使用 gcj02 国测局坐标系
// WGS84  GCJ02  BD09
// 代码来源：https://www.cnblogs.com/2186009311CFF/p/13376617.html
// 本工具仅作适配优化
var PI = 3.14159265358979324;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var delta = function (lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    var dLat = transformLat(lon - 105.0, lat - 35.0);
    var dLon = transformLon(lon - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
    return {
        'lat': dLat,
        'lon': dLon
    };
};
var transformLat = function (x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
};
var transformLon = function (x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
};
/**
 * GCJ02坐标转换为BD09坐标
 *
 * @param gcj_lnglat
 * @returns [number, number]
 */
export function gcj02_to_bd09(gcj_lnglat) {
    var gcjLon = gcj_lnglat[0], gcjLat = gcj_lnglat[1];
    var x = gcjLon, y = gcjLat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    var bdLon = z * Math.cos(theta) + 0.0065;
    var bdLat = z * Math.sin(theta) + 0.006;
    return [bdLon, bdLat];
}
/**
 * wgs84坐标系转换为gcj02坐标系
 * @param wgs_lnglat
 * @returns
 */
export function wgs84_to_gcj02(wgs_lnglat) {
    var wgsLon = wgs_lnglat[0], wgsLat = wgs_lnglat[1];
    if (outOfChina(wgsLat, wgsLon))
        return [wgsLon, wgsLat];
    var d = delta(wgsLat, wgsLon);
    var gcjLat = wgsLat + d.lat;
    var gcjLon = wgsLon + d.lon;
    return [gcjLon, gcjLat];
}
/**
 * gcj02坐标系转换为wgs84坐标系
 * @param gcj_lnglat
 * @returns
 */
export function gcj02_to_wgs84(gcj_lnglat) {
    var gcjLon = gcj_lnglat[0], gcjLat = gcj_lnglat[1];
    if (outOfChina(gcjLat, gcjLon)) {
        return [gcjLon, gcjLat];
    }
    var d = delta(gcjLat, gcjLon);
    var wgsLat = gcjLat - d.lat;
    var wgsLon = gcjLon - d.lon;
    return [wgsLon, wgsLat];
}
/**
 * BD09坐标转换为GCJ02坐标
 * @param bd_lnglat
 * @returns
 */
export function bd09_to_gcj02(bd_lnglat) {
    var bdLon = bd_lnglat[0], bdLat = bd_lnglat[1];
    var x = bdLon - 0.0065, y = bdLat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gcjLon = z * Math.cos(theta);
    var gcjLat = z * Math.sin(theta);
    return [gcjLon, gcjLat];
}
var outOfChina = function (lat, lon) {
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
};
