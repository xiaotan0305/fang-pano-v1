var Sim = require('./sim.js');
var AppParams = require('./appParams.js');
var ResourcesLoader = require('./resourceLoader.js');
var PanoramaControls = require('./PanoramaControls.js');
var Animation = require('./animation.js');
var TextHelper = require('./textHelper.js');
var EventListener = require('./eventListener.js');
var DomElements = require('./domElements.js');
var Layer = require('./layer.js');
var VRManager = require('./vrManager.js');

var BlurLoadingAnimation = function () {
    var e = {
        duration: 350
    };
    this.setCubeOpacity = function (e, t) {
            for (var o = 0; o < e.material.length; o++)
                e.material[o].opacity = t
        },
        this.setCubeTransparent = function (e, t) {
            for (var o = 0; o < e.material.length; o++)
                e.material[o].transparent = t,
                e.material[o].depthWrite = t
        },
        Animation.call(this, e, e.duration)
};
BlurLoadingAnimation.prototype = new Animation,
    BlurLoadingAnimation.prototype.play = function (e, t, o, a) {
        var i = {
            blurPanoramaCube: e,
            clearPanoramaCube: t,
            startOpacity: o,
            onFinished: a
        };
        this.params = Object.assign(this.params, i),
            this.params.duration = o * this.params.duration,
            Animation.prototype.play.call(this)
    };
