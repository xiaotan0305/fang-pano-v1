var Sim = require('./sim.js');
var isAllParentVisible = function (e) {
    var t = !0;
    return e.parent && (t = !!e.parent.visible && isAllParentVisible(e.parent)),
        t
};
var Event = function () {
    this.onclick = function (e) {};
    this.object3D = null;
    this.camera = null;
    this.pressDownTime = null;
    this.enabled = !0;
    this.findCamera = function () {
        if (!this.camera) {
            for (var e = this.object3D; e.parent;)
                e = e.parent;
            this.camera = EventListener.findCamera(e, this.object3D.layers.mask)
        }
        return this.camera
    };
    this.process = function (e, t, o) {
        if ("touchstart" === e.type || "mousedown" === e.type)
            this.isIntersect(e, t, o) && (this.pressDownTime = (new Date).getTime());
        else if (("touchend" === e.type || "mouseup" === e.type) && this.isIntersect(e, t, o)) {
            var a = (new Date).getTime();
            this.pressDownTime && a - this.pressDownTime < 200 && this.onclick(this.object3D)
        }
    };
    this.getFirstIntersect = function (e, t, o, a) {
        var i = this.getIntersects(e, t, o, a);
        return i.length > 0 ? i[0] : null
    };
    this.getIntersects = function (e, t, o, a) {
        var i = a ? new THREE.Vector2 : this.getMousePosition(e, o);
        if (i.x < -1 || i.x > 1 || i.y < -1 || i.y > 1)
            return [];
        if (!this.object3D.visible || !this.isAllParentVisible(this.object3D))
            return [];
        t.setFromCamera(i, this.camera);
        var n = [];
        n.push(this.object3D);
        for (var r = 0; r < this.object3D.children.length; r++)
            n.push(this.object3D.children[r]);
        return t.intersectObjects(n, !0)
    };
    this.isIntersect = function (e, t, o) {
        return this.getIntersects(e, t, o).length > 0
    };
    this.isAllParentVisible = function (e) {
        var t = !0;
        return e.parent && (t = !!e.parent.visible && isAllParentVisible(e.parent)),
            t
    };
    this.getMousePosition = function (e, t) {
        var o = 0,
            a = 0;
        if ("touchstart" === e.type ? (o = e.touches[0].pageX,
                a = e.touches[0].pageY) : "touchend" === e.type ? (o = e.changedTouches[0].pageX,
                a = e.changedTouches[0].pageY) : (o = e.clientX,
                a = e.clientY),
            o /= t.clientWidth,
            a /= t.clientHeight,
            this.camera.viewPort) {
            var i = this.camera.viewPort.left / Sim.screenWidth,
                n = this.camera.viewPort.top / Sim.screenHeight;
            o = (o - i) / (this.camera.viewPort.width / Sim.screenWidth),
                a = (a - n) / (this.camera.viewPort.height / Sim.screenHeight)
        }
        var r = new THREE.Vector2;
        return r.x = 2 * o - 1,
            r.y = 2 * -a + 1,
            r
    };
};
var EventListener = function () {};
EventListener.events = [],
    EventListener.vrEnabled = !1,
    EventListener.listen = function (e) {
        function t() {
            EventListener.vrEnabled ? o() : (s = null,
                    null !== r && (clearTimeout(r),
                        r = null)),
                requestAnimationFrame(t)
        }

        function o() {
            var e = i(null, n, !0);
            s !== e && (clearTimeout(r),
                    null !== e && (r = setTimeout(function () {
                        e.onclick(e.object3D)
                    }, VRParams.gazeTime))),
                s = e
        }

        function a(t) {
            var o = i(t, n);
            o && o.process(t, n, e)
        }

        function i(t, o, a) {
            for (var i = null, n = null, r = 0; r < EventListener.events.length; r++) {
                var s = EventListener.events[r];
                if (s.findCamera()) {
                    if (s.enabled) {
                        var l = s.getFirstIntersect(t, o, e, a);
                        l && (!n || l.distance < n) && (i = s,
                            n = l.distance)
                    }
                } else
                    console.log("No render camera")
            }
            return i
        }
        var n = new THREE.Raycaster,
            r = null,
            s = null;
        document.attachEvent ? (e.attachEvent("touchstart", a, !1),
                e.attachEvent("touchend", a, !1),
                e.attachEvent("mousedown", a, !1),
                e.attachEvent("mouseup", a, !1)) : (e.addEventListener("touchstart", a, !1),
                e.addEventListener("touchend", a, !1),
                e.addEventListener("mousedown", a, !1),
                e.addEventListener("mouseup", a, !1)),
            t()
    },
    EventListener.findCamera = function (e, t) {
        if (-1 !== e.type.indexOf("Camera") && e.layers.mask === t)
            return e;
        for (var o = null, a = e.children, i = 0; i < a.length && null === (o = EventListener.findCamera(a[i], t)); i++)
        ;
        return o
    },
    EventListener.get = function (e) {
        for (var t = 0; t < EventListener.events.length; t++)
            if (EventListener.events[t].object3D === e)
                return EventListener.events[t];
        var o = new Event;
        return o.object3D = e,
            EventListener.events.push(o),
            o
    },
    module.exports = EventListener
