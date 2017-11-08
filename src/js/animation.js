var Animation = function (e, t, o, a) {
    var i = this,
        n = o;
    this._onFinished = a,
        this.isPlaying = !1,
        this.animationFrame = null,
        this.progress = 0,
        this.params = e,
        this.duration = t || 0,
        this.startTime = null,
        this.innerLoop = function () {
            if (this.isPlaying) {
                var e = (new Date).getTime(),
                    t = 0;
                this.duration > 0 && (t = (e - this.startTime) / this.duration),
                    t >= 1 ? (t = 1,
                        this.progress = t,
                        n && n(this.params, t),
                        this.update(this.params, t),
                        this.stop()) : (this.progress = t,
                        n && n(this.params, t),
                        this.update(this.params, t),
                        this.animationFrame = requestAnimationFrame(function () {
                            i.innerLoop()
                        }))
            }
        }
}

Animation.prototype.update = function (e, t) {}

Animation.prototype.play = function () {
    return this.isPlaying = !0,
        this.startTime = (new Date).getTime(),
        this.innerLoop(),
        this
}

Animation.prototype.stop = function () {
    this.isPlaying && (this.isPlaying = !1,
        this.animationFrame && (cancelAnimationFrame(this.animationFrame),
            this.animationFrame = void 0),
        this._onFinished && this._onFinished(this.params),
        this.onFinished(this.params))
}

Animation.prototype.onFinished = function (e) {}

module.exports = Animation;