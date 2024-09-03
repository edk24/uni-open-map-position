/**
 * 打开地图app
 *
 * @param lnglat 经纬度，GCJ-02坐标系，如[116.403322, 39.920255]
 * @param target_name 标注目的地名称
 * @param source_application 来源应用名称
 *
 * iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
 */
export declare const openMap: (lnglat: [number, number], target_name: string, source_application?: string) => void;
