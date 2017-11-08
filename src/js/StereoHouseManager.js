var Sim = require('./sim.js');
var AppParams = require('./appParams.js');
var Animation = require('./animation.js');
var EventListener = require('./eventListener.js');
var ResourcesLoader = require('./resourceLoader.js');
var TextHelper = require('./textHelper.js');
var FloorPlanParams = require('./floorPlanParams.js');
var Layer = require('./layer.js');
var DomElements = require('./domElements.js');
var StereoHouseParams = {
    largeFov: 60,
    smallFov: 35,
    orbitControlsMaxDistance: 1.4,
    orbitControlsMinDistance: .7,
    smallViewAutoRotateSpeed: .7,
    isLargeViewAutoRotate: !0,
    beamHeight: 70,
    beamRadius: 12,
    hotSpotNameHeight: 40
}
var HotSpotManager = function () {
    Sim.Object.call(this);
    var e = this,
        t = new THREE.Object3D;
    this.setObject3D(t),
        this.createCylinderHotSpotGroup = function (e, t, o) {
            var a = new THREE.Group;
            return a.name = e.Name,
                a.hotSpotData = e,
                a.position.set(e.Position.x, e.Position.y + 4.5, -e.Position.z),
                a.add(this.createBeamObject3D(t)),
                a.add(this.createFeetObject3D(o)),
                AppParams.displayRoomName && a.add(this.createNameObject3D(e.Name)),
                this.hotSpotGroups.push(a),
                a
        },
        this.prepareBeamResources = function () {
            var e = ResourcesLoader.loadTexture("src/images/hotspot/light.png");
            e.minFilter = THREE.NearestFilter;
            var t = new THREE.CylinderGeometry(StereoHouseParams.beamRadius, StereoHouseParams.beamRadius,
                StereoHouseParams.beamHeight, 20, 1, !0);
            return {
                material: new THREE.MeshBasicMaterial({
                    map: e,
                    transparent: !0,
                    depthWrite: !1,
                    side: THREE.DoubleSide
                }),
                geometry: t
            }
        },
        this.createBeamObject3D = function (e) {
            var t = new THREE.Mesh(e.geometry, e.material);
            return t.position.set(0, StereoHouseParams.beamHeight / 2, 0),
                t
        },
        this.prepareFeetResources = function () {
            var e = ResourcesLoader.loadTexture("src/images/hotspot/feet.png");
            return e.minFilter = THREE.NearestFilter, {
                material: new THREE.MeshBasicMaterial({
                    map: e,
                    transparent: !0
                }),
                geometry: new THREE.PlaneBufferGeometry(12, 12, 1, 1)
            }
        },
        this.createFeetObject3D = function (e) {
            var t = new THREE.Mesh(e.geometry, e.material);
            return t.rotation.x = THREE.Math.degToRad(270),
                t
        },
        this.createNameObject3D = function (e) {
            var t = TextHelper.createTextSprite(e, {
                fontsize: 250,
                backgroundColor: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: .498039
                },
                cornerAngle: 40
            });
            return t.position.set(0, StereoHouseParams.beamHeight / 2 + StereoHouseParams.hotSpotNameHeight, 0),
                t
        },
        this.createLineObject3D = function () {
            var e = new THREE.LineBasicMaterial({
                color: 32768,
                linewidth: 1
            }),
                t = new THREE.Geometry;
            return t.vertices.push(new THREE.Vector3, new THREE.Vector3(0, StereoHouseParams.beamHeight, 0)),
                new THREE.Line(t, e)
        },
        this.createCylinderHotSpotsGroup = function (e, t) {
            var o = new THREE.Group,
                a = this.prepareBeamResources(),
                i = this.prepareFeetResources();
            for (var n in t)
                o.add(this.createCylinderHotSpotGroup(t[n], a, i));
            return o.position.y = -e,
                o
        },
        this.registEventListener = function () {
            for (var t = 0; t < this.hotSpotGroups.length; t++)
                EventListener.get(this.hotSpotGroups[t]).onclick = function (t) {
                    e.onHotSpotClicked(t.hotSpotData)
                }
        },
        this.onHotSpotClicked = function (e) { }
}
HotSpotManager.prototype = new Sim.Object;
HotSpotManager.prototype.init = function (e, t) {
    this.hotSpotGroups = [],
        this.object3D.add(this.createCylinderHotSpotsGroup(e, t)),
        this.registEventListener()
};
var StereoRoom = function () {
    function e(e) {
        var t = new THREE.PlaneBufferGeometry(e.Width, e.Height, 1, 1),
            a = new THREE.MeshBasicMaterial({
                map: null,
                side: THREE.BackSide,
                alphaTest: .1
            });
        a.transparent = !0,
            a.depthWrite = !0;
        var i = new THREE.Mesh(t, a);
        i.rotation.reorder("YXZ"),
            i.rotation.set(THREE.Math.degToRad(e.Rotation.x), THREE.Math.degToRad(e.Rotation.y), THREE.Math.degToRad(
                e.Rotation.z)),
            i.position.set(e.Position.x, e.Position.y, -e.Position.z),
            i.visible = !1;
        var n = AppParams.housePathPrefix + e.ImagePath;
        return ResourcesLoader.loadTextureInQueue(n, function (e) {
                e.minFilter = THREE.LinearFilter,
                    a.map = e,
                    a.needsUpdate = !0,
                    i.visible = !0
            }),
            o.roomFaces.push(i),
            i
    }
    Sim.Object.call(this);
    var t = new THREE.Object3D;
    this.setObject3D(t);
    var o = this;
    this.createRoomFaces = function (t) {
            for (var o in t.RoomFaces)
                this.object3D.add(e(t.RoomFaces[o]))
        },
        this.onRoomFaceClicked = function () {
            o.onRoomClicked(o.roomData)
        },
        this.registEventListener = function () {
            for (var e in this.roomFaces)
                EventListener.get(this.roomFaces[e]).onclick = this.onRoomFaceClicked
        },
        this.enableRoomFaceEvents = function (e) {
            for (var t in this.roomFaces)
                EventListener.get(this.roomFaces[t]).enabled = e
        },
        this.onRoomClicked = function () {}
}
StereoRoom.prototype = new Sim.Object;
StereoRoom.prototype.init = function (e) {
    this.object3D.name = e.Name,
        this.object3D.position.set(e.Position.x, e.Position.y, -e.Position.z),
        this.object3D.rotation.set(0, THREE.Math.degToRad(-e.Rotation), 0),
        this.roomFaces = [],
        this.roomData = e,
        this.createRoomFaces(e),
        this.registEventListener()
}
var StereoHouseManager = function () {
    function e() {
        i.isSmallView || (i.orbitControls.autoRotate = !1,
            StereoHouseParams.isLargeViewAutoRotate && t())
    }

    function t() {
        clearTimeout(i.largeViewAutoRotateTimeout),
            i.largeViewAutoRotateTimeout = setTimeout(function () {
                !i.isSmallView && i.object3D.visible && (i.orbitControls.autoRotate = !0)
            }, AppParams.switchAutoTimeout)
    }

    function o() {
        if (!i.isControlTipShowed) {
            var e = $(DomElements.controlTip);
            AppParams.isPhone || e.children(":last").hide();
            var t = (window.innerWidth - e.outerWidth()) / 2,
                o = (window.innerHeight - e.outerHeight()) / 2;
            e.css("transform", "translate(" + t + "px, " + o + "px)"),
                e.fadeIn(1500, function () {
                    setTimeout(function () {
                        e.fadeOut(1500)
                    }, 2e3)
                }),
                i.isControlTipShowed = !0
        }
    }
    Sim.Object.call(this);
    var a = new THREE.Object3D;
    this.setObject3D(a);
    var i = this;
    this.getDefaultCameraPosition = function (e) {
            var t = THREE.Math.degToRad(120),
                o = THREE.Math.degToRad(60),
                a = Math.max(e.x, e.y, e.z);
            return (new THREE.Vector3).setFromSpherical(new THREE.Spherical(a, o, t))
        },
        this.setLargeViewCameraBestPosition = function () {
            var e = (new THREE.Spherical).setFromVector3(i.camera.position),
                t = i.camera.aspect < 1 ? i.maxHouseSize / i.camera.aspect : i.maxHouseSize;
            e.radius = t + 100,
                i.camera.position.setFromSpherical(e),
                i.orbitControls.maxDistance = e.radius * StereoHouseParams.orbitControlsMaxDistance
        },
        this.addOrbitControlsToCamera = function (e, t) {
            var o = new THREE.OrbitControls(e, this.renderer.domElement);
            o.maxPolarAngle = THREE.Math.degToRad(90),
                o.minPolarAngle = THREE.Math.degToRad(10),
                o.autoRotate = StereoHouseParams.isLargeViewAutoRotate,
                o.autoRotateSpeed = 1,
                o.zoomSpeed = 1,
                o.enableDamping = !0,
                o.dampingFactor = .8,
                o.enablePan = !1;
            var a = Math.max(t.x, t.y, t.z),
                i = (t.x + t.z) / 2;
            return o.minDistance = i * StereoHouseParams.orbitControlsMinDistance,
                o.maxDistance = a * StereoHouseParams.orbitControlsMaxDistance,
                o
        },
        this.createCamera = function (e) {
            var t = new THREE.PerspectiveCamera(StereoHouseParams.largeFov, 1, .5, 1e5);
            return t.name = "HouseManager",
                t.rotation.reorder("YXZ"),
                t.position.copy(this.getDefaultCameraPosition(e)),
                t
        },
        this.createBackgroundCube = function (e) {
            for (var t = [], o = 0; o < 6; o++)
                t.push(new THREE.MeshBasicMaterial({
                    side: THREE.BackSide,
                    transparent: !0,
                    color: FloorPlanParams.bgColor,
                    opacity: FloorPlanParams.bgOpacity
                }));
            var a = 2 * Math.max(e.x, e.y, e.z),
                i = new THREE.Mesh(new THREE.CubeGeometry(a, a, a), t);
            return this.backgroundCube = i,
                i
        },
        this.switchToSmallViewWithAnimation = function (e) {
            var t = i.camera.position.clone(),
                o = i.camera.rotation.clone(),
                a = (new THREE.Vector3).copy(e.Position);
            a.z = -a.z;
            var n = o.clone();
            n.x = 0;
            i.cameraFlyAnimation.play(i.camera, t, o, a, n, function () {
                i.switchView(!0)
            }, function () {
                i.hotSpotManager.setVisible(!1)
            })
        },
        this.switchToSmallView = function () {
            i.switchView(!0),
                i.onSwitchToSmallView()
        },
        this.switchToLargeView = function () {
            i.switchView(!1),
                o(),
                i.setLargeViewCameraBestPosition(),
                i.onSwitchToLargeView()
        },
        this.switchView = function (e) {
            this.isSmallView = e,
                this.hotSpotManager.setVisible(!e),
                this.orbitControls.enabled = !e,
                this.orbitControls.autoRotate = !e && StereoHouseParams.isLargeViewAutoRotate,
                this.backgroundCube.visible = e,
                this.camera.fov = e ? StereoHouseParams.smallFov : StereoHouseParams.largeFov,
                this.onWindowResize(),
                DomElements.enterHotSpotTip.style.visibility = e ? "hidden" : "visible",
                DomElements.thumbnailController.style.visibility = e || AppParams.alwaysDisplayThumbnail ?
                "visible" : "hidden",
                DomElements.controlDiv.style.visibility = e ? "visible" : "hidden",
                DomElements.enterPanoramaViewBtn.style.visibility = e ? "hidden" : "visible",
                this.enableRoomEvents(!e)
        },
        this.onPanoramaCameraRotationUpdate = function (e, t) {
            if (i.isSmallView) {
                var o = i.isSmallViewAutoRotate && !t ? i.camera.lastTheta - .002 * StereoHouseParams.smallViewAutoRotateSpeed :
                    e,
                    a = (new THREE.Vector3).setFromSpherical(new THREE.Spherical(i.smallViewControlRadius, 1, o));
                i.camera.position.copy(a),
                    i.camera.lookAt(new THREE.Vector3(0, 0, 0)),
                    i.camera.lastTheta = o
            }
        },
        this.enableSmallViewAutoRotate = function (e) {
            this.isSmallViewAutoRotate = e
        },
        this.getHotSpotById = function (e) {
            var t = this.houseData.HotSpots;
            for (var o in t)
                if (t[o].ID === e)
                    return t[o]
        },
        this.onRoomClicked = function (e) {
            if (e.HotSpotIds && e.HotSpotIds.length > 0) {
                var t = i.getHotSpotById(e.HotSpotIds[0]);
                t && i.onHotSpotClicked(t)
            }
        },
        this.registEventListener = function () {
            EventListener.get(this.backgroundCube).onclick = this.switchToLargeView,
                document.attachEvent ? (i.renderer.domElement.attachEvent("touchend", e, !1),
                    i.renderer.domElement.attachEvent("mouseup", e, !1)) : (i.renderer.domElement.addEventListener(
                        "touchend", e, !1),
                    i.renderer.domElement.addEventListener("mouseup", e, !1))
        },
        this.enableRoomEvents = function (e) {
            for (var t in this.roomObj3Ds)
                this.roomObj3Ds[t].enableRoomFaceEvents(e)
        },
        this.onSwitchToLargeView = function () {},
        this.onSwitchToSmallView = function () {},
        this.onHotSpotClicked = function () {}
}
StereoHouseManager.getPrepareResourceUrls = function (e) {
    var t = [];
    for (var o in e.Floors) {
        var a = e.Floors[o];
        for (var i in a.Rooms) {
            var n = a.Rooms[i];
            for (var r in n.RoomFaces) {
                var s = n.RoomFaces[r],
                    l = AppParams.housePathPrefix + s.ImagePath;
                t.push(l)
            }
        }
    }
    return t
}
StereoHouseManager.prototype = new Sim.Object;
StereoHouseManager.prototype.init = function (e) {
    this.object3D.name = e.Name,
        this.scene = this.getScene(),
        this.renderer = this.getRenderer(),
        this.largeViewBackground = new THREE.Color(AppParams.largeViewBgColor),
        this.camera = this.createCamera(e.HouseSize),
        this.orbitControls = this.addOrbitControlsToCamera(this.camera, e.HouseSize),
        this.isSmallView = !1,
        this.backgroundCube = null,
        this.isSmallViewAutoRotate = !1,
        this.largeViewAutoRotateTimeout = null,
        this.isControlTipShowed = !1,
        this.maxHouseSize = Math.max(e.HouseSize.x, e.HouseSize.y, e.HouseSize.z),
        this.smallViewControlRadius = 2 * this.maxHouseSize,
        this.houseData = e,
        this.roomObj3Ds = [],
        this.cameraFlyAnimation = new CameraFlyAnimation,
        this.object3D.add(this.camera);
    for (var t in e.Floors) {
        var o = e.Floors[t];
        for (var a in o.Rooms) {
            var i = new StereoRoom;
            this.addChild(i),
                i.init(o.Rooms[a]),
                i.onRoomClicked = this.onRoomClicked,
                this.roomObj3Ds.push(i)
        }
    }
    this.hotSpotManager = new HotSpotManager,
        this.addChild(this.hotSpotManager),
        this.hotSpotManager.init(e.CameraHeight, e.HotSpots),
        this.object3D.add(this.createBackgroundCube(e.HouseSize)),
        this.setLayer(Layer.StereoHouse),
        this.registEventListener()
};
StereoHouseManager.prototype.update = function () {
    this.isSmallView || (this.renderer.setClearColor(this.largeViewBackground),
            this.renderer.clearColor()),
        this.renderer.setViewport(this.camera.viewPort.left, this.camera.viewPort.top, this.camera.viewPort.width,
            this.camera.viewPort.height),
        this.renderer.render(this.scene, this.camera),
        this.orbitControls.update()
};
StereoHouseManager.prototype.onWindowResize = function () {
    var e = Math.min(Sim.screenWidth, Sim.screenHeight);
    AppParams.isPhone && (e = Math.min(screen.width, screen.height));
    var t, o, a, i;
    this.isSmallView ? (t = Math.floor(e * FloorPlanParams.leftBaseSize / FloorPlanParams.refBaseSize),
            o = Math.floor(e * FloorPlanParams.topBaseSize / FloorPlanParams.refBaseSize),
            a = i = Math.floor(e * FloorPlanParams.size.baseSize / FloorPlanParams.refBaseSize) + FloorPlanParams.size
            .extraPixels,
            this.camera.aspect = 1) : (t = 0,
            o = 0,
            a = Sim.screenWidth,
            i = Sim.screenHeight,
            this.camera.aspect = a / i),
        this.camera.viewPort = {
            left: t,
            top: o,
            width: a,
            height: i
        },
        this.camera.updateProjectionMatrix()
};

