import { gcj02_to_bd09 } from '../utils';

test('GCJ02-TO-BD09', () => {
  const lnglat = [106.697845, 26.567703] as any; // 花果园南广场，GCJ-02
  const bd_lnglat = [106.70430927991049, 26.573896142574362];

  expect(gcj02_to_bd09(lnglat)).toEqual(bd_lnglat); // 花果园南广场，BD-09
});
