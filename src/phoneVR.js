var PhoneVR = function () {
    this.deviceAlpha = null,
        this.deviceGamma = null,
        this.deviceBeta = null,
        window.addEventListener("deviceorientation", function (e) {
                this.deviceAlpha = e.alpha,
                    this.deviceGamma = e.gamma,
                    this.deviceBeta = e.beta
            }
            .bind(this))
}
PhoneVR.prototype.orientationIsAvailable = function () {
    return null !== this.deviceAlpha
}
PhoneVR.prototype.rotationQuat = function () {
    if (!this.orientationIsAvailable())
        return null;
    var e = Math.PI / 180,
        t = this.deviceAlpha * e / 2,
        o = this.deviceBeta * e / 2,
        a = this.deviceGamma * e / 2,
        i = Math.cos(o),
        n = Math.cos(a),
        r = Math.cos(t),
        s = Math.sin(o),
        l = Math.sin(a),
        c = Math.sin(t),
        h = i * n * r - s * l * c,
        o = s * n * r - i * l * c,
        a = i * l * r + s * n * c,
        t = i * n * c + s * l * r,
        m = new THREE.Quaternion(o, a, t, h),
        u = this.getScreenOrientation() * e / 2,
        d = new THREE.Quaternion(0, 0, -Math.sin(u), Math.cos(u)),
        p = new THREE.Quaternion;
    p.multiplyQuaternions(m, d);
    var g = Math.sqrt(.5);
    return p.multiplyQuaternions(new THREE.Quaternion(-g, 0, 0, g), p),
        p
}
PhoneVR.prototype.getScreenOrientation = function () {
    switch (window.screen.orientation || window.screen.mozOrientation) {
    case "landscape-primary":
        return 90;
    case "landscape-secondary":
        return -90;
    case "portrait-secondary":
        return 180;
    case "portrait-primary":
        return 0
    }
    if (void 0 !== window.orientation)
        return window.orientation
}
module.exports = PhoneVR;