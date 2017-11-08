var PanoramaControls = function (e, t) {
    function o(t, o) {
        d = !0,
            p = t,
            g = o,
            f = e.rotation.y,
            S = e.rotation.x,
            w.isAutoPlay = !1
    }
    function a(t, o) {
        d && w.enabled && (b = (t - p) * w.speed * .002 + f,
            v = (o - g) * w.speed * .002 + S,
            v = Math.max(w.minPolarAngle, Math.min(w.maxPolarAngle, v)),
            e.rotation.x = v,
            e.rotation.y = b,
            w.onCameraRotate())
    }
    function i() {
        d = !1
    }
    function n(e) {
        e.preventDefault(),
            e.stopPropagation(),
            o(e.touches[0].pageX * w.speed * E, e.touches[0].pageY * w.speed * E)
    }
    function r(e) {
        e.preventDefault(),
            e.stopPropagation(),
            a(e.touches[0].pageX * w.speed * E, e.touches[0].pageY * w.speed * E)
    }
    function s(e) {
        e.preventDefault(),
            e.stopPropagation(),
            i()
    }
    function l(e) {
        e.preventDefault(),
            o(e.clientX, e.clientY),
            document.addEventListener("mousemove", c, !1),
            document.addEventListener("mouseup", h, !1)
    }
    function c(e) {
        e.preventDefault(),
            a(e.clientX, e.clientY)
    }
    function h(e) {
        e.preventDefault(),
            i(),
            document.removeEventListener("mousemove", c, !1),
            document.removeEventListener("mouseup", h, !1)
    }
    function m() {
        w.enabled && w.isAutoPlay && !d && (e.rotation.y -= .001 * w.autoRotateSpeed)
    }
    function u() {
        requestAnimationFrame(u),
            m()
    }
    this.enabled = !0,
        this.isAutoPlay = !1,
        this.autoRotateSpeed = 1,
        this.speed = 1,
        this.minPolarAngle = THREE.Math.degToRad(-85),
        this.maxPolarAngle = THREE.Math.degToRad(85),
        this.onCameraRotate = function () { }
        ;
    var d = !1
        , p = 0
        , g = 0
        , b = 0
        , f = 0
        , v = 0
        , S = 0
        , E = 3
        , w = this;
    !function (e) {
        null !== e && void 0 !== e || (e = document),
            e.addEventListener("mousedown", l, !1),
            e.addEventListener("mousemove", c, !1),
            e.addEventListener("mouseup", h, !1),
            e.addEventListener("touchstart", n, !1),
            e.addEventListener("touchend", s, !1),
            e.addEventListener("touchmove", r, !1)
    }(t),
        u()
}


module.exports = PanoramaControls;