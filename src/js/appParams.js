var Util = require('./util.js');
var domain = window.pano.domain;
var housePathPrefix = Util.getUrlParameter("hid") ? domain + Util.getUrlParameter("hid") + "/" : domain;
var isFullScreenInNewTab = "true" === Util.getUrlParameter("fsnewtab");
var AppParams = {
    housePathPrefix: housePathPrefix,
    isSingleMode: !!Util.getUrlParameter("mode"),
    largeViewBgColor: 6710886,
    switchAutoTimeout: 6e3,
    isPhone: Util.checkIsPhone(),
    displayRoomName: !0,
    isPlayCameraFlyAnimation: !1,
    isDisplayPanoramaFirst: !0,
    enableBlurLoading: !1,
    isFullScreenInNewTab: isFullScreenInNewTab,
    alwaysDisplayThumbnail: !1
}
module.exports = AppParams;