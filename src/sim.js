var Sim = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
};
Sim.Publisher = function () {
    this.messageTypes = {}
};
Sim.Publisher.prototype.subscribe = function (e, t, o) {
    var a = this.messageTypes[e];
    if (a) {
        if (-1 !== this.findSubscriber(a, t))
            return
    } else
        a = [],
        this.messageTypes[e] = a;
    a.push({
        subscriber: t,
        callback: o
    })
};
Sim.Publisher.prototype.unsubscribe = function (e, t, o) {
    if (t) {
        var a = this.messageTypes[e];
        if (a) {
            var i = this.findSubscriber(a, t, o); -
            1 !== i && this.messageTypes[e].splice(i, 1)
        }
    } else
        delete this.messageTypes[e]
};
Sim.Publisher.prototype.publish = function (e) {
    var t = this.messageTypes[e];
    if (t)
        for (var o = 0; o < t.length; o++) {
            for (var a = [], i = 0; i < arguments.length - 1; i++)
                a.push(arguments[i + 1]);
            t[o].callback.apply(t[o].subscriber, a)
        }
};
Sim.Publisher.prototype.findSubscriber = function (e, t) {
    for (var o = 0; o < e.length; o++)
        if (e[o] === t)
            return o;
    return -1
};
Sim.App = function () {
    Sim.Publisher.call(this),
        this.renderer = null,
        this.scene = null,
        this.objects = [],
        this.isWindowResized = !1
};
Sim.App.prototype = new Sim.Publisher,
    Sim.App.prototype.init = function (e) {
        e = e || {};
        this.container = e.container,
            this.renderer = e.renderer,
            this.container.appendChild(this.renderer.domElement),
            this.scene = e.scene,
            this.scene.data = this;
        var t = new THREE.Object3D;
        t.name = "root",
            this.scene.add(t),
            this.root = t
    };
Sim.App.prototype.run = function () {
    this.update();
    var e = this;
    requestAnimationFrame(function () {
        e.run()
    })
};
Sim.App.prototype.update = function () {
    Sim.screenWidth === window.innerWidth && Sim.screenHeight === window.innerHeight || (Sim.screenWidth = window.innerWidth,
        Sim.screenHeight = window.innerHeight,
        this.isWindowResized = !0,
        this.onWindowResize());
    var e, t;
    for (t = this.objects.length,
        e = 0; e < t; e++)
        this.isWindowResized && this.objects[e].onWindowResize(),
        this.objects[e].object3D.visible && isAllParentVisible(this.objects[e].object3D) && this.objects[e].update(),
        this.objects[e].updateChildren();
    this.isWindowResized = !1
};
var isAllParentVisible = function (e) {
    var t = !0;
    return e.parent && (t = !!e.parent.visible && isAllParentVisible(e.parent)),
        t
};
Sim.App.prototype.addObject = function (e) {
    this.objects.push(e),
        e.object3D && this.root.add(e.object3D)
};
Sim.App.prototype.removeObject = function (e) {
    var t = this.objects.indexOf(e); -
    1 !== t && (this.objects.splice(t, 1),
        e.object3D && this.root.remove(e.object3D))
};
Sim.App.prototype.onWindowResize = function () {};
Sim.Object = function () {
    Sim.Publisher.call(this),
        this.object3D = null,
        this.children = []
};
Sim.Object.prototype = new Sim.Publisher,
    Sim.Object.prototype.init = function () {};
Sim.Object.prototype.onWindowResize = function () {};
Sim.Object.prototype.update = function () {};
Sim.Object.prototype.setVisible = function (e) {
    this.setVisibleIncludeChildren(this.object3D, e)
};
Sim.Object.prototype.setVisibleIncludeChildren = function (e, t) {
    function o(e, t) {
        e.visible = t;
        var a, i = e.children.length;
        for (a = 0; a < i; a++)
            o(e.children[a], t)
    }
    e && o(e, t)
};
Sim.Object.prototype.setLayer = function (e) {
    function t(e, o) {
        e.layers.set(o);
        var a, i = e.children.length;
        for (a = 0; a < i; a++)
            t(e.children[a], o)
    }
    this.object3D && t(this.object3D, e)
};
Sim.Object.prototype.updateChildren = function () {
    var e, t;
    for (t = this.children.length,
        e = 0; e < t; e++)
        this.isWindowResized && this.children[e].onWindowResize(),
        this.children[e].object3D.visible && isAllParentVisible(this.children[e].object3D) && this.children[e].update(),
        this.children[e].updateChildren()
};
Sim.Object.prototype.setObject3D = function (e) {
    e.data = this,
        this.object3D = e
};
Sim.Object.prototype.addChild = function (e) {
    this.children.push(e),
        e.object3D && this.object3D.add(e.object3D)
};
Sim.Object.prototype.removeChild = function (e) {
    var t = this.children.indexOf(e); -
    1 !== t && (this.children.splice(t, 1),
        e.object3D && this.object3D.remove(e.object3D))
};
Sim.Object.prototype.getScene = function () {
    var e = null;
    if (this.object3D) {
        for (var t = this.object3D; t.parent;)
            t = t.parent;
        e = t
    }
    return e
};
Sim.Object.prototype.getApp = function () {
    var e = this.getScene();
    return e ? e.data : null
};
Sim.Object.prototype.getRenderer = function () {
    var e = this.getApp();
    return e ? e.renderer : null
}
module.exports = Sim;