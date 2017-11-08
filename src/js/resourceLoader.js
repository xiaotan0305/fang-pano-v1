var AppParams = require('./appParams.js');
var Util = require('./util.js');
var ResourcesLoader = function () {};
ResourcesLoader.maxRunningNum = 5,
    ResourcesLoader.taskQueue = [],
    ResourcesLoader.runningTasks = [],
    ResourcesLoader.preparedResources = [],
    ResourcesLoader.textureLoader = void 0,
    ResourcesLoader.retryNum = 3,
    ResourcesLoader.getTextureLoader = function () {
        return ResourcesLoader.textureLoader || (ResourcesLoader.textureLoader = new THREE.TextureLoader),
            ResourcesLoader.textureLoader
    };
ResourcesLoader.Task = function (e, t, o, a) {
    this.url = e,
        this.onLoad = t,
        this.onProgress = o,
        this.onError = a;
    var i = this;
    this.run = function () {
        ResourcesLoader.loadTexture(this.url, function (e) {
            for (var t in ResourcesLoader.runningTasks)
                if (ResourcesLoader.runningTasks[t] === i) {
                    ResourcesLoader.runningTasks.splice(t, 1);
                    break
                }
            ResourcesLoader.runTasks(),
                i.onLoad && i.onLoad(e)
        }, this.onProgress, this.onError)
    }
};
ResourcesLoader.runTasks = function () {
    var e = ResourcesLoader.maxRunningNum - ResourcesLoader.runningTasks.length;
    if (0 !== e && 0 !== ResourcesLoader.taskQueue.length) {
        e = Math.min(e, ResourcesLoader.taskQueue.length);
        for (var t = 0; t < e; t++) {
            var o = ResourcesLoader.taskQueue.shift();
            ResourcesLoader.runningTasks.push(o),
                o.run()
        }
    }
};
ResourcesLoader.loadTexture = function (e, t, o, a) {
    function i(s) {
        if (r < ResourcesLoader.retryNum) {
            var l = ResourcesLoader.getTextureLoader().load(e, t, o, i);
            n.image = l.image,
                n.needsUpdate = !0,
                r++
        } else
            a && a(s)
    }
    var n = ResourcesLoader.preparedResources[e],
        r = 0;
    return n ? (delete ResourcesLoader.preparedResources[e],
            t && t(n)) : (e = e.replace("\\", "/"),
            n = ResourcesLoader.getTextureLoader().load(e, t, o, i)),
        n
};
ResourcesLoader.loadTextureInQueue = function (e, t, o, a) {
    var i = new ResourcesLoader.Task(e, t, o, a);
    ResourcesLoader.taskQueue.push(i),
        ResourcesLoader.runTasks()
};
ResourcesLoader.loadTextures = function (e, t, o, a, i) {
    for (var n = [], r = 0, s = function (i, s) {
            n[i] = s,
                ++r,
                t && t(e[i], s),
                a && a(parseInt(100 * r / e.length)),
                r === e.length && o && o(n)
        }, l = 0; l < e.length; ++l)
        n[l] = function (t) {
            return ResourcesLoader.loadTexture(e[t], function (e) {
                s(t, e)
            }, null, i)
        }(l);
    return n
};
ResourcesLoader.cancelTextures = function (e) {
    for (var t in e)
        ResourcesLoader.cancelTexture(e[t])
};
ResourcesLoader.cancelTexture = function (e) {
    e.image.src = "",
        e.dispose()
};
ResourcesLoader.prepareResources = function (e, t, o, a) {
    ResourcesLoader.loadTextures(e, function (e, t) {
        ResourcesLoader.preparedResources[e] = t
    }, t, o, a)
};
ResourcesLoader.getHouseViewData = function (e) {
    var t = AppParams.housePathPrefix + "ViewData.txt",
        o = AppParams.housePathPrefix + "SingleViewData.txt",
        a = AppParams.isSingleMode ? o : t;
    $.ajax({
        url: a,
        type: "get",
        dataType: "text",
        success: function (t) {
            try {
                var o = JSON.parse(t);
                o.ID = Util.getUrlParameter("hid"),
                    e(o)
            } catch (t) {
                e(null, -1)
            }
        },
        error: function (t) {
            AppParams.isSingleMode || 404 !== t.status ? e(null, t.status) : (AppParams.isSingleMode = !
                0,
                ResourcesLoader.getHouseViewData(e))
        }
    })
};
module.exports = ResourcesLoader;