BlurLoadingAnimation.prototype.update = function (e, t) {
    var o = e.startOpacity * (1 - t);
    this.setCubeOpacity(e.blurPanoramaCube, o),
        e.clearPanoramaCube.visible || (e.clearPanoramaCube.visible = !0,
            e.clearPanoramaCube.rotation.copy(e.blurPanoramaCube.rotation),
            e.clearPanoramaCube.scale.set(2, 2, 2),
            e.blurPanoramaCube.scale.set(1, 1, 1),
            this.setCubeTransparent(e.blurPanoramaCube, !0),
            this.setCubeTransparent(e.clearPanoramaCube, !1),
            this.setCubeOpacity(e.clearPanoramaCube, 1))
};
BlurLoadingAnimation.prototype.onFinished = function (e) {
    e.blurPanoramaCube.visible = !1,
        this.setCubeTransparent(e.blurPanoramaCube, !0),
        this.setCubeTransparent(e.clearPanoramaCube, !0),
        e.onFinished && e.onFinished(e)
};
var PanoramaManager = function () {
    function e(e, t) {
        for (var o = 0; o < t.length; o++)
            e.material[o].map = t[o]
    }

    function t(e, t) {
        for (var o = 0; o < e.material.length; o++)
            e.material[o].opacity = t
    }

    function o() {
        AppParams.isPhone || n.isRotationTipShowed || ($(DomElements.rotationTip).fadeIn(2e3, function () {
                setTimeout(function () {
                    $(DomElements.rotationTip).fadeOut(1500)
                }, 1500)
            }),
            n.isRotationTipShowed = !0)
    }

    function a(e) {
        for (var t = 0; t < e.material.length; t++)
            null !== e.material[t].map && (e.material[t].map.dispose(),
                e.material[t].map = null)
    }
    Sim.Object.call(this);
    var i = new THREE.Object3D;
    this.setObject3D(i);
    var n = this;
    this.setHighlightHotSpotPosition = function () {};
    this.onCameraRotate = function () {};
    this.onStartLoadPanoramaImage = function (e) {};
    this.createPanoramaCube = function () {
        for (var e = [], t = 0; t < 6; t++)
            e.push(new THREE.MeshBasicMaterial({
                side: THREE.BackSide,
                transparent: !0,
                alphaTest: .1,
                depthWrite: !0
            }));
        var o = new THREE.Mesh(new THREE.CubeGeometry(1e4, 1e4, 1e4), e);
        return o.rotation.reorder("YXZ"),
            o
    }
    this.createLogoPlane = function () {
        var e = ResourcesLoader.loadTexture("src/images/logo.png");
        this.texture = e,
            e.minFilter = THREE.NearestFilter;
        var t = new THREE.PlaneBufferGeometry(PanoramaParams.logoSize, PanoramaParams.logoSize, 1, 1),
            o = new THREE.MeshBasicMaterial({
                map: e,
                transparent: !0,
                alphaTest: .5
            }),
            a = new THREE.Mesh(t, o);
        return a.rotation.x = THREE.Math.degToRad(270),
            a.position.y = -400,
            a
    }
    this.getBlurPanoramaImageUrls = function (e) {
        var t = [];
        if (e.BlurTileImagesPath && e.BlurTileImagesPath.length >= 6)
            for (var o in e.TileImagesPath)
                t.push(AppParams.housePathPrefix + e.BlurTileImagesPath[o]);
        return t
    }
    this.getPanoramaImageUrls = function (e) {
        var t = [];
        for (var o in e.TileImagesPath)
            t.push(AppParams.housePathPrefix + e.TileImagesPath[o]);
        return t
    }
    this.loadPanoramaImage = function (t, o, i) {
        if (this.isAnyHotSpotLoaded || (this.isAnyHotSpotLoaded = !0),
            this.currentHotSpotID !== t.ID && !n.isLoadingPanoramaImage) {
            this.isLoadingPanoramaImage = !0,
                this.currentHotSpotID = t.ID,
                this.onStartLoadPanoramaImage(t.ID);
            var r;
            !t.cached && AppParams.enableBlurLoading ? (DomElements.loading.style.visibility = "visible",
                r = this.getBlurPanoramaImageUrls(t),
                ResourcesLoader.loadTextures(r, null, function (r) {
                    n.onPanoramaImageLoad(r, t, o, i),
                        n.loadingClearTextures = ResourcesLoader.loadTextures(n.getPanoramaImageUrls(t),
                            null,
                            function (o) {
                                t.cached = !0,
                                    n.loadingClearTextures = null,
                                    n.cubeFadeAnimation.isPlaying ? n.cubeFadeAnimation.progress >= .5 &&
                                    (n.cubeFadeAnimation.stop(),
                                        e(n.cubeFadeAnimation.params.visibleCube, o),
                                        n.blurLoadingAnimation.play(n.cubeFadeAnimation.params.invisibleCube,
                                            n.cubeFadeAnimation.params.visibleCube, n.cubeFadeAnimation
                                            .params.invisibleCube.material[0].opacity)) : (e(n.cubeFadeAnimation
                                            .params.visibleCube, o),
                                        n.blurLoadingAnimation.play(n.cubeFadeAnimation.params.invisibleCube,
                                            n.cubeFadeAnimation.params.visibleCube, n.cubeFadeAnimation
                                            .params.invisibleCube.material[0].opacity,
                                            function (e) {
                                                a(e.blurPanoramaCube)
                                            }))
                            })
                }, null, null)) : (t.cached || (DomElements.loading.style.visibility = "visible"),
                r = this.getPanoramaImageUrls(t),
                ResourcesLoader.loadTextures(r, null, function (e) {
                    t.cached = !0,
                        n.onPanoramaImageLoad(e, t, o, i)
                }, null, null))
        }
    };
    this.onPanoramaImageLoad = function (t, o, a, i) {
        DomElements.loading.style.visibility = "hidden",
            this.stopCubeFadeAnimation(),
            this.blurLoadingAnimation.stop(),
            n.loadingClearTextures && (ResourcesLoader.cancelTextures(n.loadingClearTextures),
                n.loadingClearTextures = null);
        var r = this.panoramaCube1.visible ? this.panoramaCube1 : this.panoramaCube2,
            s = this.panoramaCube1.visible ? this.panoramaCube2 : this.panoramaCube1;
        s.name = o.Name;
        var l = !this.panoramaCube1.visible && !this.panoramaCube2.visible;
        this.playCubeFadeAnimation(r, s, o, l, a, i),
            e(s, t),
            o.Rotation && s.rotation.set(THREE.Math.degToRad(o.Rotation.x), THREE.Math.degToRad(180 - o.Rotation
                .y), THREE.Math.degToRad(-o.Rotation.z)),
            AppParams.isSingleMode || (this.setHighlightHotSpotPosition(o),
                this.setPositionsToHotSpot(o));
        for (var c in this.hotSpotGroups) {
            var h = (new THREE.Vector3).subVectors(this.camera.position, this.hotSpotGroups[c].position);
            this.hotSpotGroups[c].thetaX = Math.atan2(h.z, h.y),
                this.hotSpotGroups[c].thetaY = Math.atan2(h.z, h.x)
        }
        this.hotSpotGroups && (this.clickedHotSpotGroup = this.hotSpotGroups[o.ID]),
            this.isLoadingPanoramaImage = !1
    };
    this.createCamera = function () {
        var e = Sim.screenWidth / Sim.screenHeight,
            t = new THREE.PerspectiveCamera(PanoramaParams.defaultFov, e, .5, 1e5);
        return t.name = "PanoramaManager",
            t.rotation.reorder("YXZ"),
            t
    };
    this.addPanoramaControlsToCamera = function (e) {
        var t = new PanoramaControls(e, this.renderer.domElement);
        return t.onCameraRotate = function () {
                n.onCameraRotate()
            },
            t
    };
    this.createHotSpotGroup = function (e, t) {
        function o() {
            var e = Date.now() / 1e3,
                t = 1.2 + .2 * Math.sin(5 * e),
                a = .25 * t;
            r.scale.set(a, a, a);
            var i = .6 * t;
            s.scale.set(i, i, i);
            var n = t;
            l.scale.set(n, n, n),
                requestAnimationFrame(o)
        }
        var a = new THREE.Group;
        a.hotSpotData = e,
            a.name = e.Name,
            a.visible = !1;
        var i = e.Position.y - 20;
        a.position.set(e.Position.x, i, -e.Position.z);
        var n = new THREE.Sprite(new THREE.SpriteMaterial({
            opacity: 0
        }));
        n.name = "spriteGroup",
            a.add(n),
            n.scale.set(10, 10, 1);
        var r = new THREE.Sprite(new THREE.SpriteMaterial({
            map: t,
            opacity: 1
        }));
        n.add(r),
            r.scale.set(.25, .25, 1);
        var s = new THREE.Sprite(new THREE.SpriteMaterial({
            map: t,
            opacity: .6
        }));
        n.add(s),
            s.scale.set(.75, .75, 1);
        var l = new THREE.Sprite(new THREE.SpriteMaterial({
            map: t,
            opacity: .2
        }));
        if (n.add(l),
            l.scale.set(1, 1, 1),
            o(),
            AppParams.displayRoomName) {
            var c = TextHelper.createTextSprite(e.Name, {
                fontsize: 80,
                backgroundColor: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: .5
                },
                cornerAngle: 75,
                borderColor: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                }
            });
            c.name = "hotSpotNameSprite",
                a.add(c),
                c.y = 7.5,
                c.position.set(0, c.y, 0)
        }
        return a
    };
    this.registEventListener = function () {
        for (var e in this.hotSpotGroups)
            EventListener.get(this.hotSpotGroups[e]).onclick = this.onHotSpotClicked
    };
    this.onHotSpotClicked = function (e) {
        n.loadPanoramaImage(e.hotSpotData)
    };
    this.hideAllHotSpotGoups = function () {
        for (var e in this.hotSpotGroups)
            this.setVisibleIncludeChildren(this.hotSpotGroups[e], !1)
    };
    this.showVisibleHotSpotGroups = function (e) {
        for (var t in e.VisibleHotSpotIds) {
            var o = this.hotSpotGroups[e.VisibleHotSpotIds[t]];
            this.setVisibleIncludeChildren(o, !0)
        }
    };
    this.onZoomInClicked = function () {
        this.onZoomBtnClicked(!0)
    };
    this.onZoomOutClicked = function () {
        this.onZoomBtnClicked(!1)
    };
    this.onZoomBtnClicked = function (e) {
        e && this.camera.fov === PanoramaParams.minFov || (e || this.camera.fov !== PanoramaParams.maxFov) && (
            this.cameraZoomAnimation && this.cameraZoomAnimation.isPlaying || (this.targetZoomFov = e ?
                this.camera.fov - this.zoomDelta : this.camera.fov + this.zoomDelta,
                this.targetZoomFov = Math.max(PanoramaParams.minFov, Math.min(PanoramaParams.maxFov, this.targetZoomFov)),
                this.playCameraZoomAnimation(this.camera.fov)))
    };
    this.onSwitchFullScreen = function () {
        if (AppParams.isFullScreenInNewTab)
            window.open(window.location.href.replace("&fsnewtab=true", ""));
        else {
            var e = !DomElements.fullScreenButton.isFullScreen;
            DomElements.fullScreenButton.isFullScreen = e,
                DomElements.fullScreenButton.style.backgroundImage = "url(images/" + (e ? "exitFullScreen" :
                    "fullScreen") + ".png)",
                Util.setFullScreen(e)
        }
    };
    this.playCubeFadeAnimation = function (e, i, r, s, l, c) {
        function h(e) {
            if (e.showBestCameraView && e.hotSpotData.BestCameraView) {
                var t = -e.hotSpotData.BestCameraView.x,
                    o = -e.hotSpotData.Rotation.y - e.hotSpotData.BestCameraView.y;
                (t = (t + 360) % 360) > 180 && (t -= 360),
                    o = (o + 360) % 360,
                    n.camera.rotation.x = THREE.Math.degToRad(t),
                    n.camera.rotation.y = THREE.Math.degToRad(o),
                    n.camera.rotation.x = 0
            }
        }
        var m = {
            duration: 1e3,
            beginFov: n.camera.fov,
            fadeInFov: n.camera.fov + 1,
            visibleCube: e,
            invisibleCube: i,
            hotSpotData: r,
            isHotSpotsShowed: !1,
            onlyFadeOut: s,
            isStartFadeOut: !1,
            showBestCameraView: l,
            isAutoRotate: c
        };
        VRManager.isInVRMode && (m.duration = 1),
            this.cubeFadeAnimation ? (this.cubeFadeAnimation.params = m,
                this.cubeFadeAnimation.duration = m.duration) : this.cubeFadeAnimation = new Animation(m, m.duration,
                function (e, o) {
                    function a(e, o) {
                        e.invisibleCube.visible = !0,
                            t(e.invisibleCube, o),
                            n.camera.fov = e.fadeInFov + (n.targetZoomFov - e.fadeInFov) * o,
                            o > .1 && !e.isHotSpotsShowed && (n.hotSpotGroups && n.showVisibleHotSpotGroups(e.hotSpotData),
                                e.isHotSpotsShowed = !0),
                            e.isStartFadeOut || (e.isStartFadeOut = !0,
                                h(e))
                    }
                    e.onlyFadeOut ? a(e, o) : o <= .5 ? (o *= 2,
                            t(e.visibleCube, 1 - o),
                            n.camera.fov = e.beginFov + (e.fadeInFov - e.beginFov) * o) : a(e, o = 2 * (o - .5)),
                        n.camera.updateProjectionMatrix()
                },
                function (e) {
                    e.visibleCube.visible = !1,
                        t(e.visibleCube, 0),
                        e.invisibleCube.visible = !0,
                        t(e.invisibleCube, 1),
                        a(e.visibleCube),
                        n.camera.fov = n.targetZoomFov,
                        n.panoramaControls.isAutoPlay = e.isAutoRotate,
                        o()
                }
            ),
            this.hideAllHotSpotGoups(),
            this.cubeFadeAnimation.play()
    };
    this.stopCubeFadeAnimation = function () {
        this.cubeFadeAnimation && this.cubeFadeAnimation.isPlaying && this.cubeFadeAnimation.stop()
    };
    this.playCameraZoomAnimation = function (e) {
        var t = {
            beginFov: e
        };
        this.cameraZoomAnimation ? this.cameraZoomAnimation.params = t : this.cameraZoomAnimation = new Animation(
            t, 350,
            function (e, t) {
                n.camera.fov = e.beginFov + (n.targetZoomFov - e.beginFov) * t,
                    n.camera.updateProjectionMatrix()
            },

            function () {
                n.camera.fov = n.targetZoomFov,
                    n.camera.updateProjectionMatrix(),
                    n.camera.fov === PanoramaParams.minFov ? $(DomElements.zoomInButton).addClass(
                        "disabled") : $(DomElements.zoomInButton).removeClass("disabled"),
                    n.camera.fov === PanoramaParams.maxFov ? $(DomElements.zoomOutButton).addClass(
                        "disabled") : $(DomElements.zoomOutButton).removeClass("disabled")
            }
        );
        this.cameraZoomAnimation.play()
    };
    this.setPositionsToHotSpot = function (e) {
        var t = (new THREE.Vector3).copy(e.Position);
        t.z = -t.z,
            this.camera.position.copy(t),
            this.panoramaCube1.position.copy(t),
            this.panoramaCube2.position.copy(t),
            this.logoPlane.position.set(e.Position.x, -400, -e.Position.z)
    };
    this.updateCameraRotation = function (e) {
        this.camera.rotation.setFromVector3(e)
    };
    this.setTargetZoomFov = function (e) {
        e && (this.targetZoomFov = e)
    };
    this.updateHotSpotScale = function () {
        if (this.clickedHotSpotGroup)
            for (var e in this.clickedHotSpotGroup.hotSpotData.VisibleHotSpotIds) {
                var t = this.hotSpotGroups[this.clickedHotSpotGroup.hotSpotData.VisibleHotSpotIds[e]];
                if (t) {
                    var o = this.camera.position.distanceTo(t.position),
                        a = Math.abs(o * Math.sin(this.camera.rotation.y + t.thetaY) * Math.cos(this.camera.rotation
                            .x / 2));
                    t.getObjectByName("spriteGroup").scale.set(.08 * a, .08 * a, 1);
                    var i = t.getObjectByName("hotSpotNameSprite");
                    i && (i.position.y = i.y * a * .015,
                        i.scale.set(i.material.map.scaleX * a * .015, i.material.map.scaleY * a * .015, 1),
                        i.material.rotation = -n.camera.rotation.z)
                }
            }
    }
}
PanoramaManager.getPanoramaImageUrls = function (e) {
    var t = [];
    for (var o in e.TileImagesPath)
        AppParams.enableBlurLoading && !e.cached ? t.push(AppParams.housePathPrefix + e.BlurTileImagesPath[o]) : t.push(
            AppParams.housePathPrefix + e.TileImagesPath[o]);
    return t
}
PanoramaManager.getPrepareResourceUrls = function (e) {
    return e.BlurTileImagesPath && e.BlurTileImagesPath.length >= 6 || (AppParams.enableBlurLoading = !1),
        PanoramaManager.getPanoramaImageUrls(e)
}
PanoramaManager.prototype = new Sim.Object,
    PanoramaManager.prototype.init = function (e) {
        var t = this;
        if (this.camera = this.createCamera(),
            this.scene = this.getScene(),
            this.renderer = this.getRenderer(),
            this.houseData = e,
            this.panoramaCube1 = this.createPanoramaCube(),
            this.panoramaCube2 = this.createPanoramaCube(),
            this.logoPlane = this.createLogoPlane(),
            this.panoramaControls = this.addPanoramaControlsToCamera(this.camera),
            this.panoramaControls.autoRotateSpeed = PanoramaParams.autoRotateSpeed,
            this.currentHotSpotID = null,
            this.targetZoomFov = PanoramaParams.defaultFov,
            this.zoomDelta = (PanoramaParams.maxFov - PanoramaParams.minFov) / (PanoramaParams.zoomSteps - 1),
            this.isLoadingPanoramaImage = !1,
            this.isRotationTipShowed = !1,
            this.cubeFadeAnimation = null,
            this.cameraZoomAnimation = null,
            this.blurLoadingAnimation = new BlurLoadingAnimation,
            this.loadingClearTextures = null,
            this.isAnyHotSpotLoaded = !1,
            this.object3D.add(this.camera), !AppParams.isSingleMode) {
            this.hotSpotGroups = {},
                this.clickedHotSpotGroup = null;
            var o = ResourcesLoader.loadTexture("src/images/hotspot_sprite.png");
            for (var a in e.HotSpots) {
                var i = this.createHotSpotGroup(e.HotSpots[a], o);
                this.hotSpotGroups[e.HotSpots[a].ID] = i,
                    this.object3D.add(i)
            }
            this.registEventListener()
        }
        this.object3D.add(this.logoPlane),
            this.object3D.add(this.panoramaCube1),
            this.object3D.add(this.panoramaCube2),
            this.panoramaCube1.visible = !1,
            this.panoramaCube2.visible = !1,
            this.panoramaCube1.scale.set(2, 2, 2),
            $(DomElements.zoomInButton).click(function () {
                t.onZoomInClicked()
            }),
            $(DomElements.zoomOutButton).click(function () {
                t.onZoomOutClicked()
            }),
            this.setLayer(Layer.PanoramaManager)
    }
PanoramaManager.prototype.update = function () {
    this.renderer.setViewport(0, 0, Sim.screenWidth, Sim.screenHeight),
        this.renderer.render(this.scene, this.camera),
        this.onCameraRotationUpdateForFloorPlan && this.onCameraRotationUpdateForFloorPlan(this.camera.rotation.y),
        this.onCameraRotationUpdateForStereoHouse && this.onCameraRotationUpdateForStereoHouse(this.camera.rotation
            .y, this.panoramaControls.isAutoPlay),
        this.updateHotSpotScale()
}
PanoramaManager.prototype.onWindowResize = function () {
    this.camera.aspect = Sim.screenWidth / Sim.screenHeight,
        this.camera.updateProjectionMatrix()
}

var PanoramaParams = {
    maxFov: 100,
    minFov: 50,
    zoomSteps: 3,
    defaultFov: 100,
    logoSize: 250,
    isAutoRotateWhenStart: !0,
    autoRotateSpeed: .3
};
module.exports = {
    PanoramaManager,
    PanoramaParams
};
