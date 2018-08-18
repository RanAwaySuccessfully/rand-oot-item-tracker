"use strict";
window.onload = function() {onLoad()};

function onLoad() {
    var names = ["mapzoom", "map", "ganon", "game", "pixelated"];
    var current_value;
    var defaults = ["1", "", "Open", "N64", true];
    for (var i = 0; i < names.length; i++) {
        current_value = readCookie(names[i]);
        if (!current_value) {current_value = defaults[i];}
        if (names[i] === "mapzoom") {changeZoom(current_value);}
        if (names[i] === "map") {document.getElementById('map').className = current_value;}
        if (names[i] === "game") {var game = current_value;}
        if (names[i] === "pixelated") {
            document.getElementById("settings_" + names[i]).checked = current_value;
            changePixelScaling(current_value);
            continue;
        }
        document.getElementById("settings_" + names[i]).value = current_value;
    }
    var grid = readCookie("grid");
    if (grid) {
        grid = JSON.parse(grid);
    } else {
        grid = [
            [
                "item-slingshot-n!",
                "item-boomerang",
                "item-bow-n!",
                "item-hookshot-s!",
                "item-hammer",
                "",
                "item-dinsfire"
            ],
            [
                "item-bombs-n!",
                "item-arrows-ice",
                "item-arrows-light",
                "item-arrows-fire",
                "item-truthlens",
                "",
                "item-faroreswind"
            ],
            [
                "upgrade-wallet-n!",
                "skulltulas-n!",
                "upgrade-magic-s!",
                "item-bottle-letter",
                "item-bottle-n!",
                "",
                "item-nayruslove"
            ],
            [
                "equipment-tunic-goron",
                "equipment-boots-iron",
                "",
                "upgrade-gauntlets-s!",
                "equipment-sword-kokiri",
                "",
                ""
            ],
            [
                "equipment-tunic-zora",
                "equipment-boots-hover",
                "",
                "upgrade-scale-s!",
                "equipment-sword-biggoron",
                "equipment-shield-mirror",
                ""
            ],
            [
                "song-zelda",
                "song-epona",
                "song-suns",
                "song-saria",
                "song-time",
                "song-storms",
                "spiritualstone-kokiri"
            ],
            [
                "song-forest",
                "song-fire",
                "song-water",
                "song-shadow",
                "song-spirit",
                "song-light",
                "spiritualstone-goron"
            ],
            [
                "medallion-forest",
                "medallion-fire",
                "medallion-water",
                "medallion-shadow",
                "medallion-spirit",
                "medallion-light",
                "spiritualstone-zora"
            ]
        ]
    }
    var table = document.getElementById("itemtable");
    var tr;
    var td;
    var current_type;
    for (var i = 0; i < grid.length; i++) {
        tr = document.createElement("TR");
        for (var j = 0; j < grid[i].length; j++) {
            td = document.createElement("TD");
            if (grid[i][j]) {
                td.style.backgroundImage = "url(" + game + "/" + grid[i][j] + ".png)";
                td.setAttribute("state", "0");
                td.setAttribute("onclick", "onClick(this);");
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("message").innerHTML = "You can click on an item to toggle its state.";
    drawMap();
}
function onClick(element) {
    var state = Number(element.getAttribute("state"));
    
    var img = new Image();
    var src = element.style.backgroundImage.replace(/url\("/g, "").replace(/"\)/g, "");
    img.src = src;
    var max_state = img.height / img.width;
    
    var updatingType = src.search(/(n|s)!/g); // this will return the position of the match (src.match doesn't work here)
    if (updatingType) {updatingType = src.substr(updatingType, 2);} // replace the position number with the substring
    
    if (state >= max_state) {state = 0;} else {
        if (updatingType === "n!" && state === 0) {state++;} // skip state=1
        state++;
    }
    element.setAttribute("state", state);
    manageItemStates(src, true, state);
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
    var imagelist = document.querySelectorAll("img[src]"); // this could potentially cause problems???
    var src;
    for (var i = 0; i < imagelist.length; i++) {
        src = imagelist[i].getAttribute("src");
        imagelist[i].src = src.replace(/(N64|3DS|USR)\//g,  game + "/"); // okay, maybe not actually
    }
    createCookie("game", game);
}
function changePixelScaling(value) {
    if (value) {
        document.getElementById("itemtable").className = "pixelatedscaling";
        document.getElementById("itemsidetable").className = "pixelatedscaling";
    } else {
        document.getElementById("itemtable").removeAttribute("class");
        document.getElementById("itemsidetable").removeAttribute("class");
    }
}
function changeZoom(value) {
    document.getElementById("map").style.zoom = value;
    document.getElementById("settings_mapzoom2").innerHTML = parseInt(value * 100) + "%";
    createCookie("mapzoom", value);
}
function resetSettings() {
    var cookies = ["mapzoom", "map", "ganon", "game", "pixelated", "grid"];
    for (var i = 0; i < cookies.length; i++) {eraseCookie(cookies[i]);}
    location.reload(true);
}

/* EDIT MODE */

function toggleGridEditable(button, state) {
    if (state === true) {
        var table = document.getElementById("itemtable");
        var tr = table.children;
        var td;
        var div;
        var position;
        for (var i = 0; i < tr.length; i++) {
            td = tr[i].children;
            for (var j = 0; j < td.length; j++) {
                div = document.createElement("DIV");
                div.className = "dragcontainer";
                div.setAttribute("ondrop", "drop(event)");
                div.setAttribute("ondragover", "allowDrop(event)");
                div.setAttribute("onclick", "itemClick(event)");
                if (td[j].style.backgroundImage) {
                    div.innerHTML = "<img src='" + 
                        td[j].style.backgroundImage.replace(/url\("/g, "").replace(/"\)/g, "") + 
                        "' draggable='true' ondragstart='drag(event)'>";
                    position = div.innerHTML.search(/(n|s)!/);
                    if (position !== -1) {
                        div.innerHTML = div.innerHTML.substring(0, position + 1) + "1" + 
                        div.innerHTML.substring(position + 1, div.innerHTML.length);
                    }
                }
                td[j].appendChild(div);
                td[j].className = "opacity100";
                td[j].removeAttribute("onclick");
                td[j].removeAttribute("style");
            }
            
            td = document.createElement("TD");
            td.className = "sidebutton add";
            td.innerHTML = "+";
            td.setAttribute("onclick", "addRemoveTD(true, this)");
            tr[i].appendChild(td);
            
            td = document.createElement("TD");
            td.className = "sidebutton remove";
            td.innerHTML = "-";
            td.setAttribute("onclick", "addRemoveTD(false, this)");
            tr[i].appendChild(td);
        }
        tr = document.createElement("TR");
        tr.className = "settingsrow";
        tr.innerHTML = "<td class='sidebutton add' onclick='addRemoveTR(true, this)'>+</td>" + 
        "<td class='sidebutton remove' onclick='addRemoveTR(false, this)'>-</td>" + 
        "<td class='sidebutton settings' onclick='displaySettings()'>🔧</td>";
        table.appendChild(tr);
        button.setAttribute("onclick", "toggleGridEditable(this, false);");
        button.innerHTML = "<br>BACK";
        document.getElementById("message").innerHTML = "To edit the item grid, click on a square that has an item and then on another square to move it there. If the latter square already had an item, they'll swap places. You can also do this by dragging and dropping.";
        drawItemList();
    } else {
        var grid = [];
        var table = document.getElementById("itemtable");
        var tr = table.children;
        var td;
        var position;
        var stringToPush = "";
        for (var i = 0; i < tr.length; i++) {
            if (tr[i].className === "settingsrow") {table.removeChild(tr[i]); continue;}
            td = tr[i].children;
            grid.push([]);
            for (var j = 0; j < [td.length - 2]; j++) {
                if (td[j].innerHTML.search("<img src=") !== -1) {
                    td[j].style.backgroundImage = "url('" + td[j].children[0].children[0].getAttribute("src") + "')";
                    position = td[j].style.backgroundImage.search(/(n|s)1!/);
                    if (position !== -1) {
                        td[j].style.backgroundImage = td[j].style.backgroundImage.substring(0, position + 1) + 
                        td[j].style.backgroundImage.substring(position + 2, td[j].style.backgroundImage.length);
                    }
                    stringToPush = td[j].style.backgroundImage.replace(/url\("(N64|3DS|USR)\//g, "").replace('.png")', "");
                    td[j].setAttribute("onclick", "onClick(this);");
                }
                grid[i].push(stringToPush);
                stringToPush = "";
                td[j].innerHTML = "";
                td[j].removeAttribute("class");
            }
        }
        var buttonlist = document.getElementsByClassName("sidebutton");
        for (i = buttonlist.length - 1; i >= 0; i--) {
            buttonlist[i].parentElement.removeChild(buttonlist[i]);
        }
        button.setAttribute("onclick", "toggleGridEditable(this, true);");
        button.innerHTML = "<br>EDIT";
        document.getElementById("message").innerHTML = "Ocarina of Time Randomizer Item Tracker - v0.9";
        document.getElementById("itemsidetable").innerHTML = "";
        grid = JSON.stringify(grid);
        createCookie("grid", grid);
    }
}
function addRemoveTD(isAdd, element) {
    var tr = element.parentElement;
    if (isAdd) {
        var td = document.createElement("TD");
        var div = document.createElement("DIV");
        div.className = "dragcontainer";
        div.setAttribute("ondrop", "drop(event)");
        div.setAttribute("ondragover", "allowDrop(event)");
        div.setAttribute("onclick", "itemClick(event)");
        td.appendChild(div);
        td.className = "opacity100";
        tr.insertBefore(td, element);
    } else {
        var td = tr.children;
        if (td.length < 4) {return;}
        td = td[td.length - 3];
        tr.removeChild(td);
        drawItemList(); // make sure the item list is updated!
    }
}
function addRemoveTR(isAdd, element) {
    var table = document.getElementById("itemtable");
    if (isAdd) {
        var tr = document.createElement("TR");
        var td = document.createElement("TD");
        var div = document.createElement("DIV");
        div.className = "dragcontainer";
        div.setAttribute("ondrop", "drop(event)");
        div.setAttribute("ondragover", "allowDrop(event)");
        div.setAttribute("onclick", "itemClick(event)");
        td.appendChild(div);
        td.className = "opacity100";
        td = td.outerHTML;
        tr.innerHTML = td + td + td + td + td + td + td;
        tr.innerHTML += "<td class='sidebutton add' onclick='addRemoveTD(true, this)'>+</td>" + 
        "<td class='sidebutton remove' onclick='addRemoveTD(false, this)'>-</td>";
        table.insertBefore(tr, element.parentElement);
    } else {
        if (table.children.length < 3) {return;}
        table.removeChild(table.children[table.children.length - 2]);
        drawItemList(); // make sure the item list is updated!
    }
}

/* CLICK AND MOVE */

function itemClick(event) {
    if (!firstDiv) {
        firstDiv = event.target;
        if (firstDiv.tagName === "IMG") {firstDiv = firstDiv.parentElement;}
        if (!firstDiv.innerHTML) {firstDiv = false; return;} // we're dealing with an empty cell as the first item, this can only cause trouble
        firstDiv.style.backgroundColor = "#FF0";
    } else {
        firstDiv.removeAttribute("style");
        drop(event, true);
    }
}

/* DRAG AND DROP FUNCTIONS */

var firstDiv = false;
function allowDrop(event) {
    event.preventDefault();
}
function drag(event) {
    event.dataTransfer.setData("text", event.target.getAttribute("src"));
    if (firstDiv) {firstDiv.removeAttribute("style");} // if someone has clicked on an item and selected it, deselect it
    firstDiv = event.target;
    if (firstDiv.tagName === "IMG") {firstDiv = firstDiv.parentElement;}
}
function drop(event, isClick) {
    if (!isClick) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
    } else {
        var data = firstDiv.children[0].getAttribute("src");
    }
    
    var target = event.target;
    if (target.tagName === "IMG") {target = target.parentElement;}
    var swapImage = target.innerHTML;
    var swapState = target.parentElement.getAttribute("state");
    
    target.innerHTML = "";
    var child = document.querySelector("[src='" + data + "']");
    if (child) {target.appendChild(child);}
    target.parentElement.setAttribute("state", firstDiv.parentElement.getAttribute("state"));
    
    if (swapImage) {
        firstDiv.innerHTML = swapImage;
        firstDiv.parentElement.setAttribute("state", swapState);
    } else {firstDiv.parentElement.removeAttribute("state");}
    firstDiv = false;
}

/* ITEM LIST */

function drawItemList() {
    var grid = [
        "equipment-sword-kokiri",
        "equipment-sword-master",
        "equipment-sword-biggoron",
        "equipment-shield-deku",
        "equipment-shield-hylian",
        "equipment-shield-mirror",
        "upgrade-gauntlets-s1!",
        "upgrade-scale-s1!",
        "equipment-tunic-kokiri",
        "equipment-tunic-goron",
        "equipment-tunic-zora",
        "equipment-boots-kokiri",
        "equipment-boots-iron",
        "equipment-boots-hover",
        "upgrade-wallet-n1!",
        "skulltulas-n1!",
        "item-arrows-fire",
        "item-arrows-ice",
        "item-arrows-light",
        "item-dinsfire",
        "item-faroreswind",
        "item-nayruslove",
        "item-truthmask",
        "upgrade-agony",
        "item-sticks-n1!",
        "item-nuts-n1!",
        "item-bombs-n1!",
        "item-bow-n1!",
        "item-slingshot-n1!",
        "item-ocarina-s1!",
        "item-bombchus",
        "item-hookshot-s1!",
        "item-boomerang",
        "item-truthlens",
        "item-beans",
        "item-hammer",
        "item-bottle-n1!",
        "spiritualstone-kokiri",
        "spiritualstone-goron",
        "spiritualstone-zora",
        "song-zelda",
        "song-epona",
        "song-forest",
        "song-fire",
        "song-water",
        "song-shadow",
        "song-spirit",
        "song-light",
        "song-suns",
        "song-saria",
        "medallion-forest",
        "medallion-fire",
        "medallion-water",
        "medallion-shadow",
        "medallion-spirit",
        "medallion-light",
        "song-time",
        "song-storms",
        "item-bottle-letter",
        "upgrade-magic-s1!",
        "gerudo-token"
    ]
    var table = document.getElementById("itemsidetable");
    table.innerHTML = "";
    var tr;
    var td;
    var div;
    var game = readCookie("game");
    if (!game) {game = "N64";}
    for (var i = 0; i < grid.length;) {
        tr = document.createElement("TR");
        table.appendChild(tr);
        for (var j = 0; j < 8; j++) {
            td = document.createElement("TD");
            td.setAttribute("state", manageItemStates(grid[i]));
            div = document.createElement("DIV");
            div.className = "dragcontainer";
            div.setAttribute("ondrop", "drop(event)");
            div.setAttribute("ondragover", "allowDrop(event)");
            div.setAttribute("onclick", "itemClick(event)");
            if (grid[i] && !document.querySelector("[src='" + game + "/" + grid[i] + ".png']")) {
                div.innerHTML = "<img src='" + game + "/" + grid[i] + ".png' draggable='true' ondragstart='drag(event)'>";
            }
            td.appendChild(div);
            td.className = "opacity100";
            tr.appendChild(td);
            i++;
        }
    }
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
