"use strict";

/* MAP TRACKER */

function drawMap() {
    var map = document.getElementById("map-locations");
    map.innerHTML = "";
    var div;
    for (var i = 0; i < owchestlist.length; i++) {
        div = document.createElement("DIV");
        div.style.left = owchestlist[i].x;
        div.style.top = owchestlist[i].y;
        if (owchestlist[i].isOpened) {
            div.className = "maplocation small collected";
        } else {
            div.className = "maplocation small " + owchestlist[i].isAvailable();
        }
        div.innerHTML = '<span class="tooltiptext">' + owchestlist[i].name + '</span>';
        div.setAttribute("onclick", "toggleOWchest(this);");
        map.appendChild(div);
    }
    for (var i = 0; i < dungeonlist.length; i++) {
        div = document.createElement("DIV");
        div.style.left = dungeonlist[i].x;
        div.style.top = dungeonlist[i].y;
        div.className = "maplocation " + dungeonlist[i].canGetChest();
        
        var DCcount = 0;
        for (var key in dungeonlist[i].chestlist) {
            if (dungeonlist[i].chestlist.hasOwnProperty(key)) {
                if (!dungeonlist[i].chestlist[key].isOpened && dungeonlist[i].chestlist[key].isAvailable())
                    DCcount++;
            }
        }
        if (DCcount === 0) {DCcount = "";}
        
        div.innerHTML = DCcount + '<span class="tooltiptext">' + dungeonlist[i].name + '</span>';
        div.setAttribute("onclick", "drawSideInfo(" + i + "); selectDungeon(this);");
        map.appendChild(div);
    }
}

function selectDungeon(element) {
    var clear = document.querySelectorAll(".maplocation[selected]");
    for (var i = 0; i < clear.length; i++) {
        clear[i].removeAttribute("selected");
    }
    element.setAttribute("selected", "");
}

function drawSideInfo(number) {
    
    if (!number && number !== 0) {
        if (!document.getElementById("map-side-list").innerHTML) {return;} // no need to update a list that isn't there!
        
        var title = document.getElementById("map-side-title").innerHTML;
        for (var i in dungeonlist) {
            if (dungeonlist[i].name === title) {number = i; break;}
        }
    }
    
    var ul = document.getElementById("map-side-list");
    var li;
    ul.innerHTML = "";
    
    for (var key in dungeonlist[number].chestlist) {
        li = document.createElement("LI");
        li.innerHTML = key;
        li.setAttribute("onclick", "toggleDungeonChest(this)");
        
        if (dungeonlist[number].chestlist[key].isOpened) {
            li.className = "collected";
        } else if (dungeonlist[number].chestlist[key].isAvailable()) {
            li.className = "available";
        } else {li.className = "unavailable";}
        
        ul.appendChild(li);
    }
    
    document.getElementById("map-side-title").innerHTML = dungeonlist[number].name;
    document.getElementById("map-side-title").className = dungeonlist[number].isBeatable();
}

function toggleDungeonChest(sender) {
    var chest = sender.innerHTML;
    var title = document.getElementById("map-side-title").innerHTML;
    var dungeon = dungeonlist.name;
    
    for (var i in dungeonlist) {
        if (dungeonlist[i].name === title) {dungeon = dungeonlist[i]; break;}
    }
    
    dungeon.chestlist[chest].isOpened = !dungeon.chestlist[chest].isOpened;
    if (dungeon.chestlist[chest].isOpened) {
        sender.className = "collected";
    } else if (dungeon.chestlist[chest].isAvailable()) {
        sender.className = "available"; 
    } else {sender.className = "unavailable";}
    
    saveChests();
    drawMap();
}

function toggleOWchest(sender) {
    var chest = sender.children[0].innerHTML;
    for (var i in owchestlist) {
        if (owchestlist[i].name === chest) {chest = owchestlist[i]; break;}
    }
    chest.isOpened = !chest.isOpened;
    if (chest.isOpened) {
        sender.className = "maplocation small collected";
    } else {
        sender.className = "maplocation small " + chest.isAvailable();
    }
    
    saveChests();
}

/* SAVE AND LOAD */

