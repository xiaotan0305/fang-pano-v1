var Sim = require('./sim.js');
var AppParams = require('./appParams.js');
var EventListener = require('./eventListener.js');
var DomElements = require('./domElements.js');
var PanoramaManager = require('./panoramaManager.js').PanoramaManager;
var ResourcesLoader = require('./resourceLoader.js');
var PanoramaParams = require('./panoramaManager.js').PanoramaParams;
var FloorPlanManager = require('./floorPlanManager.js');
var StereoHouseManager = require('./StereoHouseManager.js');
var ThumbnailManager = function (e, t) {
    var o, a, i, n = {},
        r = 0,
        s = function (e) {
            var t = [];
            for (var o in e.HotSpots) {
                var a = e.HotSpots[o],
                    i = AppParams.housePathPrefix + (a.ThumbnailPath || "ThumbnailImages/" + a.ImagePath);
                i = i.replace("\\", "/"),
                    t.push({
                        name: a.Name,
                        imagePath: i
                    })
            }
            return t
        }(e);
    i = s.length;
    var l = parseInt((Sim.screenWidth - 28) / 110),
        c = [],
        h = this,
        m = !1;
    AppParams.isPhone && ($(DomElements.thumbnailControlButton).addClass("phone expand").hover(function () {
                $(this).toggleClass("expand collap")
            }),
            $(DomElements.thumbnailList).addClass("phone")),
        $(DomElements.thumbnailControlButton).click(function () {
            "none" == DomElements.thumbnailList.style.display ? (AppParams.isPhone && (this.style.backgroundImage =
                    "url(images/thumbnailPhone.png)"),
                $(DomElements.thumbnailList).slideDown("slow")) : (AppParams.isPhone && (this.style.backgroundImage =
                    "url(images/thumbnailPhonePress.png)"),
                $(DomElements.thumbnailList).slideUp("slow"))
        })
    this.loadThumbnail = function () {
        DomElements.thumbnailController.style.visibility = "visible",
            m = !0,
            l < i && (l = parseInt((Sim.screenWidth - 50) / 110)),
            AppParams.isPhone && (l = parseInt(Sim.screenWidth / 73));
        for (var r in s) {
            var h = AppParams.displayRoomName ? "inline-block" : "none",
                u = document.createElement("div");
            u.className = AppParams.isPhone ? "thumbnail_group phone" : "thumbnail_group",
                u.innerHTML = '<div class="thumbnail-normal thumbnail-unselected ' + (AppParams.isPhone ?
                    "phone" : "") + '"><div style="background: url(\'' + s[r].imagePath +
                '\') no-repeat center;background-size: cover;background-position-x: 0;"></div><div class="thumbnail-caption text-overlay-bg-trans"><span class="thumbnail_name" style="display: ' +
                h + '">' + s[r].name + "</span></div></div>",
                r >= l && !AppParams.isPhone && (u.style.display = "none"),
                u.index = parseInt(r),
                u.onclick = function () {
                    a != this.index && t(e.HotSpots[this.index])
                },
                n[e.HotSpots[r].ID] = u,
                $(DomElements.thumbnails).append(u),
                c.push(u)
        }
        $(c[0].children.item(0)).removeClass("thumbnail-unselected"),
            o = c[0],
            a = 0,
            AppParams.isPhone || (l < i && ($(DomElements.naviLeft).show(),
                    $(DomElements.naviRight).show()),
                $(DomElements.naviLeft).addClass("disabled").click(function () {
                    a > 0 && t(e.HotSpots[a - 1])
                }),
                $(DomElements.naviRight).click(function () {
                    a + 1 < i && t(e.HotSpots[a + 1])
                }))
    }
    this.moveThumbnails = function () {
        var e = parseInt((Sim.screenWidth - 28) / 110);
        AppParams.isPhone ? e = parseInt(Sim.screenWidth / 73) : e < i ? (e = parseInt((Sim.screenWidth - 50) /
                110),
            $(DomElements.naviLeft).show(),
            $(DomElements.naviRight).show()) : ($(DomElements.naviLeft).hide(),
            $(DomElements.naviRight).hide());
        var t = parseInt(e / 2),
            o = Math.max(a - t, 0),
            n = Math.min(o + e - 1, i - 1),
            s = Math.min(r + l - 1, i - 1);
        if (AppParams.isPhone)
            DomElements.thumbnailList.scrollLeft = 73 * o;
        else {
            for (; o < r;)
                c[--r].style.display = "inline-block";
            for (; o > r;)
                c[r++].style.display = "none";
            for (; n < s;)
                c[++n].style.display = "none";
            for (; n > s;)
                c[n--].style.display = "inline-block"
        }
        l = e,
            r = o
    }
    this.setSelectedThumbnailVisible = function () {
        var e = Math.min(r + l - 1, i - 1);
        if (a < r || a > e) {
            var t = parseInt(l / 2),
                o = Math.max(a - t, 0),
                n = Math.min(o + l - 1, i - 1);
            if (n == i - 1 && (o = i - l),
                AppParams.isPhone)
                DomElements.thumbnailList.scrollLeft = 73 * o;
            else {
                for (s = r; s <= e; ++s)
                    c[s].style.display = "none";
                for (var s = o; s <= n; ++s)
                    c[s].style.display = "inline-block"
            }
            r = o
        }
    }
    this.selectThumbnail = function (e) {
        m || h.loadThumbnail(),
            n[e] != o && (o && $(o.children.item(0)).addClass("thumbnail-unselected"),
                $(n[e].children.item(0)).removeClass("thumbnail-unselected"),
                o = n[e],
                a = o.index,
                AppParams.isPhone || (0 == a ? $(DomElements.naviLeft).addClass("disabled") : $(DomElements.naviLeft)
                    .removeClass("disabled"),
                    a + 1 == i ? $(DomElements.naviRight).addClass("disabled") : $(DomElements.naviRight).removeClass(
                        "disabled")),
                h.setSelectedThumbnailVisible())
    }
    this.onWindowResize = function () {
        h.moveThumbnails()
    }
};
var VRHouseApp = function () {
    Sim.App.call(this);
    var e = this;
    this.onSwitch2DBtnClicked = function () {
        DomElements.switch2DButton.isPressed || (e.stopHouseSmallViewAutoRotateTimer(),
            e.floorPlanManager.object3D.visible = !0,
            e.stereoHouseManager.object3D.visible = !1,
            e.stereoHouseManager.enableSmallViewAutoRotate(!1),
            this.onSwitchBtnClicked(DomElements.switch2DButton, this.floorPlanSwitchBtnGroup))
    }
    this.onSwitch3DBtnClicked = function () {
        DomElements.switch3DButton.isPressed || (e.stopHouseSmallViewAutoRotateTimer(),
            e.floorPlanManager.object3D.visible = !1,
            e.stereoHouseManager.object3D.visible = !0,
            e.stereoHouseManager.enableSmallViewAutoRotate(!1),
            this.onSwitchBtnClicked(DomElements.switch3DButton, this.floorPlanSwitchBtnGroup))
    }
    this.onLargeViewSwitch2DBtnClicked = function () {
        DomElements.largeViewSwitch2DButton.isPressed || (this.onSwitchBtnClicked(DomElements.largeViewSwitch2DButton,
                this.largeViewSwitchBtnGroup),
            this.onSwitch2DBtnClicked(),
            this.floorPlanManager.isSmallView && this.floorPlanManager.switchToLargeView(),
            e.stereoHouseManager.orbitControls.enabled = !1,
            DomElements.enterHotSpotTip.style.visibility = "hidden")
    }
    this.onLargeViewSwitch3DBtnClicked = function () {
        DomElements.largeViewSwitch3DButton.isPressed || (this.onSwitchBtnClicked(DomElements.largeViewSwitch3DButton,
                this.largeViewSwitchBtnGroup),
            this.onSwitch3DBtnClicked(),
            this.stereoHouseManager.isSmallView && this.stereoHouseManager.switchToLargeView(),
            e.stereoHouseManager.orbitControls.enabled = !0,
            DomElements.enterHotSpotTip.style.visibility = "visible")
    }
    this.onSwitchAutoBtnClicked = function () {
        DomElements.switchAutoButton.isPressed || (this.startHouseSmallViewAutoRotateTimer(),
            this.onSwitchBtnClicked(DomElements.switchAutoButton, this.floorPlanSwitchBtnGroup))
    }
    this.onSwitchBtnClicked = function (e, t) {
        for (var o in t) {
            var a = t[o];
            $(a).removeClass("switchButtonPressed").removeClass("switchButton"),
                a.isPressed = a === e;
            var i = a.isPressed ? "switchButtonPressed" : "switchButton";
            $(a).addClass(i)
        }
    }
    this.onVRBtnClicked = function () {
        var e = !DomElements.switchVRButton.enabled;
        if (DomElements.switchVRButton.enabled = e,
            this.vrManager.enable(e),
            this.panoramaManager.panoramaControls.enabled = !e,
            e)
            $(DomElements.controllerLeft).hide(),
            $(DomElements.thumbnailController).hide(),
            DomElements.switchVRButton.style.backgroundImage = "url(images/vrPress.png)",
            this.stopHouseSmallViewAutoRotateTimer(),
            this.floorPlanManager.object3D.visible = !1,
            this.stereoHouseManager.object3D.visible = !1;
        else {
            $(DomElements.controllerLeft).show(),
                $(DomElements.thumbnailController).show(),
                DomElements.switchVRButton.style.backgroundImage = "url(images/vr.png)";
            for (var t in this.floorPlanSwitchBtnGroup) {
                var o = this.floorPlanSwitchBtnGroup[t];
                if (o.isPressed) {
                    o.isPressed = !1,
                        o === DomElements.switchAutoButton ? (this.stereoHouseManager.object3D.visible = !0,
                            this.onSwitchAutoBtnClicked()) : o === DomElements.switch2DButton ? this.onSwitch2DBtnClicked() :
                        o === DomElements.switch3DButton && this.onSwitch3DBtnClicked();
                    break
                }
            }
            this.panoramaManager.updateCameraRotation(new THREE.Vector3(0, this.panoramaManager.camera.rotation
                .y, 0))
        }
    }
    this.startHouseSmallViewAutoRotateTimer = function () {
        this.stopHouseSmallViewAutoRotateTimer(),
            DomElements.switchAutoButton.timeout = setTimeout(function () {
                e.panoramaManager.object3D.visible && (e.floorPlanManager.object3D.visible = !1,
                    e.stereoHouseManager.object3D.visible = !0,
                    e.stereoHouseManager.enableSmallViewAutoRotate(!0))
            }, AppParams.switchAutoTimeout)
    }
    this.stopHouseSmallViewAutoRotateTimer = function () {
        clearTimeout(DomElements.switchAutoButton.timeout)
    }
    this.onPanoramaCameraRotate = function () {
        e.vrManager && e.vrManager.object3D.visible || DomElements.switchAutoButton.isPressed && e.panoramaManager
            .object3D.visible && (e.floorPlanManager.object3D.visible || (e.floorPlanManager.object3D.visible = !
                    0,
                    e.stereoHouseManager.object3D.visible = !1),
                e.stereoHouseManager.enableSmallViewAutoRotate(!1),
                e.startHouseSmallViewAutoRotateTimer())
    }
    this.onThumbnailClicked = function (t) {
        e.switchToPanoramaView(),
            e.panoramaManager.loadPanoramaImage(t, !0)
    }
    this.onHotSpotClicked = function (t) {
        e.panoramaManager.loadPanoramaImage(t),
            e.switchToPanoramaView()
    }
    this.switchToPanoramaView = function () {
        e.stereoHouseManager.isSmallView || (AppParams.isPlayCameraFlyAnimation ? e.stereoHouseManager.switchToSmallViewWithAnimation(
                hotSpotData) : e.stereoHouseManager.switchToSmallView()),
            e.floorPlanManager.isSmallView || e.floorPlanManager.switchToSmallView()
    }
    this.getDefaultHotSpot = function (e) {
        var t = e.HotSpots[0];
        if (e.DefaultHotSpotId && "" !== e.DefaultHotSpotId)
            for (var o in e.HotSpots)
                e.HotSpots[o].ID === e.DefaultHotSpotId && (t = e.HotSpots[o]);
        return t
    }
    this.onEnterPanoramaViewBtnClicked = function () {
        e.panoramaManager.isAnyHotSpotLoaded ? e.switchToPanoramaView() : e.onHotSpotClicked(e.getDefaultHotSpot(
            e.houseData))
    }
    this.bindControlEvents = function () {
        e.onSwitchAutoBtnClicked(),
            e.panoramaManager.setHighlightHotSpotPosition = e.floorPlanManager.setHighlightHotSpotPosition,
            e.panoramaManager.onCameraRotate = e.onPanoramaCameraRotate,
            e.panoramaManager.onCameraRotationUpdateForFloorPlan = e.floorPlanManager.onPanoramaCameraRotationUpdate,
            e.panoramaManager.onCameraRotationUpdateForStereoHouse = e.stereoHouseManager.onPanoramaCameraRotationUpdate,
            e.floorPlanManager.onHotSpotClick = e.onHotSpotClicked,
            e.stereoHouseManager.onHotSpotClicked = e.onHotSpotClicked,
            e.stereoHouseManager.onHotSpotClicked = e.onHotSpotClicked,
            e.stereoHouseManager.onSwitchToLargeView = function () {
                e.panoramaManager.object3D.visible = !1,
                    e.onSwitchBtnClicked(DomElements.largeViewSwitch3DButton, e.largeViewSwitchBtnGroup),
                    $(DomElements.controllerLeft).hide(),
                    $(DomElements.zoomInButton).hide(),
                    $(DomElements.zoomOutButton).hide(),
                    DomElements.largeViewSwitchController.style.visibility = "visible"
            },
            e.stereoHouseManager.onSwitchToSmallView = function () {
                e.panoramaManager.object3D.visible = !0,
                    e.panoramaManager.updateCameraRotation(new THREE.Vector3(0, e.stereoHouseManager.camera
                        .rotation
                        .y, 0)),
                    $(DomElements.controllerLeft).show(),
                    $(DomElements.zoomInButton).show(),
                    $(DomElements.zoomOutButton).show(),
                    DomElements.largeViewSwitchController.style.visibility = "hidden"
            },
            e.floorPlanManager.onSwitchToLargeView = function () {
                e.panoramaManager.object3D.visible = !1,
                    e.onSwitchBtnClicked(DomElements.largeViewSwitch2DButton, e.largeViewSwitchBtnGroup),
                    $(DomElements.controllerLeft).hide(),
                    $(DomElements.zoomInButton).hide(),
                    $(DomElements.zoomOutButton).hide(),
                    DomElements.largeViewSwitchController.style.visibility = "visible"
            },
            e.floorPlanManager.onSwitchToSmallView = function () {
                e.panoramaManager.object3D.visible = !0,
                    e.panoramaManager.updateCameraRotation(new THREE.Vector3(0, e.panoramaManager.camera.rotation
                        .y, 0)),
                    $(DomElements.controllerLeft).show(),
                    $(DomElements.zoomInButton).show(),
                    $(DomElements.zoomOutButton).show(),
                    DomElements.largeViewSwitchController.style.visibility = "hidden"
            },
            $(DomElements.switchAutoButton).click(function () {
                e.onSwitchAutoBtnClicked()
            }),
            $(DomElements.switch2DButton).click(function () {
                e.onSwitch2DBtnClicked()
            }),
            $(DomElements.switch3DButton).click(function () {
                e.onSwitch3DBtnClicked()
            }),
            $(DomElements.largeViewSwitch2DButton).click(function () {
                e.onLargeViewSwitch2DBtnClicked()
            }),
            $(DomElements.largeViewSwitch3DButton).click(function () {
                e.onLargeViewSwitch3DBtnClicked()
            }),
            $(DomElements.enterPanoramaViewBtn).click(this.onEnterPanoramaViewBtnClicked),
            $(DomElements.switchVRButton).click(function () {
                e.onVRBtnClicked()
            })
    }
    this.loadPanoramaManager = function (t) {
        this.panoramaManager = new PanoramaManager,
            this.addObject(this.panoramaManager),
            this.panoramaManager.init(t),
            $(DomElements.fullScreenButton).click(function () {
                e.panoramaManager.onSwitchFullScreen()
            })
    }
    this.loadThumbnailManager = function (e) {
        this.thumbnailManager = new ThumbnailManager(e, this.onThumbnailClicked),
            this.panoramaManager.onStartLoadPanoramaImage = this.thumbnailManager.selectThumbnail
    }
    this.loadStereoHouseManager = function (e) {
        this.stereoHouseManager = new StereoHouseManager,
            this.addObject(this.stereoHouseManager),
            this.stereoHouseManager.init(e)
    }
    this.loadFloorPlanManager = function (e) {
        var t = this.getDefaultHotSpot(e);
        this.floorPlanManager = new FloorPlanManager,
            this.addObject(this.floorPlanManager),
            this.floorPlanManager.init(e, t)
    }
    this.loadVrManager = function () {
        this.vrManager = new VRManager,
            this.addObject(this.vrManager),
            this.vrManager.init(this.panoramaManager.camera),
            this.vrManager.object3D.visible = !1,
            this.vrManager.onVRModeEnabled = function (t) {
                DomElements.zoomInButton.style.visibility = t ? "hidden" : "visible",
                    DomElements.zoomOutButton.style.visibility = t ? "hidden" : "visible",
                    e.panoramaManager.setTargetZoomFov(t ? VRParams.fov : e.vrManager.previousFov)
            }
    }
    this.loadAppResources = function (e, t) {
        var o;
        if (AppParams.isDisplayPanoramaFirst || AppParams.isSingleMode) {
            var a = this.getDefaultHotSpot(e);
            o = PanoramaManager.getPrepareResourceUrls(a)
        } else
            o = StereoHouseManager.getPrepareResourceUrls(e);
        ResourcesLoader.prepareResources(o, t, function (e) {
            DomElements.loadingProgressBar.style.width = e + "%"
        }, function () {
            DomElements.loading.style.visibility = "hidden",
                $(DomElements.loadingTip).text("加载失败")
        })
    }
    this.onAppResourcesLoaded = function (e) {
        DomElements.welcome.style.visibility = "hidden";
        var t = this.getDefaultHotSpot(e);
        if (AppParams.isSingleMode)
            return this.loadPanoramaManager(e),
                this.panoramaManager.loadPanoramaImage(t, !0, PanoramaParams.isAutoRotateWhenStart),
                this.loadThumbnailManager(e),
                this.thumbnailManager.loadThumbnail(),
                void this.thumbnailManager.selectThumbnail(t.ID);
        AppParams.isDisplayPanoramaFirst ? (this.loadPanoramaManager(e),
                this.panoramaManager.loadPanoramaImage(t, !0, PanoramaParams.isAutoRotateWhenStart),
                this.loadFloorPlanManager(e),
                this.floorPlanManager.object3D.visible = !1,
                this.loadStereoHouseManager(e),
                this.stereoHouseManager.switchToSmallView(),
                this.loadThumbnailManager(e),
                this.thumbnailManager.loadThumbnail(),
                this.thumbnailManager.selectThumbnail(t.ID),
                this.bindControlEvents()) : (this.loadPanoramaManager(e),
                this.panoramaManager.object3D.visible = !1,
                this.loadStereoHouseManager(e),
                this.loadFloorPlanManager(e),
                this.floorPlanManager.object3D.visible = !1,
                this.loadThumbnailManager(e),
                AppParams.alwaysDisplayThumbnail && (this.thumbnailManager.loadThumbnail(),
                    this.thumbnailManager.selectThumbnail(t.ID)),
                this.bindControlEvents(),
                this.stereoHouseManager.switchToLargeView()),
            AppParams.isPhone && this.loadVrManager()
    }
}
VRHouseApp.prototype = new Sim.App
VRHouseApp.prototype.init = function (e, t) {
    var o = this;
    this.houseData = t;
    var a = new THREE.WebGLRenderer;
    a.antialias = !0,
        a.sortObjects = !1,
        a.setPixelRatio(AppParams.isPhone ? 4 : 2),
        a.gammaInput = !0,
        a.gammaOutput = !0,
        a.autoClearColor = !1,
        a.setSize(Sim.screenWidth, Sim.screenHeight);
    var i = {
        renderer: a,
        container: e,
        scene: new THREE.Scene
    };
    Sim.App.prototype.init.call(this, i),
        EventListener.listen(a.domElement, e),
        this.floorPlanSwitchBtnGroup = [DomElements.switch3DButton, DomElements.switch2DButton, DomElements.switchAutoButton],
        this.largeViewSwitchBtnGroup = [DomElements.largeViewSwitch2DButton, DomElements.largeViewSwitch3DButton],
        this.loadAppResources(t, function () {
            o.onAppResourcesLoaded(t)
        })
}
VRHouseApp.prototype.onWindowResize = function () {
    this.renderer.setSize(Sim.screenWidth, Sim.screenHeight),
        this.thumbnailManager && this.thumbnailManager.onWindowResize()
}
module.exports = VRHouseApp;
