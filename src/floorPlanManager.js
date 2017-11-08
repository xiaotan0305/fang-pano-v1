
var Sim = require('./sim.js');
var AppParams = require('./appParams.js');
var FloorPlanParams = require('./floorPlanParams.js');
var Util = require('./util.js');
var ResourcesLoader = require('./resourceLoader.js');
var TextHelper = require('./textHelper.js');
var Layer = require('./layer.js');
var EventListener = require('./eventListener.js');
var DomElements = require('./domElements.js');
var FloorPlanManager = function() {
    Sim.Object.call(this);
    var e = new THREE.Object3D;
    e.name = "FloorPlanManager",
    this.setObject3D(e);
    var t = this;
    this.createHighlightHotSpotSprite = function() {
        var e = ResourcesLoader.loadTexture("src/textures/hotSpotPoint_HighLight_small.png")
          , t = new THREE.SpriteMaterial({
            map: e
        })
          , o = new THREE.Sprite(t);
        return o.scale.set(60, 60, 1),
        o.position = 3,
        o
    }
    ,
    this.createSectorSprite = function() {
        var e = ResourcesLoader.loadTexture("src/textures/sector.png")
          , t = new THREE.SpriteMaterial({
            map: e
        })
          , o = new THREE.Sprite(t);
        return o.scale.set(300, 300, 1),
        o.material.opacity = .3,
        this.sectorSprite = o,
        o
    }
    ,
    this.createHighlightHotSpotGroup = function() {
        var e = new THREE.Group;
        return e.add(this.createHighlightHotSpotSprite()),
        e.add(this.createSectorSprite()),
        this.highlightHotSpotGroup = e,
        e
    }
    ,
    this.createHotSpotSprite = function(e) {
        var t = new THREE.Sprite(e);
        return t.scale.set(FloorPlanParams.hotSpotSize, FloorPlanParams.hotSpotSize, 1),
        t.name = "HotSpotSprite",
        t
    }
    ,
    this.createHotSpotNameSprite = function(e) {
        var t = TextHelper.createTextSprite(e, {
            fontsize: 50,
            backgroundColor: {
                r: 0,
                g: 0,
                b: 0,
                a: .5
            },
            cornerAngle: 50,
            borderColor: {
                r: 0,
                g: 0,
                b: 0,
                a: 0
            }
        });
        return t.position.set(0, FloorPlanParams.hotSpotNameMarginTop, 0),
        t.scale.copy(t.defaultScale.multiplyScalar(10)),
        t.name = e,
        this.hotSpotNameSprites.push(t),
        t
    }
    ,
    this.createHotSpotGroup = function(e, t) {
        var o = new THREE.Group;
        return o.position.set(e.Position.x, e.Position.z, 1),
        o.add(this.createHotSpotNameSprite(e.Name)),
        o.add(this.createHotSpotSprite(t)),
        o.hotSpotData = e,
        o.name = e.Name,
        this.hotSpotGroups.push(o),
        o
    }
    ,
    this.createHotSpotsGroup = function(e) {
        var t = new THREE.Group
          , o = ResourcesLoader.loadTexture("src/textures/hotSpotPoint_small.png")
          , a = new THREE.SpriteMaterial({
            map: o
        });
        t.add(this.createHighlightHotSpotGroup());
        for (var i in e)
            t.add(this.createHotSpotGroup(e[i], a));
        return t
    }
    ,
    this.createFloorPlanSprite = function(e) {
        var o = new THREE.SpriteMaterial
          , a = new THREE.Sprite(o)
          , i = AppParams.housePathPrefix + e.FloorPlanPath;
        return a.material.map = ResourcesLoader.loadTexture(i, function(e) {
            var o = e.image.width
              , i = e.image.height;
            a.scale.set(o, i, 1),
            t.smallViewSize = Math.max(o, i) * FloorPlanParams.smallViewMargin,
            t.onWindowResize()
        }),
        a
    }
    ,
    this.createFloorPlanGroup = function(e) {
        var t = new THREE.Group
          , o = this.createHotSpotsGroup(this.getHotSpotsDataOfFloor(e));
        return e.IsMatchCustomFloorPlan && (o.position.x = e.FloorPlanCenterPoint.x,
        o.position.y = e.FloorPlanCenterPoint.y),
        t.add(o),
        t.add(this.createFloorPlanSprite(e)),
        t
    }
    ,
    this.createBackgroundSprite = function() {
        var e = new THREE.SpriteMaterial({
            transparent: !0,
            color: FloorPlanParams.bgColor,
            opacity: FloorPlanParams.bgOpacity
        })
          , t = Math.max(1e5, 1e5)
          , o = new THREE.Sprite(e);
        return o.name = "FloorPlanBg",
        o.scale.set(t, t, 1),
        o.position.z = -1,
        o
    }
    ,
    this.createCamera = function() {
        var e = new THREE.OrthographicCamera(1,1,1,1,1,20);
        return e.position.z = 10,
        e
    }
    ,
    this.setVisibleOfHotSpotNameSprites = function(e) {
        for (var t in this.hotSpotNameSprites)
            this.hotSpotNameSprites[t].visible = e
    }
    ,
    this.setHighlightHotSpotPosition = function(e) {
        var o = t.getFloorByHotSpotId(e.ID);
        t.switchFloorPlan(o),
        t.setVisibleOfHotSpotNameSprites(!1);
        for (var a in t.hotSpotGroups) {
            var i = t.hotSpotGroups[a].hotSpotData.ID === e.ID;
            t.hotSpotGroups[a].getObjectByName("HotSpotSprite").visible = !i
        }
        t.highlightHotSpotGroup.position.set(e.Position.x, e.Position.z, 1)
    }
    ,
    this.onPanoramaCameraRotationUpdate = function(e) {
        t.sectorSprite.material.rotation = e + .7
    }
    ,
    this.registEventListener = function() {
        for (var e = 0; e < this.hotSpotGroups.length; e++)
            EventListener.get(this.hotSpotGroups[e]).onclick = this.onHotSpotClicked;
        EventListener.get(this.backgroundSprite).onclick = this.switchToLargeView
    }
    ,
    this.enableHotSpotsEvent = function(e) {
        for (var t = 0; t < this.hotSpotGroups.length; t++)
            EventListener.get(this.hotSpotGroups[t]).enabled = e
    }
    ,
    this.onHotSpotClicked = function(e) {
        t.onHotSpotClick(e.hotSpotData),
        t.switchToSmallView()
    }
    ,
    this.switchToLargeView = function() {
        t.switchView(!1),
        t.onSwitchToLargeView()
    }
    ,
    this.switchToSmallView = function() {
        t.switchView(!0),
        t.onSwitchToSmallView()
    }
    ,
    this.switchView = function(e) {
        this.isSmallView = e,
        this.backgroundSprite.visible = e,
        this.setVisibleOfHotSpotNameSprites(!e),
        this.enableHotSpotsEvent(!e),
        this.onWindowResize(),
        DomElements.thumbnailController.style.visibility = e || AppParams.alwaysDisplayThumbnail ? "visible" : "hidden",
        DomElements.controlDiv.style.visibility = e ? "visible" : "hidden",
        DomElements.enterPanoramaViewBtn.style.visibility = e ? "hidden" : "visible"
    }
    ,
    this.getHotSpotById = function(e) {
        var t = this.houseData.HotSpots;
        for (var o in t)
            if (t[o].ID === e)
                return t[o]
    }
    ,
    this.getHotSpotsDataOfFloor = function(e) {
        var t = [];
        for (var o in e.Rooms) {
            var a = e.Rooms[o];
            for (var i in a.HotSpotIds) {
                var n = this.getHotSpotById(a.HotSpotIds[i]);
                t.push(n)
            }
        }
        return t
    }
    ,
    this.getFloorByHotSpotId = function(e) {
        for (var t in this.houseData.Floors) {
            var o = this.houseData.Floors[t];
            for (var a in o.Rooms) {
                var i = o.Rooms[a];
                if (Util.contains(i.HotSpotIds, e))
                    return o
            }
        }
    }
    ,
    this.switchFloorPlan = function(e) {
        e && this.currentFloor !== e && (this.floorPlanGroup && this.object3D.remove(this.floorPlanGroup),
        this.hotSpotGroups = [],
        this.floorPlanGroup = this.createFloorPlanGroup(e),
        this.object3D.add(this.floorPlanGroup),
        this.setLayer(Layer.FloorPlanManager),
        this.currentFloor = e,
        this.registEventListener())
    }
    ,
    this.onSwitchToLargeView = function() {}
    ,
    this.onSwitchToSmallView = function() {}
    ,
    this.onHotSpotClick = function() {}
};
FloorPlanManager.prototype = new Sim.Object,
FloorPlanManager.prototype.init = function(e, t) {
    this.scene = this.getScene(),
    this.renderer = this.getRenderer(),
    this.camera = this.createCamera(),
    this.houseData = e,
    this.largeViewBackground = new THREE.Color(AppParams.largeViewBgColor),
    this.sectorSprite = null,
    this.hotSpotGroups = [],
    this.isSmallView = !0,
    this.backgroundSprite = this.createBackgroundSprite(),
    this.hotSpotNameSprites = [],
    this.smallViewSize = 1,
    this.highlightHotSpotGroup = null,
    this.currentFloor = null,
    this.object3D.add(this.camera),
    this.object3D.add(this.backgroundSprite);
    var o = this.getFloorByHotSpotId(t.ID);
    this.switchFloorPlan(o),
    this.setHighlightHotSpotPosition(t),
    this.setLayer(Layer.FloorPlanManager),
    this.switchToSmallView()
}
,
FloorPlanManager.prototype.update = function() {
    this.isSmallView || (this.renderer.setClearColor(this.largeViewBackground),
    this.renderer.clearColor()),
    this.renderer.setViewport(this.camera.viewPort.left, this.camera.viewPort.top, this.camera.viewPort.width, this.camera.viewPort.height),
    this.renderer.render(this.scene, this.camera)
}
,
FloorPlanManager.prototype.onWindowResize = function() {
    if (this.isSmallView)
        this.camera.left = -this.smallViewSize / 2,
        this.camera.right = this.smallViewSize / 2,
        this.camera.top = this.smallViewSize / 2,
        this.camera.bottom = -this.smallViewSize / 2;
    else {
        var e = Sim.screenWidth / Sim.screenHeight
          , t = e < 1 ? this.smallViewSize : this.smallViewSize * e
          , o = e < 1 ? this.smallViewSize / e : this.smallViewSize;
        this.camera.left = -t / 2,
        this.camera.right = t / 2,
        this.camera.top = o / 2,
        this.camera.bottom = -o / 2
    }
    var a = Math.min(Sim.screenWidth, Sim.screenHeight);
    AppParams.isPhone && (a = Math.min(screen.width, screen.height));
    var i, n, r, s;
    if (this.isSmallView) {
        if (i = Math.floor(a * FloorPlanParams.leftBaseSize / FloorPlanParams.refBaseSize),
        n = Math.floor(a * FloorPlanParams.topBaseSize / FloorPlanParams.refBaseSize),
        r = s = Math.floor(a * FloorPlanParams.size.baseSize / FloorPlanParams.refBaseSize) + FloorPlanParams.size.extraPixels,
        AppParams.isPhone) {
            var l = parseInt((r - 2) / 3);
            DomElements.switch2DButton.style.width = l + "px",
            DomElements.switch3DButton.style.width = l + "px",
            DomElements.switchAutoButton.style.width = r - 2 - 2 * l + "px",
            DomElements.controllerLeft.style.top = r + 1 + "px"
        }
    } else
        i = 0,
        n = 0,
        r = Sim.screenWidth,
        s = Sim.screenHeight;
    this.camera.viewPort = {
        left: i,
        top: n,
        width: r,
        height: s
    },
    this.camera.updateProjectionMatrix()
}
module.exports = FloorPlanManager;