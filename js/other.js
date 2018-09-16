"use strict";
/* IMPORT/EXPORT */

function displayOverlay2() {
    document.getElementById("overlay2").removeAttribute("class");
    document.body.className = "noScroll";
    drawOverlay2();
}
function closeOverlay2() {
    document.getElementById("overlay2").className = "hidden";
    document.body.removeAttribute("class");
}
function drawOverlay2() {
    document.getElementById("overlay2").innerHTML = '<section>' + 
        '<h2>Import</h2>' + 
        '<input type="checkbox" id="onlyimport"> <label for="onlyimport">Only import item/chest data</label><br>' + 
        '<input type="file" id="importfile" accept=".json" onchange="importJSON(event)"> <label for="importfile" class="file">Load JSON File</label>' + 
        '<br><br><br>' + 
        '<h2><strong>Export</strong></h2>' + 
        '<a href="javascript:;" id="exportfile">Click here to view the export string</a>' + 
        '<span style="display: none;"><br> or <a id="exportfile2">click here to download it as a file</a></span>' +
        '<br><button class="button" onclick="closeOverlay2()">Cancel</button>' + 
        '</section>';
    
    var cookie = [];
    var cookies = ["grid", "mapzoom", "map", "dungeon", "game", "iconsize", "checkmark", "ganon", "lenslogic", "itemstates", "sidestates", "cheststates", "skulltulastates"];
    for (var i = 0; i < cookies.length; i++) { cookie.push( readCookie( cookies[i] ) );}
    cookie = JSON.stringify(cookie);
    cookie = btoa(cookie);
    
    var exportfile = document.getElementById("exportfile2");
    var downloadAttrSupported = ("download" in document.createElement("a"));
    if (downloadAttrSupported) {
        var date = new Date();
        date = date.toISOString() + " - OoT Randomizer Item Tracker Settings.json";
        date = date.replace(/:/g, "-").replace(".", "-").replace("T", " ").replace("Z", "");
        exportfile.href = "data:application/json," + cookie;
        exportfile.download = date;
        exportfile.parentElement.removeAttribute("style");
    }
    exportfile = document.getElementById("exportfile");
    exportfile.setAttribute("onclick", "drawJSON('" + cookie + "');");
}
function drawJSON(cookie) {
    document.getElementById("overlay2").innerHTML = '<section><p>Please manually copy and paste the text in the textarea below and save it on a JSON file.</p><br>' + 
    '<textarea>' + cookie + '</textarea>' + '<br><button class="button" onclick="closeOverlay2()">Close Window</button>';
}
function importJSON(event) {
    var onlyimport = document.getElementById("onlyimport").checked;
    if (onlyimport) {var string = "some of the data";} else {var string = "ALL SETTINGS";}
    if (!confirm("Importing this file will override " + string + " currently in the tracker. Do not proceed if you have any unsaved data you want to keep.")) {event.target.value = ""; return;}
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var file = event.target.files[0];
        //if (!file.type.match('application.json')) {return;}
        var reader = new FileReader();
        reader.onload = function(event) {
            try {
                if (!file.name.match(/.json$/)) throw "The file is not a .json file.";
                if (!JSON.parse(atob(event.target.result))) throw "The file could not be read. It may be malformatted or corrupted.";
            } catch(errorText) {alert("Error: " + errorText); return;}
            var cookie = JSON.parse( atob( event.target.result ) );
            var cookies = ["grid", "mapzoom", "map", "dungeon", "game", "iconsize", "checkmark", "ganon", "lenslogic", "itemstates", "sidestates", "cheststates", "skulltulastates"];
            var i = 0;
            if (onlyimport) {i = 7;}
            for (; i < cookies.length; i++) {
                if (cookie[i] === null) {cookie[i] = "";}
                createCookie(cookies[i], cookie[i]);
            }
            location.reload();
        };
        reader.readAsText(file);
    } else {alert('Your browser does not fully support the File API. Therefore, the JSON file could not be loaded.');}
}


/* SETTINGS */

function displaySettings() {
    document.getElementById("overlay").removeAttribute("class");
    document.body.className = "noScroll";
}
function closeSettings() {
    document.getElementById("overlay").className = "hidden";
    document.body.removeAttribute("class");
}
function changeIconSet(game) {
    if (!game) {return;}
    var imagelist = document.querySelectorAll("img[src]");
    var src;
    for (var i = 0; i < imagelist.length; i++) {
        src = imagelist[i].getAttribute("src");
        imagelist[i].src = src.replace(/(N64|3DS|USR)\//g,  game + "/");
    }
    
    var trlist = document.getElementById("dungeontable").children;
    var tdlist;
    for (var i = 0; i < trlist.length; i++) {
        tdlist = trlist[i].children;
        for (var j = 0; j < tdlist.length; j++) {
            src = tdlist[j].style.backgroundImage;
            tdlist[j].style.backgroundImage = src.replace(/(N64|3DS|USR)\//g,  game + "/");
        }
    }
    
    createCookie("game", game);
}
function changeZoom(value) {
    document.getElementById("map").style.zoom = value;
    document.getElementById("map").style.MozTransform = "scale(" + (value) + ")";
    document.getElementById("map").style.MozTransformOrigin = "0 0";
    document.getElementById("settings_mapzoom2").innerHTML = parseInt(value * 100) + "%";
    createCookie("mapzoom", value);
}
function changeCheckMark(value) {
    if (value) {
        document.getElementById("itemtable").className = "checkmark";
    } else {
        document.getElementById("itemtable").removeAttribute("class");
    }
    createCookie("checkmark", value);
}
function resetSettings() {
    var cookies = ["grid", "mapzoom", "map", "dungeon", "game", "iconsize", "checkmark", "ganon", "lenslogic", "itemstates", "sidestates", "cheststates", "skulltulastates"];
    for (var i = 0; i < cookies.length; i++) {eraseCookie(cookies[i]);}
    location.reload(true);
}
function resetHalfSettings() {
    var cookies = ["ganon", "lenslogic", "itemstates", "cheststates", "skulltulastates"];
    for (var i = 0; i < cookies.length; i++) {eraseCookie(cookies[i]);}
    location.reload(true);
}


/* IS CHILD OF */

function isChildOf(child, parent) {
    if (child.parentNode === parent) {
        return true;
    } else if (child.parentNode === null) {
        return false;
    } else {return isChildOf(child.parentNode, parent);}
}


/* COOKIE FUNCTIONS */

function createCookie(name, value) {
    var days = 365;
    if (days) {
	    var date = new Date();
	    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	    var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookie(name) {
	var nameEQ = name + "=";
    if (!document.cookie || !document.cookie.match(name)) {return;} //added this to prevent errors
	var ca = document.cookie.split(';');
	for (var i=0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
    return c;
}
function eraseCookie(name) {createCookie(name, "", -1);}