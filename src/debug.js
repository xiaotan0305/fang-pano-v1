var Debug = function () {};
Debug.debugTextValue = "";
Debug.debugText = document.getElementById("debugText");
Debug.log = function (e) {
    console.log(e);
    Debug.enabled && (Debug.debugTextValue += e,
        Debug.debugTextValue += "\n",
        Debug.debugText.value = Debug.debugTextValue)
};
Debug.enableStats = !1;
Debug.enabled = !1;
Debug.enabled && (Debug.debugText.style.visibility = "visible");
Debug.enableStats && Util.addStats(DomElements.vrHouseContainer);
module.exports = Debug;
