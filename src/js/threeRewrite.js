var rewrite = function () {

    THREE.OrbitControls = function (e, t) {
        function o() {
            return 2 * Math.PI / 60 / 60 * A.autoRotateSpeed
        }

        function a() {
            return Math.pow(.95, A.zoomSpeed)
        }

        function i(e) {
            O.theta -= e
        }

        function n(e) {
            O.phi -= e
        }

        function r(e) {
            A.object instanceof THREE.PerspectiveCamera ? z /= e : A.object instanceof THREE.OrthographicCamera ?
                (A.object
                    .zoom = Math.max(A.minZoom, Math.min(A.maxZoom, A.object.zoom * e)),
                    A.object.updateProjectionMatrix(),
                    N = !0) : (console.warn(
                        "WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),
                    A.enableZoom = !1)
        }

        function s(e) {
            A.object instanceof THREE.PerspectiveCamera ? z *= e : A.object instanceof THREE.OrthographicCamera ?
                (A.object
                    .zoom = Math.max(A.minZoom, Math.min(A.maxZoom, A.object.zoom / e)),
                    A.object.updateProjectionMatrix(),
                    N = !0) : (console.warn(
                        "WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),
                    A.enableZoom = !1)
        }

        function l(e) {
            W.set(e.clientX, e.clientY)
        }

        function c(e) {
            X.set(e.clientX, e.clientY)
        }

        function h(e) {
            Z.set(e.clientX, e.clientY)
        }

        function m(e) {
            $.set(e.clientX, e.clientY),
                U.subVectors($, W);
            var t = A.domElement === document ? A.domElement.body : A.domElement;
            i(2 * Math.PI * U.x / t.clientWidth * A.rotateSpeed),
                n(2 * Math.PI * U.y / t.clientHeight * A.rotateSpeed),
                W.copy($),
                A.update()
        }

        function u(e) {
            q.set(e.clientX, e.clientY),
                Q.subVectors(q, X),
                Q.y > 0 ? r(a()) : Q.y < 0 && s(a()),
                X.copy(q),
                A.update()
        }

        function d(e) {
            Y.set(e.clientX, e.clientY),
                _.subVectors(Y, Z),
                ee(_.x, _.y),
                Z.copy(Y),
                A.update()
        }

        function p(e) {
            e.deltaY < 0 ? s(a()) : e.deltaY > 0 && r(a()),
                A.update()
        }

        function g(e) {
            switch (e.keyCode) {
            case A.keys.UP:
                ee(0, A.keyPanSpeed),
                    A.update();
                break;
            case A.keys.BOTTOM:
                ee(0, -A.keyPanSpeed),
                    A.update();
                break;
            case A.keys.LEFT:
                ee(A.keyPanSpeed, 0),
                    A.update();
                break;
            case A.keys.RIGHT:
                ee(-A.keyPanSpeed, 0),
                    A.update()
            }
        }

        function b(e) {
            W.set(e.touches[0].pageX, e.touches[0].pageY)
        }

        function f(e) {
            var t = e.touches[0].pageX - e.touches[1].pageX,
                o = e.touches[0].pageY - e.touches[1].pageY,
                a = Math.sqrt(t * t + o * o);
            X.set(0, a)
        }

        function v(e) {
            Z.set(e.touches[0].pageX, e.touches[0].pageY)
        }

        function S(e) {
            $.set(e.touches[0].pageX, e.touches[0].pageY),
                U.subVectors($, W);
            var t = A.domElement === document ? A.domElement.body : A.domElement;
            i(2 * Math.PI * U.x / t.clientWidth * A.rotateSpeed),
                n(2 * Math.PI * U.y / t.clientHeight * A.rotateSpeed),
                W.copy($),
                A.update()
        }

        function E(e) {
            var t = e.touches[0].pageX - e.touches[1].pageX,
                o = e.touches[0].pageY - e.touches[1].pageY,
                i = Math.sqrt(t * t + o * o);
            q.set(0, i),
                Q.subVectors(q, X),
                Q.y > 0 ? s(a()) : Q.y < 0 && r(a()),
                X.copy(q),
                A.update()
        }

        function w(e) {
            Y.set(e.touches[0].pageX, e.touches[0].pageY),
                _.subVectors(Y, Z),
                ee(_.x, _.y),
                Z.copy(Y),
                A.update()
        }

        function P(e) {
            if (!1 !== A.enabled) {
                if (e.preventDefault(),
                    e.button === A.mouseButtons.ORBIT) {
                    if (!1 === A.enableRotate)
                        return;
                    l(e),
                        I = x.ROTATE
                } else if (e.button === A.mouseButtons.ZOOM) {
                    if (!1 === A.enableZoom)
                        return;
                    c(e),
                        I = x.DOLLY
                } else if (e.button === A.mouseButtons.PAN) {
                    if (!1 === A.enablePan)
                        return;
                    h(e),
                        I = x.PAN
                }
                I !== x.NONE && (document.addEventListener("mousemove", R, !1),
                    document.addEventListener("mouseup", T, !1),
                    A.dispatchEvent(F))
            }
        }

        function R(e) {
            if (!1 !== A.enabled)
                if (e.preventDefault(),
                    I === x.ROTATE) {
                    if (!1 === A.enableRotate)
                        return;
                    m(e)
                } else if (I === x.DOLLY) {
                if (!1 === A.enableZoom)
                    return;
                u(e)
            } else if (I === x.PAN) {
                if (!1 === A.enablePan)
                    return;
                d(e)
            }
        }

        function T(e) {
            !1 !== A.enabled && (document.removeEventListener("mousemove", R, !1),
                document.removeEventListener("mouseup", T, !1),
                A.dispatchEvent(B),
                I = x.NONE)
        }

        function H(e) {
            !1 === A.enabled || !1 === A.enableZoom || I !== x.NONE && I !== x.ROTATE || (e.preventDefault(),
                e.stopPropagation(),
                p(e),
                A.dispatchEvent(F),
                A.dispatchEvent(B))
        }

        function y(e) {
            !1 !== A.enabled && !1 !== A.enableKeys && !1 !== A.enablePan && g(e)
        }

        function D(e) {
            if (!1 !== A.enabled) {
                switch (e.touches.length) {
                case 1:
                    if (!1 === A.enableRotate)
                        return;
                    b(e),
                        I = x.TOUCH_ROTATE;
                    break;
                case 2:
                    if (!1 === A.enableZoom)
                        return;
                    f(e),
                        I = x.TOUCH_DOLLY;
                    break;
                case 3:
                    if (!1 === A.enablePan)
                        return;
                    v(e),
                        I = x.TOUCH_PAN;
                    break;
                default:
                    I = x.NONE
                }
                I !== x.NONE && A.dispatchEvent(F)
            }
        }

        function C(e) {
            if (!1 !== A.enabled)
                switch (e.preventDefault(),
                    e.stopPropagation(),
                    e.touches.length) {
                case 1:
                    if (!1 === A.enableRotate)
                        return;
                    if (I !== x.TOUCH_ROTATE)
                        return;
                    S(e);
                    break;
                case 2:
                    if (!1 === A.enableZoom)
                        return;
                    if (I !== x.TOUCH_DOLLY)
                        return;
                    E(e);
                    break;
                case 3:
                    if (!1 === A.enablePan)
                        return;
                    if (I !== x.TOUCH_PAN)
                        return;
                    w(e);
                    break;
                default:
                    I = x.NONE
                }
        }

        function M(e) {
            !1 !== A.enabled && (A.dispatchEvent(B),
                I = x.NONE)
        }

        function V(e) {
            e.preventDefault()
        }
        this.object = e,
            this.domElement = void 0 !== t ? t : document,
            this.enabled = !0,
            this.target = new THREE.Vector3,
            this.minDistance = 0,
            this.maxDistance = 1 / 0,
            this.minZoom = 0,
            this.maxZoom = 1 / 0,
            this.minPolarAngle = 0,
            this.maxPolarAngle = Math.PI,
            this.minAzimuthAngle = -1 / 0,
            this.maxAzimuthAngle = 1 / 0,
            this.enableDamping = !1,
            this.dampingFactor = .25,
            this.enableZoom = !0,
            this.zoomSpeed = 1,
            this.enableRotate = !0,
            this.rotateSpeed = 1,
            this.enablePan = !0,
            this.keyPanSpeed = 7,
            this.autoRotate = !1,
            this.autoRotateSpeed = 2,
            this.enableKeys = !0,
            this.keys = {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                BOTTOM: 40
            },
            this.mouseButtons = {
                ORBIT: THREE.MOUSE.LEFT,
                ZOOM: THREE.MOUSE.MIDDLE,
                PAN: THREE.MOUSE.RIGHT
            },
            this.target0 = this.target.clone(),
            this.position0 = this.object.position.clone(),
            this.zoom0 = this.object.zoom,
            this.getPolarAngle = function () {
                return k.phi
            },
            this.getAzimuthalAngle = function () {
                return k.theta
            },
            this.reset = function () {
                A.target.copy(A.target0),
                    A.object.position.copy(A.position0),
                    A.object.zoom = A.zoom0,
                    A.object.updateProjectionMatrix(),
                    A.dispatchEvent(L),
                    A.update(),
                    I = x.NONE
            },
            this.update = function () {
                var t = new THREE.Vector3,
                    a = (new THREE.Quaternion).setFromUnitVectors(e.up, new THREE.Vector3(0, 1, 0)),
                    n = a.clone().inverse(),
                    r = new THREE.Vector3,
                    s = new THREE.Quaternion;
                return function () {
                    var e = A.object.position;
                    return t.copy(e).sub(A.target),
                        t.applyQuaternion(a),
                        k.setFromVector3(t),
                        A.autoRotate && I === x.NONE && i(o()),
                        k.theta += O.theta,
                        k.phi += O.phi,
                        k.theta = Math.max(A.minAzimuthAngle, Math.min(A.maxAzimuthAngle, k.theta)),
                        k.phi = Math.max(A.minPolarAngle, Math.min(A.maxPolarAngle, k.phi)),
                        k.makeSafe(),
                        k.radius *= z,
                        k.radius = Math.max(A.minDistance, Math.min(A.maxDistance, k.radius)),
                        A.target.add(G),
                        t.setFromSpherical(k),
                        t.applyQuaternion(n),
                        e.copy(A.target).add(t),
                        A.object.lookAt(A.target), !0 === A.enableDamping ? (O.theta *= 1 - A.dampingFactor,
                            O.phi *= 1 - A.dampingFactor) : O.set(0, 0, 0),
                        z = 1,
                        G.set(0, 0, 0), !!(N || r.distanceToSquared(A.object.position) > j || 8 * (1 - s.dot(
                            A.object
                            .quaternion)) > j) && (A.dispatchEvent(L),
                            r.copy(A.object.position),
                            s.copy(A.object.quaternion),
                            N = !1, !0)
                }
            }(),
            this.dispose = function () {
                A.domElement.removeEventListener("contextmenu", V, !1),
                    A.domElement.removeEventListener("mousedown", P, !1),
                    A.domElement.removeEventListener("wheel", H, !1),
                    A.domElement.removeEventListener("touchstart", D, !1),
                    A.domElement.removeEventListener("touchend", M, !1),
                    A.domElement.removeEventListener("touchmove", C, !1),
                    document.removeEventListener("mousemove", R, !1),
                    document.removeEventListener("mouseup", T, !1),
                    window.removeEventListener("keydown", y, !1)
            };
        var A = this,
            L = {
                type: "change"
            },
            F = {
                type: "start"
            },
            B = {
                type: "end"
            },
            x = {
                NONE: -1,
                ROTATE: 0,
                DOLLY: 1,
                PAN: 2,
                TOUCH_ROTATE: 3,
                TOUCH_DOLLY: 4,
                TOUCH_PAN: 5
            },
            I = x.NONE,
            j = 1e-6,
            k = new THREE.Spherical,
            O = new THREE.Spherical,
            z = 1,
            G = new THREE.Vector3,
            N = !1,
            W = new THREE.Vector2,
            $ = new THREE.Vector2,
            U = new THREE.Vector2,
            Z = new THREE.Vector2,
            Y = new THREE.Vector2,
            _ = new THREE.Vector2,
            X = new THREE.Vector2,
            q = new THREE.Vector2,
            Q = new THREE.Vector2,
            K = function () {
                var e = new THREE.Vector3;
                return function (t, o) {
                    e.setFromMatrixColumn(o, 0),
                        e.multiplyScalar(-t),
                        G.add(e)
                }
            }(),
            J = function () {
                var e = new THREE.Vector3;
                return function (t, o) {
                    e.setFromMatrixColumn(o, 1),
                        e.multiplyScalar(t),
                        G.add(e)
                }
            }(),
            ee = function () {
                var e = new THREE.Vector3;
                return function (t, o) {
                    var a = A.domElement === document ? A.domElement.body : A.domElement;
                    if (A.object instanceof THREE.PerspectiveCamera) {
                        var i = A.object.position;
                        e.copy(i).sub(A.target);
                        var n = e.length();
                        n *= Math.tan(A.object.fov / 2 * Math.PI / 180),
                            K(2 * t * n / a.clientHeight, A.object.matrix),
                            J(2 * o * n / a.clientHeight, A.object.matrix)
                    } else
                        A.object instanceof THREE.OrthographicCamera ? (K(t * (A.object.right - A.object.left) /
                                A.object
                                .zoom / a.clientWidth, A.object.matrix),
                            J(o * (A.object.top - A.object.bottom) / A.object.zoom / a.clientHeight, A.object
                                .matrix)
                        ) : (console.warn(
                                "WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."
                            ),
                            A.enablePan = !1)
                }
            }();
        A.domElement.addEventListener("contextmenu", V, !1),
            A.domElement.addEventListener("mousedown", P, !1),
            A.domElement.addEventListener("wheel", H, !1),
            A.domElement.addEventListener("touchstart", D, !1),
            A.domElement.addEventListener("touchend", M, !1),
            A.domElement.addEventListener("touchmove", C, !1),
            window.addEventListener("keydown", y, !1),
            this.update()
    };
    THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;
    THREE.VRControls = function (e, t) {
        function o() {
            if (g.enabled) {
                var e = g.camera,
                    t = g.getVRState(),
                    o = g.manualRotation.clone();
                if (e) {
                    if (!t)
                        return void e.rotation.copy(o);
                    var a = new THREE.Euler,
                        i = t.hmd.rotation;
                    if (0 !== i[0] || 0 !== i[1] || 0 !== i[2] || 0 !== i[3]) {
                        var n = new THREE.Quaternion(i[0], i[1], i[2], i[3]);
                        (a = (new THREE.Euler).setFromQuaternion(n).reorder("YXZ")).y -= Math.PI / 2,
                            a.x += o.x,
                            a.y += o.y
                    } else
                        a = o;
                    e.rotation.copy(a)
                }
            }
        }

        function a() {
            requestAnimationFrame(a),
                o()
        }

        function i(e, t) {
            h = !0,
                m = e,
                d = g.manualRotation.y
        }

        function n(e, t) {
            h && g.enabled && (u = (e - m) * g.speed * .002 + d,
                g.manualRotation = new THREE.Euler(0, u, 0).reorder("YXZ"))
        }

        function r() {
            h = !1
        }

        function s(e) {
            e.preventDefault(),
                e.stopPropagation(),
                i(e.touches[0].pageX * g.speed * p, e.touches[0].pageY * g.speed * p)
        }

        function l(e) {
            e.preventDefault(),
                e.stopPropagation(),
                n(e.touches[0].pageX * g.speed * p, e.touches[0].pageY * g.speed * p)
        }

        function c(e) {
            e.preventDefault(),
                e.stopPropagation(),
                r()
        }
        var h = !1,
            m = 0,
            u = 0,
            d = 0;
        this.phoneVR = new PhoneVR,
            this.camera = e,
            this.manualRotation = new THREE.Euler,
            this.enabled = !1,
            this.speed = 1;
        var p = 3,
            g = this;
        ! function (e) {
            null !== e && void 0 !== e || (e = document),
                e.addEventListener("touchstart", s, !1),
                e.addEventListener("touchend", c, !1),
                e.addEventListener("touchmove", l, !1)
        }(t),
        a(),
            this.resetSensor = function () {
                var e = this._vrInput;
                if (!e)
                    return null;
                e.resetSensor()
            },
            this.getVRState = function () {
                var e, t = this._vrInput;
                if (t)
                    e = t.getState().orientation;
                else {
                    if (!this.phoneVR.rotationQuat())
                        return null;
                    e = this.phoneVR.rotationQuat()
                }
                return null === e ? null : {
                    hmd: {
                        rotation: [e.x, e.y, e.z, e.w]
                    }
                }
            }
    }
    THREE.StereoEffect = function (e) {
        var t = new THREE.StereoCamera;
        t.aspect = .5
        this.setEyeSeparation = function (e) {
            t.eyeSep = e
        };
        this.setSize = function (t, o) {
            e.setSize(t, o)
        };
        this.render = function (o, a) {
            o.updateMatrixWorld(),
                null === a.parent && a.updateMatrixWorld(),
                t.update(a);
            var i = e.getSize();
            e.clear(),
                e.setScissorTest(!0),
                e.setScissor(0, 0, i.width / 2, i.height),
                e.setViewport(0, 0, i.width / 2, i.height),
                e.render(o, t.cameraL),
                e.setScissor(i.width / 2, 0, i.width / 2, i.height),
                e.setViewport(i.width / 2, 0, i.width / 2, i.height),
                e.render(o, t.cameraR),
                e.setScissorTest(!1)
        }
    }
}
module.exports = rewrite();
