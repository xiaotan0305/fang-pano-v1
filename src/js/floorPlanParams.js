
var AppParams = require('./appParams.js');
var FloorPlanParams = {
    size: {
        baseSize: AppParams.isPhone ? 138 : 115,
        extraPixels: AppParams.isPhone ? 2 : 4
    },
    leftBaseSize: AppParams.isPhone ? 0 : 20,
    topBaseSize: AppParams.isPhone ? 0 : 48,
    refBaseSize: AppParams.isPhone ? 375 : 450,
    bgColor: 0,
    bgOpacity: .7,
    smallViewMargin: 1.05,
    hotSpotSize: 40,
    hotSpotNameMarginTop: -48
}
module.exports = FloorPlanParams;