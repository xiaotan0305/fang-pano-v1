var Sim = require('./sim.js');
var VRManager = function () {
    Sim.Object.call(this);
    var e = new THREE.Object3D;
    this.setObject3D(e),
        this.createCrosshairRing = function () {
            var e = new THREE.Mesh(new THREE.RingGeometry(.02, .04, 32), new THREE.MeshBasicMaterial({
                color: 16777215,
                opacity: .5,
                transparent: !0
            }));
            return e.visible = !1,
                e.position.z = -2,
                e
        },
        this.showVRStartTip = function (e) {
            var t = $(DomElements.vrStartTip);
            e ? (DomElements.vrStartTip.style.visibility = "visible",
                t.stop(),
                clearTimeout(DomElements.vrStartTip.timeout),
                t.fadeIn(500, function () {
                    DomElements.vrStartTip.timeout = setTimeout(function () {
                        t.fadeOut(1500)
                    }, 2e3)
                })) : (t.stop(),
                t.hide())
        },
        this.enable = function (e) {
            this.object3D.visible = e,
                this.vrControls.resetSensor(),
                this.vrControls.enabled = e,
                this.vrControls.manualRotation = this.camera.rotation.clone(),
                e || this.enableVRMode(!1),
                this.isLandscape = Util.isLandscape(),
                this.showVRStartTip(e && !this.isLandscape)
        },
        this.enableVRMode = function (e) {
            EventListener.vrEnabled = e,
                this.crossHairRing.visible = e,
                this.isInVRMode = e,
                this.showVRStartTip(!e),
                e ? (this.previousFov = this.camera.fov,
                    this.camera.fov = VRParams.fov) : this.previousFov && (this.camera.fov = this.previousFov),
                this.camera.updateProjectionMatrix(),
                this.onVRModeEnabled(e),
                VRManager.isInVRMode = e
        },
        this.onVRModeEnabled = function (e) {}
}
VRManager.isInVRMode = !1,
    VRManager.prototype = new Sim.Object,
    VRManager.prototype.init = function (e) {
        this.scene = this.getScene(),
            this.renderer = this.getRenderer(),
            this.camera = e,
            this.vrControls = new THREE.VRControls(this.camera, this.renderer.domElement),
            this.vrEffect = new THREE.StereoEffect(this.renderer),
            this.vrEffect.setSize(Sim.screenWidth, Sim.screenHeight),
            this.isLandscape = Util.isLandscape(),
            this.isInVRMode = !1,
            this.crossHairRing = this.createCrosshairRing(),
            this.previousFov = null,
            this.camera.add(this.crossHairRing),
            this.setLayer(Layer.PanoramaManager)
    }
VRManager.prototype.update = function () {
    this.isLandscape ? (this.vrEffect.render(this.scene, this.camera),
        this.isInVRMode || this.enableVRMode(!0)) : this.isInVRMode && this.enableVRMode(!1)
}
VRManager.prototype.onWindowResize = function () {
    this.isLandscape = Util.isLandscape()
}
module.exports = VRManager;
