/**
 * GCJ02坐标转换为BD09坐标
 *
 * @param gcj_lnglat
 * @returns [number, number]
 */
export declare function gcj02_to_bd09(gcj_lnglat: [number, number]): [number, number];
/**
 * wgs84坐标系转换为gcj02坐标系
 * @param wgs_lnglat
 * @returns
 */
export declare function wgs84_to_gcj02(wgs_lnglat: [number, number]): [number, number];
/**
 * gcj02坐标系转换为wgs84坐标系
 * @param gcj_lnglat
 * @returns
 */
export declare function gcj02_to_wgs84(gcj_lnglat: [number, number]): [number, number];
/**
 * BD09坐标转换为GCJ02坐标
 * @param bd_lnglat
 * @returns
 */
export declare function bd09_to_gcj02(bd_lnglat: [number, number]): [number, number];
