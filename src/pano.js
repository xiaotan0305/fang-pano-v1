var Util = require('./util.js');
var domain = "house/";
domain = Util.getUrlParameter("domain") || domain;
window.pano = {
    domain: domain
}

require('./threeRewrite.js');
var ResourcesLoader = require('./resourceLoader.js');
var AppParams = require('./appParams.js');
var DomElements = require('./domElements.js');
var VRHouseApp = require('./VRHouseApp.js');
var Stats = require('./stats.js');
var Debug = require('./debug.js');

VRParams = {
    gazeTime: 1500,
    fov: 93
};
HouseModel = function() {
    this.Floors = [],
    this.HotSpots = [],
    this.ID = "",
    this.Name = "",
    this.CameraHeight = 0,
    this.HouseSize = void 0,
    this.CoverImagePath = "",
    this.DefaultHotSpotId = "",
    this.ClientVersion = ""
};
Floor = function() {
    this.ID = "",
    this.Name = "",
    this.FloorSize = void 0,
    this.FloorPlanPath = "",
    this.Rooms = [],
    this.FloorPlanCenterPoint = void 0,
    this.IsMatchCustomFloorPlan = !1
};
Room = function() {
    this.ID = "",
    this.Name = "",
    this.Position = void 0,
    this.Rotation = 0,
    this.RoomFaces = [],
    this.HotSpotIds = []
};
RoomFace = function() {
    this.Name = "",
    this.Position = void 0,
    this.Rotation = void 0,
    this.Width = 0,
    this.Height = 0,
    this.ImagePath = ""
};
HotSpot = function() {
    this.ID = "",
    this.Name = "",
    this.TileImagesPath = [],
    this.BlurTileImagesPath = [],
    this.ThumbnailPath = "",
    this.Position = void 0,
    this.Rotation = void 0,
    this.BestCameraView = void 0,
    this.VisibleHotSpotIds = []
};
runVRHouseApp = function() {
    function e() {
        AppParams.isPhone ? (AppParams.isSingleMode || $(DomElements.switchVRButton).show(),
        $($(DomElements.largeViewSwitchController).removeClass("pc").addClass("phone").children()).removeClass("pc").addClass("phone"),
        $($(DomElements.controllerLeft).removeClass("pc").addClass("phone").children()).removeClass("pc").addClass("phone"),
        $(DomElements.vrHouseContainer).addClass("phone"),
        DomElements.zoomInButton.className = "controller_right_phone",
        DomElements.zoomOutButton.className = "controller_right_phone disabled",
        DomElements.zoomInButton.style.backgroundImage = "url(textures/zoomInPhone.png)",
        DomElements.zoomOutButton.style.backgroundImage = "url(textures/zoomOutPhone.png)") : $(DomElements.fullScreenButton).show(),
        AppParams.isSingleMode || (DomElements.controllerLeft.style.visibility = "visible")
    }
    function t(e) {
        if (!e.ClientVersion)
            for (var t in e.HotSpots) {
                var o = e.HotSpots[t];
                if (o.ImagePath) {
                    var a = o.ImagePath.replace("PanoramaImages", "PanoramaTileImages");
                    a.indexOf("PanoramaTileImages") < 0 && (a = "PanoramaTileImages/" + a);
                    var i = (a = a.substring(0, a.lastIndexOf("."))) + "_"
                      , n = ["l.jpg", "r.jpg", "u.jpg", "d.jpg", "f.jpg", "b.jpg"];
                    o.TileImagesPath = [];
                    for (var r in n)
                        o.TileImagesPath[r] = i + n[r]
                }
            }
    }
    ResourcesLoader.getHouseViewData(function(o, a) {
        if (o){
            if (document.title = o.Name,
            o.CoverImagePath && "" !== o.CoverImagePath && (DomElements.welcome.style.backgroundImage = "url('" + AppParams.housePathPrefix + o.CoverImagePath + "')"),
            0 !== o.HotSpots.length) {
                e(),
                t(o);
                var i = new VRHouseApp;
                i.init(DomElements.vrHouseContainer, o),
                i.run()
            } else
                $(DomElements.loadingTip).text("没有全景图片");
        } else {
            404 === a ? $(DomElements.loadingTip).text("您要浏览的房子不存在") : -1 === a ? $(DomElements.loadingTip).text("数据格式错误") : $(DomElements.loadingTip).text("出错了，请刷新重试")
        }
    })
};
runVRHouseApp();
