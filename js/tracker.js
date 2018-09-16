"use strict";
window.onload = function() {onLoad()};

function onLoad() {
    
    // let's preload a total of 1 image
    var img = new Image();
    img.src = "checkmark.png";
    
    // look at the cookies, grab stuff from there
    var names = ["mapzoom", "map", "dungeon", "game", "iconsize", "checkmark", "ganon", "lenslogic"];
    var current_value;
    var defaults = ["1", "below", "side", "N64", "", true, "Open", "default"];
    for (var i = 0; i < names.length; i++) {
        current_value = readCookie(names[i]);
        if (!current_value) {
            current_value = defaults[i];
            createCookie(names[i], current_value);
        }
        
        if (names[i] === "mapzoom") {changeZoom(current_value);}
        if (names[i] === "iconsize") {document.getElementById('mainsection').className = current_value;}
        if (names[i] === "map") {document.getElementById('map').className = current_value;}
        if (names[i] === "dungeon") {document.getElementById('dungeontable').className = current_value;}
        if (names[i] === "game") {var game = current_value;}
        if (names[i] === "checkmark") {
            current_value = !(current_value === "false"); // convert string to boolean
            changeCheckMark(current_value);
            document.getElementById("settings_" + names[i]).checked = current_value;
            continue;
        }
        
        document.getElementById("settings_" + names[i]).value = current_value;
    }
    readItemStates();
    
    // begin setting up the item tracker grid
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
                "upgrade-gauntlets-s!",
                "upgrade-scale-s!",
                "",
                "",
                "item-ocarina-s!",
                "",
                ""
            ],
            [
                "equipment-tunic-goron",
                "equipment-tunic-zora",
                "",
                "equipment-sword-kokiri",
                "equipment-sword-master",
                "equipment-sword-biggoron",
                ""
            ],
            [
                "equipment-boots-iron",
                "equipment-boots-hover",
                "",
                "equipment-shield-deku",
                "equipment-shield-hylian",
                "equipment-shield-mirror",
                ""
            ],
            [
                "song-zelda",
                "song-epona",
                "song-saria",
                "song-suns",
                "song-time",
                "song-storms",
                "spiritualstone-kokiri"
            ],
            [
                "song-forest",
                "song-fire",
                "song-water",
                "song-spirit",
                "song-shadow",
                "song-light",
                "spiritualstone-goron"
            ],
            [
                "medallion-forest",
                "medallion-fire",
                "medallion-water",
                "medallion-spirit",
                "medallion-shadow",
                "medallion-light",
                "spiritualstone-zora"
            ]
        ]
    }
    var table = document.getElementById("itemtable");
    var tr;
    var td;
    for (var i = 0; i < grid.length; i++) {
        tr = document.createElement("TR");
        for (var j = 0; j < grid[i].length; j++) {
            td = document.createElement("TD");
            if (grid[i][j]) {
                td.style.backgroundImage = "url(" + game + "/" + grid[i][j] + ".png)";
                td.setAttribute("state", manageItemStates(grid[i][j]));
                td.setAttribute("onclick", "onClick(event, this);");
                td.setAttribute("oncontextmenu", "onClick(event, this, true);");
                td.addEventListener("contextmenu", letsNot);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    
    var miscitems = document.getElementById("miscitems");
    var miscitemlist = ["heart-piece", "heart-container", "skulltulas-n1!", "item-beans"];
    var max = [36, 8, 100, 10];
    var element;
    for (var i = 0; i < miscitemlist.length; i++) {
        element = document.createElement("DIV");
        element.className = "miscitem";
        element.innerHTML = '<img src="' + game + '/' + miscitemlist[i] + '.png">' +
        '<input type="number" min="0" max="' + max[i] + '" oninput="sideStates(this);">' + 
        '<div><button class="more" onclick="miscCounter(this, true);"><img src="plus.png"></button><button class="less" onclick="miscCounter(this, false);"><img src="minus.png"></button></div>';
        miscitems.appendChild(element);
    }
    
    readSideStates();
    dungeonTable();
    readChests();
    drawMap();
}
function miscCounter(element, isAdd) {
    element = element.parentElement.parentElement.children[1];
    var value = Number(element.value);
    if (isNaN(value)) {element.value = 0; return;}
    var min = Number(element.getAttribute("min"));
    var max = Number(element.getAttribute("max"));
    if (isAdd) {
        if (value >= max) {return;}
        if (value < min) {value = min;} else {value++;}
    } else {
        if (value <= min) {return;}
        if (value > max) {value = max;} else {value--;}
    } // this can just be replaced with element.stepUp(); and element.stepDown(); once people stop caring about IE11 support
    element.value = value;
}

/* ITEM TRACKER */

function onClick(event, element, reverse) {
    
    var state = Number(element.getAttribute("state"));
    
    var img = new Image();
    var src = element.style.backgroundImage.replace(/url\("/g, "").replace(/"\)/g, "");
    img.src = src;
    var max_state = img.height / img.width;
    
    // this is the checkmark on the bottom-right corner of some items
    if (src.match(/(song-)|(medallion-)|(spiritualstone-)/g)) {
        var canBeDisplayed = document.getElementById("itemtable").getAttribute("class");
        if (event.offsetX >= 32 && event.offsetY >= 32 && canBeDisplayed) {cornerClick(element); return;}
    }
    
    // var updatingType = src.search(/(n|s)!/g);
    // if (updatingType) {updatingType = src.substr(updatingType, 2);}
    
    var updatingTypeN = src.match(/n!/g);
    
    if (reverse) {
        if (state <= 0) {state = max_state;} else {
            if (updatingTypeN && state === 2) {state--;} // skip state=1
            state--;
        }
    } else {
        if (state >= max_state) {state = 0;} else {
            if (updatingTypeN && state === 0) {state++;} // skip state=1
            state++;
        }
    }
    
    
    element.setAttribute("state", state);
    manageItemStates(src, true, state);
}

function cornerClick(element) {
    if (element.getAttribute("checkmark")) {
        element.removeAttribute("checkmark");
    } else {
        element.setAttribute("checkmark", "1");
    }
}

/* DUNGEON TRACKER */

function dungeonTable() {
    var game = readCookie("game");
    if (!game) {game = "N64"; console.warn("NOTE: Couldn't read cookie. If you're not loading this page from a local file, there is something wrong with the code.");}
    // ["dungeonname", necessarykeys, maxkeys, bosskey, medallion];
    var dungeons = [
        ["Deku Tree",          0, 0, 0, 1],
        ["Dodongo's Cavern",   0, 0, 0, 1],
        ["Jabu-Jabu's Belly",  0, 0, 0, 1],
        ["Light Temple",       0, 0, 0, 1],
        ["Forest Temple",      5, 5, 1, 1],
        ["Fire Temple",        7, 8, 1, 1],
        ["Water Temple",       6, 6, 1, 1],
        ["Spirit Temple",      5, 5, 1, 1],
        ["Shadow Temple",      5, 5, 1, 1],
        ["Ganon's Castle",     2, 2, 1, 0],
        ["Bottom of the Well", 1, 3, 0, 0],
        ["Gerudo's Fortress",  4, 4, 0, 0],
        ["G. Training Ground", 9, 9, 0, 0]
    ];
    var medallions = ["unknown", "spiritualstone-kokiri", "spiritualstone-goron", "spiritualstone-zora", "medallion-forest", "medallion-fire", "medallion-water", "medallion-spirit", "medallion-shadow", "medallion-light"];
    var placeholders = [
        "code, go home",
        "you're drunk",
        ["key-normal", "-keycount"],
        ["key-boss", "-bosskey"],
        ["", "-medallion"]
    ];
    var table = document.getElementById("dungeontable");
    var tr;
    var td;
    var current;
    var state;
    for (var i = 0; i < dungeons.length; i++) {
        tr = document.createElement("TR");
        
        td = document.createElement("TD");
        td.innerHTML = dungeons[i][0];
        tr.appendChild(td);
        
        for (var j = 4; j > 1; j--) {
            
            td = document.createElement("TD");
            
            if (dungeons[i][j]) {
                
                current = placeholders[j][0];
                if (!current) {
                    current = medallions[manageItemStates("d" + i + placeholders[j][1])];
                    td.className = "progressiveupdating";
                } 
                if (j !== 2) {
                    td.setAttribute("onclick", "dungeonOnClick(event, this, " + i + ");");
                    td.setAttribute("oncontextmenu", "dungeonOnClick(event, this, " + i + ", true);");
                    td.addEventListener("contextmenu", letsNot);
                }
                if (j === 3) {
                    state = manageItemStates("d" + i + placeholders[j][1]);
                } else {state = "1";}
                
                td.style.backgroundImage = "url(" + game + "/" + current + ".png)";
                td.setAttribute("state", state);
                
                if (j === 2) {
                    tr.appendChild(td);
                    td = document.createElement("TD");
                    td.innerHTML = '<input type="number" value="' + manageItemStates("d" + i + "-keycount") + '" min="0" max="' + dungeons[i][2] + '" oninput="manageItemStates(\'d' + i + '-keycount\', true, Number(this.value), Number(this.getAttribute(\'max\')));">';
                }
            }
            
            tr.appendChild(td);
            
        }
        
        table.appendChild(tr);
    }
}
function dungeonOnClick(event, element, n, reverse) {
    
    var string;
    if (element.className === "progressiveupdating") {
        string = "-medallion";
        var src = element.style.backgroundImage.replace(/url\("/g, "").replace(/.png"\)/g, "");
        var src = src.replace(/(N64|3DS|USR)\//g, "");
        var medallions = ["unknown", "spiritualstone-kokiri", "spiritualstone-goron", "spiritualstone-zora", "medallion-forest", "medallion-fire", "medallion-water", "medallion-spirit", "medallion-shadow", "medallion-light"];
        
        var game = readCookie("game");
        if (!game) {game = "N64"; console.warn("NOTE: Couldn't read cookie. If you're not loading this page from a local file, there is something wrong with the code.");}
        
        for (var i = 0; i < medallions.length; i++) {
            if (medallions[i] === src) {break;}
        }
        
        if (reverse) {
            if (i <= 0) {i = (medallions.length - 1);} else {i--;}
        } else {
            if (i >= (medallions.length - 1)) {i = 0;} else {i++;}
        }
        
        element.style.backgroundImage = "url(" + game + "/" + medallions[i] + ".png)";
        state = i;
    } else {
        string = "-bosskey";
        var state = Number(element.getAttribute("state"));
        
        if (state >= 1) {state = 0;} else {state++;}
        
        element.setAttribute("state", state);
    }
    string = "d" + n + string;
    
    manageItemStates(string, true, state);
}
function letsNot(e) {e.preventDefault();}


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
                td[j].removeAttribute("oncontextmenu");
                td[j].removeEventListener("contextmenu", letsNot);
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
        "<td class='sidebutton settings' colspan='2' onclick='displaySettings()'>SETTINGS</td>";
        table.appendChild(tr);
        button.setAttribute("onclick", "toggleGridEditable(this, false);");
        button.innerHTML = "<br>BACK";
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
                if (td[j].children[0].children[0]) {
                    td[j].style.backgroundImage = "url('" + td[j].children[0].children[0].getAttribute("src") + "')";
                    position = td[j].style.backgroundImage.search(/(n|s)1!/);
                    if (position !== -1) {
                        td[j].style.backgroundImage = td[j].style.backgroundImage.substring(0, position + 1) + 
                        td[j].style.backgroundImage.substring(position + 2, td[j].style.backgroundImage.length);
                    }
                    stringToPush = td[j].style.backgroundImage.replace(/url\("(N64|3DS|USR)\//g, "").replace('.png")', "");
                    td[j].setAttribute("onclick", "onClick(event, this);");
                    td[j].setAttribute("oncontextmenu", "onClick(event, this, true);");
                    td[j].addEventListener("contextmenu", letsNot);
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
    var swapCheckmark = target.parentElement.getAttribute("checkmark");
    
    target.innerHTML = "";
    var child = document.querySelector("[src='" + data + "']");
    if (child) {target.appendChild(child);}
    target.parentElement.setAttribute("state", firstDiv.parentElement.getAttribute("state"));
    
    var checkmark = firstDiv.parentElement.getAttribute("checkmark");
    if (checkmark) {
        target.parentElement.setAttribute("checkmark", firstDiv.parentElement.getAttribute("checkmark"));
    } else {target.parentElement.removeAttribute("checkmark");
    } 
    if (swapCheckmark) {
        firstDiv.parentElement.setAttribute("checkmark", swapCheckmark);
    } else {firstDiv.parentElement.removeAttribute("checkmark");}
    // the checkmark attribute needs to be removed when not in use, having it empty will still render a checkmark
    
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
        "upgrade-magic-s1!",
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
        "item-bottle-letter",
        "item-bottle-bigpoe",
        "item-weirdegg",
        "song-zelda",
        "song-epona",
        "scarecrow",
        "gerudo-token",
        "upgrade-agony",
        "spiritualstone-kokiri",
        "spiritualstone-goron",
        "spiritualstone-zora",
        "song-saria",
        "song-suns",
        "song-forest",
        "song-fire",
        "song-water",
        "song-shadow",
        "song-spirit",
        "song-light",
        "song-time",
        "song-storms",
        "medallion-forest",
        "medallion-fire",
        "medallion-water",
        "medallion-shadow",
        "medallion-spirit",
        "medallion-light",
        ""
    ]
    var table = document.getElementById("itemsidetable");
    table.innerHTML = "";
    var tr;
    var td;
    var div;
    var query;
    var game = readCookie("game");
    if (!game) {game = "N64"; console.warn("NOTE: Couldn't read cookie. If you're not loading this page from a local file, there is something wrong with the code.");}
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
            query = document.querySelector("[src='" + game + "/" + grid[i] + ".png']");
            if (query) {
                if (!isChildOf(query, document.getElementById("itemtable"))) {query = false;}
            }
            if (grid[i] && !query) {
                div.innerHTML = "<img src='" + game + "/" + grid[i] + ".png' draggable='true' ondragstart='drag(event)'>";
            }
            td.appendChild(div);
            td.className = "opacity100";
            tr.appendChild(td);
            i++;
        }
    }
}