function saveChests() {
    var array = [];
    var string = "";
    var i;
    var j;
    for (i in dungeonlist) {
        for (j in dungeonlist[i].chestlist) {
            if (dungeonlist[i].chestlist[j].isOpened) {string += 1;} else {string += 0;}
        }
        string = parseInt(string, 2);
        string = string.toString(16);
        array.push(string);
        string = "";
    }
    i = 0;
    for (i in owchestlist) {
        if (owchestlist[i].isOpened) {string += "1";} else {string += "0";}
    }
    string = parseInt(string, 2);
    string = string.toString(16);
    array.push(string);
    array = JSON.stringify(array);
    createCookie("cheststates", array);
}
function readChests() {
    var array = readCookie("cheststates");
    if (!array) {return;}
    array = JSON.parse(array);
    var current = "";
    var j = 0;
    var key;
    var numberofchests = 0;
    
    for (var i = 0; i < dungeonlist.length; i++) {
        current = array[i];
        current = parseInt(current, 16);
        current = current.toString(2);
        current = current.split("");
        
        for (key in dungeonlist[i].chestlist) {numberofchests++;}
        while (current.length < numberofchests) {current.unshift("0");}
        
        for (key in dungeonlist[i].chestlist) {
            if (current[j] === "1") {dungeonlist[i].chestlist[key].isOpened = true;}
            j++;
        }
    }
    
    current = array[array.length - 1];
    current = parseInt(current, 16);
    current = current.toString(2);
    current = current.split("");
    
    numberofchests = 0;
    for (var i = 0; i < owchestlist.length; i++) {numberofchests++;}
    while (current.length < numberofchests) {current.unshift("0");}
    
    for (var i = 0; i < owchestlist.length; i++) {
        if (current[i] === "1") {owchestlist[i].isOpened = true;}
    }
}


/* LOGIC CHECKS */

function isBridgeOpen() {
    var ganon = readCookie("ganon");
    if (!ganon) {console.warn("NOTE: Couldn't read cookie. If you're not loading this page from a local file, there is something wrong with the code."); ganon = "Open";}
    switch (ganon) {
        case "Open":
            return true;
        case "Vanilla":
            return (itemstates['medallion-shadow'] && itemstates['medallion-spirit']);
        case "Medallions":
            return (itemstates['medallion-forest'] && itemstates['medallion-fire'] && 
                itemstates['medallion-water'] && itemstates['medallion-light'] && 
                itemstates['medallion-shadow'] && itemstates['medallion-spirit']);
        case "Dungeons":
            return (itemstates['spiritualstone-kokiri'] && itemstates['spiritualstone-goron'] && itemstates['spiritualstone-zora'] && 
                itemstates['medallion-forest'] && itemstates['medallion-fire'] && 
                itemstates['medallion-water'] && itemstates['medallion-light'] && 
                itemstates['medallion-shadow'] && itemstates['medallion-spirit']);
    }
    return false;
}
function checkLensLogic(chesttype) {
    //logic types are: default, no1in32desert, no1in32
    //chest types are: 1in32, desert, standard
    var lenslogic = readCookie("lenslogic");
    if (!lenslogic) {console.warn("NOTE: Couldn't read cookie. If you're not loading this page from a local file, there is something wrong with the code."); lenslogic = "default";}
    
    var requires = false;
    if (chesttype === "1in32") {requires = true;}
    if (chesttype === "desert" && lenslogic !== "no1in32") {requires = true;}
    if (chesttype === "standard" && lenslogic === "default") {requires = true;}
    
    if (requires) {
        return (itemstates['item-truthlens'] && itemstates['upgrade-magic']);
    } else {return true;}
}

function generalCanGetChest(chestlist) {
    var canGet = 0;
    var unopened = 0;
    for (var key in chestlist) {
        if (chestlist.hasOwnProperty(key)) {
            if (!chestlist[key].isOpened)
                unopened++;

            if (!chestlist[key].isOpened && chestlist[key].isAvailable())
                canGet++;
        }
    }

    if (unopened == 0)
        return "collected"
    if (canGet == unopened)
        return "available";
    if (canGet == 0)
        return "unavailable"
    return "mixed"
}