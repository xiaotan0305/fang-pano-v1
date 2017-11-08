var TextHelper = function () {}
TextHelper.createTextSprite = function (e, t) {
    var o = createTextTexture(e, t),
        a = new THREE.SpriteMaterial({
            map: o
        }),
        i = new THREE.Sprite(a);
    return i.scale.set(o.scaleX, o.scaleY, 1),
        i.defaultScale = (new THREE.Vector3).copy(i.scale),
        i
}

function createTextTexture(e, t) {
    void 0 === t && (t = {});
    var o = t.hasOwnProperty("fontface") ? t.fontface : "Arial"
        , a = t.hasOwnProperty("fontsize") ? t.fontsize : 18
        , i = t.hasOwnProperty("borderThickness") ? t.borderThickness : 0
        , n = t.hasOwnProperty("borderColor") ? t.borderColor : {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        }
        , r = t.hasOwnProperty("backgroundColor") ? t.backgroundColor : {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
        , s = t.hasOwnProperty("cornerAngle") ? t.cornerAngle : 10
        , l = document.createElement("canvas");
    l.width = 20 * a,
        l.height = 1.7 * a;
    var c = l.getContext("2d");
    c.font = "normal " + a + "px " + o,
        c.textAlign = "center",
        c.textBaseline = "middle";
    var h = c.measureText(e).width
        , m = (l.width + i) / 2
        , u = (l.height + i) / 2;
    c.fillStyle = "rgba(" + r.r + "," + r.g + "," + r.b + "," + r.a + ")",
        c.strokeStyle = "rgba(" + n.r + "," + n.g + "," + n.b + "," + n.a + ")",
        c.lineWidth = i;
    var d = 1.25 * a + 15;
    roundRect(c, (l.width - h - d) / 2, 0, h + d, l.height, s),
        c.fillStyle = "rgba(255, 255, 255, 1.0)",
        c.fillText(e, m, u);
    var p = new THREE.Texture(l);
    return p.minFilter = THREE.LinearFilter,
        p.needsUpdate = !0,
        p.parameters = t,
        p.scaleX = .05 * l.width,
        p.scaleY = .05 * l.height,
        p
}
function roundRect(e, t, o, a, i, n) {
    e.beginPath(),
        e.moveTo(t + n, o),
        e.lineTo(t + a - n, o),
        e.quadraticCurveTo(t + a, o, t + a, o + n),
        e.lineTo(t + a, o + i - n),
        e.quadraticCurveTo(t + a, o + i, t + a - n, o + i),
        e.lineTo(t + n, o + i),
        e.quadraticCurveTo(t, o + i, t, o + i - n),
        e.lineTo(t, o + n),
        e.quadraticCurveTo(t, o, t + n, o),
        e.closePath(),
        e.fill(),
        e.stroke()
}
module.exports = TextHelper;