var CameraFlyAnimation = function () {
    var e = {
        duration: 600,
        positionPower: 1 / 3,
        rotationPower: 3,
        closeToHotSpotThreshold: 75
    };
    Animation.call(this, e, e.duration)
}
CameraFlyAnimation.prototype = new Animation,
    CameraFlyAnimation.prototype.play = function (e, t, o, a, i, n, r) {
        var s = {
            camera: e,
            startPosition: t,
            startRotation: o,
            endPosition: a,
            endRotation: i,
            onFinished: n,
            onCloseToTarget: r
        };
        this.params = Object.assign(this.params, s),
            Animation.prototype.play.call(this)
    }
CameraFlyAnimation.prototype.update = function (e, t) {
    var o = e.startPosition.clone(),
        a = e.startRotation.toVector3();
    o = o.lerp(e.endPosition, Math.pow(t, e.positionPower)),
        a = a.lerp(e.endRotation, Math.pow(t, e.rotationPower)),
        e.camera.position.copy(o),
        e.camera.rotation.setFromVector3(a),
        o.distanceTo(e.endPosition) < e.closeToHotSpotThreshold && e.onCloseToTarget && e.onCloseToTarget()
}
CameraFlyAnimation.prototype.onFinished = function (e) {
    e.onFinished && e.onFinished()
}
module.exports = StereoHouseManager;
