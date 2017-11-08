var Stats = function () {
    function e(e) {
        return a.appendChild(e.dom),
            e
    }
    function t(e) {
        for (var t = 0; t < a.children.length; t++)
            a.children[t].style.display = t === e ? "block" : "none";
        o = e
    }
    var o = 0
        , a = document.createElement("div");
    a.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",
        a.add("click", function (e) {
            e.preventDefault(),
                t(++o % a.children.length)
        }, !1);
    var i = (performance || Date).now()
        , n = i
        , r = 0
        , s = e(new Stats.Panel("FPS", "#0ff", "#002"))
        , l = e(new Stats.Panel("MS", "#0f0", "#020"));
    if (self.performance && self.performance.memory)
        var c = e(new Stats.Panel("MB", "#f08", "#201"));
    return t(0),
        {
            REVISION: 16,
            dom: a,
            addPanel: e,
            showPanel: t,
            begin: function () {
                i = (performance || Date).now()
            },
            end: function () {
                r++;
                var e = (performance || Date).now();
                if (l.update(e - i, 200),
                    e > n + 1e3 && (s.update(1e3 * r / (e - n), 100),
                        n = e,
                        r = 0,
                        c)) {
                    var t = performance.memory;
                    c.update(t.usedJSHeapSize / 1048576, t.jsHeapSizeLimit / 1048576)
                }
                return e
            },
            update: function () {
                i = this.end()
            },
            domElement: a,
            setMode: t
        }
};
Stats.Panel = function (e, t, o) {
    var a = 1 / 0
        , i = 0
        , n = Math.round
        , r = n(window.devicePixelRatio || 1)
        , s = 80 * r
        , l = 48 * r
        , c = 3 * r
        , h = 2 * r
        , m = 3 * r
        , u = 15 * r
        , d = 74 * r
        , p = 30 * r
        , g = document.createElement("canvas");
    g.width = s,
        g.height = l,
        g.style.cssText = "width:80px;height:48px";
    var b = g.getContext("2d");
    return b.font = "bold " + 9 * r + "px Helvetica,Arial,sans-serif",
        b.textBaseline = "top",
        b.fillStyle = o,
        b.fillRect(0, 0, s, l),
        b.fillStyle = t,
        b.fillText(e, c, h),
        b.fillRect(m, u, d, p),
        b.fillStyle = o,
        b.globalAlpha = .9,
        b.fillRect(m, u, d, p),
        {
            dom: g,
            update: function (l, f) {
                a = Math.min(a, l),
                    i = Math.max(i, l),
                    b.fillStyle = o,
                    b.globalAlpha = 1,
                    b.fillRect(0, 0, s, u),
                    b.fillStyle = t,
                    b.fillText(n(l) + " " + e + " (" + n(a) + "-" + n(i) + ")", c, h),
                    b.drawImage(g, m + r, u, d - r, p, m, u, d - r, p),
                    b.fillRect(m + d - r, u, r, p),
                    b.fillStyle = o,
                    b.globalAlpha = .9,
                    b.fillRect(m + d - r, u, r, n((1 - l / f) * p))
            }
        }
};
module.exports = Stats;