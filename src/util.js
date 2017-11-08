var Util = function () {}
Util.checkIsPhone = function () {
    var e = navigator.userAgent.toLowerCase(),
        t = "ipad" == e.match(/ipad/i),
        o = "iphone os" == e.match(/iphone os/i),
        a = "midp" == e.match(/midp/i),
        i = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i),
        n = "ucweb" == e.match(/ucweb/i),
        r = "android" == e.match(/android/i),
        s = "windows ce" == e.match(/windows ce/i),
        l = "windows mobile" == e.match(/windows mobile/i);
    return t || o || a || i || n || r || s || l
}
Util.getUrlParameter = function (e) {
    var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
        o = window.location.search.substr(1).match(t);
    return o ? decodeURIComponent(o[2]) : null
}
Util.setFullScreen = function (e) {
    e ? document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement
        .mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen ?
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) : document.body.msRequestFullscreen &&
        document.body.msRequestFullscreen() : document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ?
        document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document
        .msExitFullscreen && document.msExitFullscreen()
}
Util.isLandscape = function () {
    var e;
    return 180 === window.orientation || 0 === window.orientation ? e = !1 : 90 !== window.orientation && -90 !==
        window.orientation || (e = !0),
        e
}
Util.addStats = function (e) {
    function t() {
        o.update(),
            requestAnimationFrame(t)
    }
    var o = new Stats;
    e.appendChild(o.dom),
        t()
}
Util.worldToScreenPoint = function (e, t, o) {
    var a = new THREE.Vector3,
        i = .5 * t.context.canvas.width,
        n = .5 * t.context.canvas.height;
    return e.updateMatrixWorld(),
        a.setFromMatrixPosition(e.matrixWorld),
        a.project(o),
        a.x = a.x * i + i,
        a.y = -a.y * n + n,
        new THREE.Vector2(a.x, a.y)
}
Util.contains = function (e, t) {
    var o = !1;
    for (var a in e)
        e[a] === t && (o = !0);
    return o
}
module.exports = Util;