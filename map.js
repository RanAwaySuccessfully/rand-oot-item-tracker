"use strict";
function drawMap() {
    var map = document.getElementById("map-locations");
    map.innerHTML = "";
    var div;
    for (var i = 0; i < owchestlist.length; i++) {
        div = document.createElement("DIV");
        div.style.left = owchestlist[i].x;
        div.style.top = owchestlist[i].y;
        div.className = "maplocation small " + owchestlist[i].isAvailable();
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
        div.setAttribute("onclick", "drawSideInfo(" + i + ");");
        map.appendChild(div);
    }
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
}


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

/* chests.js starts here */

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

// define dungeon chests
var dungeonlist = [
    {
        name: "Deku Tree",
        x: "87.0%",
        y: "57.0%",
        chestlist: {
            'Lobby Chest': { isAvailable: function () {return true} },
            'Compass Chest': { isAvailable: function () {return true} },
            'Compass Room Side Chest': { isAvailable: function () {return true} },
            'Basement Chest': { isAvailable: function () {return true} },
            'Slingshot Chest': { isAvailable: function () {return true} },
            'Slingshot Room Side Chest': { isAvailable: function () {return true} },
            'Gohma': { isAvailable: function () {return itemstates['item-slingshot'];} },
        },
        isBeatable: function(){
            if(itemstates['item-slingshot']) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Water Temple",
        x: "36.1%",
        y: "91.0%",
        chestlist: {
            'Map Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']; } },
            'Compass Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']; } },
            'Torches Chest': { isAvailable: function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && (itemstates['item-bow'] || (itemstates['item-dinsfire'] && itemstates['upgrade-magic'])) && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Dragon Chest': { isAvailable: function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Central Bow Target Chest': { isAvailable: function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-bow'] && itemstates['upgrade-gauntlets'] && itemstates['item-ocarina'] && itemstates['song-zelda'] && (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'] >= 2); } },
            'Boss Key Chest': { isAvailable:  function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-ocarina'] && itemstates['song-zelda'] && ((itemstates['item-bombs'] && itemstates['upgrade-gauntlets']) || itemstates['equipment-boots-hover']) && itemstates['item-hookshot'] >= 2; } },
            'Central Pillar Chest': { isAvailable: function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-ocarina'] && itemstates['song-zelda'] ; } },
            'Cracked Wall Chest': { isAvailable: function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Dark Link Chest': { isAvailable: function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'River Chest': { isAvailable:  function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot']) && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Morpha': { isAvailable:  function () {
                return (itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot'] >= 2); } },
        },
        isBeatable: function(){
            if(itemstates['equipment-tunic-zora'] && itemstates['equipment-boots-iron'] && itemstates['item-hookshot'] >= 2) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Gerudo Training Grounds",
        x: "18.8%",
        y: "28.0%",
        chestlist: {
            'Lobby Left Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-bow']; } },
            'Lobby Right Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-bow'] ; } },
            'Stalfos Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && (itemstates['item-bow'] || itemstates['item-hookshot'] || itemstates['equipment-boots-hover']); } },
            'Beamos Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && (itemstates['item-bow'] || itemstates['item-hookshot'] || itemstates['equipment-boots-hover']) && itemstates['item-bombs']; } },
            'Hidden Ceiling Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && (itemstates['item-bow'] || itemstates['item-hookshot']) && itemstates['item-truthlens'] && itemstates['upgrade-magic'] ; } },
            'Maze Path First Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Maze Path Second Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Maze Path Third Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Maze Path Final Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Maze Right Central Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Maze Right Side Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Maze Right Side Key': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-bow']; } },
            'Underwater Silver Rupee Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['equipment-boots-iron']; } },
            'Hammer Room Clear Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && (itemstates['item-ocarina'] && itemstates['song-time'] || itemstates['equipment-boots-hover'] || itemstates['item-hookshot'] >=2 || (itemstates['item-truthlens'] && itemstates['upgrade-magic'])); } },
            'Hammer Room Switch Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['item-hammer'] && (itemstates['item-ocarina'] && itemstates['song-time'] || itemstates['equipment-boots-hover'] || itemstates['item-hookshot'] >=2 || (itemstates['item-truthlens'] && itemstates['upgrade-magic'])); } },
            'Eye Statue Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['item-bow'] && (itemstates['item-ocarina'] && itemstates['song-time'] || itemstates['equipment-boots-hover'] || itemstates['item-hookshot'] >=2 || (itemstates['item-truthlens'] && itemstates['upgrade-magic'])); } },
            'Near Scarecrow Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Before Heavy Block Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot']; } },
            'Heavy Block First Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Heavy Block Second Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Heavy Block Third Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Heavy Block Fourth Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Spirit Temple",
        x: "02.5%",
        y: "17.0%",
        chestlist: {
            'Child Left Chest': { isAvailable: function () {
                return itemstates['item-ocarina'] && itemstates['song-spirit'] && (itemstates['item-boomerang'] || itemstates['item-slingshot']); } },
            'Child Right Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-spirit'] && (itemstates['item-boomerang'] || itemstates['item-slingshot']); } },
            'Compass Chest': { isAvailable:  function () {
                return ((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2 && itemstates['item-hookshot'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Early Adult Right Chest': { isAvailable:  function () {
                return ((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2 && (itemstates['item-bow'] || itemstates['item-hookshot'] || itemstates['item-bombs']); } },
            'First Mirror Right Chest': { isAvailable:  function () {
                return ((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2; } },
            'First Mirror Left Chest': { isAvailable:  function () {
                return ((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2; } },
            'Map Chest': { isAvailable:  function () {
                return ((itemstates['item-ocarina'] && itemstates['song-spirit'] && itemstates['item-bombs']) || (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2)) && itemstates['upgrade-magic'] && (itemstates['item-dinsfire'] || (itemstates['item-arrows-fire'] && itemstates['item-bow'] && itemstates['upgrade-gauntlets'] >= 2)); } },
            'Child Climb East Chest': { isAvailable:  function () {
                return ((itemstates['item-ocarina'] && itemstates['song-spirit'] && (itemstates['item-boomerang'] || itemstates['item-slingshot'])) || (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2 && (itemstates['item-hookshot'] || itemstates['item-bow']))); } },
            'Child Climb North Chest': { isAvailable: function () {
                 return ((itemstates['item-ocarina'] && itemstates['song-spirit'] && (itemstates['item-boomerang'] || itemstates['item-slingshot'])) || (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2 && (itemstates['item-hookshot'] || itemstates['item-bow']))); } },
            'Sun Block Room Chest': { isAvailable: function () {
                return ((itemstates['item-ocarina'] && itemstates['song-spirit'] && itemstates['item-bombs']) || (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['item-truthlens'] && itemstates['upgrade-magic'] && itemstates['upgrade-gauntlets'] >= 2 && (itemstates['item-dinsfire'] || (itemstates['item-arrows-fire'] && itemstates['item-bow'])) && itemstates['upgrade-magic'])) ; } },
            'Statue Hand Chest': { isAvailable:  function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'NE Main Room Chest': { isAvailable:  function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-hookshot']; } },
            'Silver Gauntlets Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-spirit'] && itemstates['item-bombs']) || (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2); } },
            'Mirror Shield Chest': { isAvailable: function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2); } },
            'Near Four Armos Chest': { isAvailable:  function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && itemstates['equipment-shield-mirror']; } },
            'Hallway Left Invisible Chest': { isAvailable:  function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && itemstates['upgrade-magic'] && itemstates['item-truthlens']; } },
            'Hallway Right Invisible Chest': { isAvailable: function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && itemstates['upgrade-magic'] && itemstates['item-truthlens']; } },
            'Boss Key Chest': { isAvailable: function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bow'] && itemstates['item-hookshot'] && (itemstates['item-bombs'] || itemstates['item-hammer']) ; } },
            'Topmost Chest': { isAvailable:  function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2) && (itemstates['item-hookshot'] || itemstates['item-bow'] || itemstates['item-bombs']) && itemstates['equipment-shield-mirror']; } },
            'Twinrova': { isAvailable:  function () {
                return (((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2 && itemstates['equipment-shield-mirror'] && itemstates['item-bombs'] && itemstates['item-hookshot']); } },
        },
        isBeatable: function(){
            if(((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['upgrade-gauntlets'] >= 2 && itemstates['equipment-shield-mirror'] && itemstates['item-bombs'] && itemstates['item-hookshot']) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Bottom of the Well",
        x: "68.0%",
        y: "23.0%",
        chestlist: {
            'Front Left Hidden Wall': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Front Center Bombable': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-bombs']; } },
            'Right Bottom Hidden Wall': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Center Large Chest': { isAvailable: function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-truthlens'] && itemstates['upgrade-magic'] ; } },
            'Center Small Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Back Left Bombable': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && (itemstates['item-ocarina'] && itemstates['song-zelda'] || itemstates['upgrade-scale']); } },
            'Coffin Key': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-bombs']; } },
            'Defeat Boss': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['equipment-sword-kokiri']; } },
            'Invisible Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Underwater Front Chest': { isAvailable: function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-ocarina'] && itemstates['song-zelda'] ; } },
            'Underwater Left Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Basement Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-bombs']; } },
            'Locked Pits': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
            'Behind Right Grate': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-storms'] && itemstates['item-truthlens'] && itemstates['upgrade-magic']; } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Shadow Temple",
        x: "76.0%",
        y: "21.0%",
        chestlist: {
            'Map Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && (itemstates['equipment-boots-hover'] || itemstates['item-hookshot']); } },
            'Hover Boots Chest': { isAvailable: function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && (itemstates['equipment-boots-hover'] || itemstates['item-hookshot']); } },
            'Compass Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover']; } },
            'Early Silver Rupee Chest': { isAvailable: function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover']; } },
            'Invisible Blades Visible Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs']; } },
            'Invisible Blades Invisible Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs']; } },
            'Falling Spikes Lower Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs']; } },
            'Falling Spikes Upper Chest': { isAvailable:  function () {
                return     itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['upgrade-gauntlets']; } },
            'Falling Spikes Switch Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['upgrade-gauntlets']; } },
            'Invisible Spikes Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs']; } },
            'Giant Pot Key': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot']; } },
            'Wind Hint Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot']; } },
            'After Wind Enemy Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot']; } },
            'After Wind Hidden Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot']; } },
            'Spike Walls Left Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Boss Key Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Hidden Floormaster Chest': { isAvailable:  function () {
                return itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
            'Bongo Bongo': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bow']); } },
        },
        isBeatable: function(){
            if(itemstates['item-ocarina'] && itemstates['song-shadow'] && itemstates['item-dinsfire'] && itemstates['upgrade-magic'] && itemstates['item-truthlens'] && itemstates['equipment-boots-hover'] && itemstates['item-bombs'] && itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'] && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bow']) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Dodongo's Cavern",
        x: "59.0%",
        y: "13.5%",
        chestlist: {
            'Map Chest': { isAvailable:  function () {
                return itemstates['item-bombs'] || itemstates['item-hammer'] || itemstates['upgrade-gauntlets']  ; } },
            'Compass Chest': { isAvailable:  function () {
                return itemstates['item-bombs'] || itemstates['item-hammer'] || itemstates['upgrade-gauntlets']  ; } },
            'Bomb Flower Platform': { isAvailable:  function () {
                return itemstates['item-bombs'] || itemstates['item-hammer'] || itemstates['upgrade-gauntlets']  ; } },
            'Bomb Bag Chest': { isAvailable:  function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer'] || itemstates['upgrade-gauntlets']) && (itemstates['item-slingshot'] || itemstates['item-bow'] || itemstates['equipment-boots-hover']); } },
            'End of Bridge Chest': { isAvailable:  function () {
                return (itemstates['item-slingshot'] || itemstates['item-bow'] || itemstates['equipment-boots-hover']) && (itemstates['item-bombs'] || ((itemstates['item-bow'] || itemstates['equipment-boots-hover']) && itemstates['item-hammer'])); } },
            'Chest Above King Dodongo': { isAvailable: function () {
                return (itemstates['item-slingshot'] || itemstates['item-bow'] || itemstates['equipment-boots-hover']) && itemstates['item-bombs'] ; } },
            'King Dodongo': { isAvailable: function () {
                return ((itemstates['item-slingshot'] || itemstates['item-bow'] || itemstates['equipment-boots-hover']) && itemstates['item-bombs']) ; } },
        },
        isBeatable: function(){
            if((itemstates['item-slingshot'] || itemstates['item-bow'] || itemstates['equipment-boots-hover']) && itemstates['item-bombs']) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Fire Temple",
        x: "68.0%",
        y: "06.5%",
        chestlist: {
            'Chest Near Boss': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])); } },
            'Fire Dancer Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['item-hammer'] ; } },
            'Boss Key Chest': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['item-hammer']; } },
            'Big Lava Room Bombable Chest': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bombs']; } },
            'Big Lava Room Open Chest': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])); } },
            'Boulder Maze Lower Chest': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']); } },
            'Boulder Maze Upper Chest': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']); } },
            'Boulder Maze Side Room': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']); } },
            'Boulder Maze Bombable Pit': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && itemstates['item-bombs']; } },
            'Scarecrow Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-goron'] && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']) && itemstates['item-hookshot']; } },
            'Map Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']) ; } },
            'Compass Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']); } },
            'Highest Goron Chest': { isAvailable:  function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']) && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-hammer']; } },
            'Megaton Hammer Chest': { isAvailable: function () {
                return itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['upgrade-gauntlets'] && itemstates['item-bombs']; } },
            'Volvagia': { isAvailable: function () {
                return (itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['item-hammer'] && (itemstates['equipment-boots-hover'] || (itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']) && (itemstates['item-ocarina'] && itemstates['song-time'] || itemstates['item-bombs'])))); } },
        },
        isBeatable: function(){
            if(itemstates['equipment-tunic-goron'] && (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) && itemstates['item-hammer'] && (itemstates['equipment-boots-hover'] || (itemstates['upgrade-gauntlets'] && (itemstates['item-bombs'] || itemstates['item-bow'] || itemstates['item-hookshot']) && (itemstates['item-ocarina'] && itemstates['song-time'] || itemstates['item-bombs'])))) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Jabu Jabu's Belly",
        x: "91.5%",
        y: "21.0%",
        chestlist: {
            'Boomerang Chest': { isAvailable: function () {
                return ((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-bottle'] && (itemstates['item-slingshot'] || itemstates['item-bombs'] || itemstates['item-boomerang']); } },
            'Map Chest': { isAvailable:  function () {
                return ((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-bottle'] && itemstates['item-boomerang']; } },
            'Compass Chest': { isAvailable:  function () {
                return ((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-bottle'] && itemstates['item-boomerang']; } },
            'Barinade': { isAvailable:  function () {
                return (((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-bottle'] && itemstates['item-boomerang']); } },
        },
        isBeatable: function(){
            if(((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-bottle'] && itemstates['item-boomerang']) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Ice Cavern",
        x: "90.5%",
        y: "16.0%",
        chestlist: {
            'Map Chest': { isAvailable:  function () {
                return (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bottle']; } },
            'Compass Chest': { isAvailable:  function () {
                return (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bottle']; } },
            'Heart Piece': { isAvailable:  function () {
                return (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bottle']; } },
            'Iron Boots Chest': { isAvailable:  function () {
                return (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bottle']; } },
            'Sheik in Ice Cavern': { isAvailable:  function () {
                return (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-bottle-letter']&& itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bottle']; } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Forest Temple",
        x: "78.5%",
        y: "39.0%",
        chestlist: {
            'First Chest': { isAvailable:  function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; } },
            'Chest Behind Lobby': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; } },
            'Well Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; } },
            'Map Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; } },
            'Outside Hookshot Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; },  },
            'Falling Room Chest': { isAvailable: function () {
                return ((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']) && (itemstates['item-bow'] || (itemstates['item-dinsfire'] && itemstates['upgrade-magic'])); } },
            'Block Push Chest': { isAvailable: function () {
                return ((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']) && itemstates['item-bow']; } },
            'Boss Key Chest': { isAvailable: function () {
                return ((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']) && itemstates['item-bow']; } },
            'Floormaster Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; },  },
            'Bow Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']; },   },
            'Red Poe Chest': { isAvailable:  function () {
                return ((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']) && itemstates['item-bow']; } },
            'Blue Poe Chest': { isAvailable: function () {
                return ((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot']) && itemstates['item-bow']; } },
            'Near Boss Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot'] && itemstates['item-bow']; } },
            'Phantom Ganon': { isAvailable: function () {
                return ((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot'] && itemstates['item-bow']); } },
        },
        isBeatable: function(){
            if((itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']) && itemstates['item-hookshot'] && itemstates['item-bow']) {
                if (this.canGetChest() == 'available')
                    return 'available';
                return 'mixed';
            }
            else
                return "unavailable";
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Ganon's Castle",
        x: "52.0%",
        y: "10.0%",
        chestlist: {
            'Forest Trial Chest': { isAvailable: function () { 
                return isBridgeOpen(); } },
            'Water Trial Left Chest': { isAvailable: function () { 
                return isBridgeOpen(); } },
            'Water Trial Right Chest': { isAvailable: function () { 
                return isBridgeOpen(); } },
            'Shadow Trial First Chest': { isAvailable:  function () {
                return isBridgeOpen() && ((itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-fire']) || itemstates['item-hookshot'] >= 2); } },
            'Shadow Trial Second Chest': { isAvailable:  function () {
                return isBridgeOpen() && ((itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-fire']) || (itemstates['item-hookshot'] >= 2 && itemstates['equipment-boots-hover'])); } },
            'Spirit Trial First Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['item-hookshot'] && (itemstates['upgrade-magic'] || itemstates['item-bombs']); } },
            'Spirit Trial Second Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['item-hookshot'] && itemstates['upgrade-magic'] && itemstates['item-bombs'] && itemstates['item-truthlens']; } },
            'Light Trial First Left Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3; } },
            'Light Trial Second Left Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3; } },
            'Light Trial Third Left Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3; } },
            'Light Trial First Right Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3; } },
            'Light Trial Second Right Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3; } },
            'Light Trial Third Right Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3; } },
            'Light Trail Invisible Enemies Chest': { isAvailable: function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3 && (itemstates['upgrade-magic'] && itemstates['item-truthlens']); } },
            'Light Trial Lullaby Chest': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3 && itemstates['item-ocarina'] && itemstates['song-zelda']; } },
        },
        trials: {
            'Forest Trial Clear': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-light'] && (itemstates['item-arrows-fire'] || (itemstates['item-hookshot'] && itemstates['item-dinsfire'])); } },
            'Fire Trial Clear': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['equipment-tunic-goron'] && itemstates['upgrade-gauntlets'] >= 3 && itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-light'] && itemstates['item-hookshot'] >= 2; } },
            'Water Trial Clear': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['item-bottle'] && itemstates['item-hammer'] && itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-light']; } },
            'Shadow Trial Clear': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-light'] && itemstates['item-hammer'] && (itemstates['item-arrows-fire'] || itemstates['item-hookshot'] >= 2) && (itemstates['item-truthlens'] || (itemstates['equipment-boots-hover'] && itemstates['item-hookshot'] >= 2)); } },
            'Spirit Trial Clear': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-arrows-light'] && itemstates['equipment-shield-mirror'] && itemstates['item-bombs'] && itemstates['item-hookshot']; } },
            'Light Trial Clear': { isAvailable:  function () {
                return isBridgeOpen() && itemstates['upgrade-gauntlets'] >= 3 && itemstates['upgrade-magic'] && itemstates['item-bow'] && itemstates['item-hookshot'] && itemstates['item-arrows-light']; }      },
        },
        isBeatable: function(){
            return generalCanGetChest(this.trials);
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Castle Town",
        x: "52.0%",
        y: "20.0%",
        chestlist: {
            'Zelda\'s Lullaby': { isAvailable: function () {
                return (true); } },
            'Child Shooting Gallery': { isAvailable: function () {
                return (true); } },
            'Bombchu Bowling 1': { isAvailable: function () {
                return (itemstates['item-bombs']); } },
            'Bombchu Bowling 2': { isAvailable: function () {
                return (itemstates['item-bombs']); } },
            'Treasure Chest Game': { isAvailable: function () {
                return (itemstates['item-truthlens'] && itemstates['upgrade-magic']); } },
            'Dog Lady': { isAvailable: function () {
                return (true); } },
            '10 Big Poes': { isAvailable: function () {
                return (itemstates['item-bow'] && itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['item-bottle']); } },
            'Hyrule Castle Fairy': { isAvailable: function () {
                return (itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'Ganon\'s Castle Fairy': { isAvailable: function () {
                return (itemstates['upgrade-gauntlets'] >= 3 && itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'Prelude of Light': { isAvailable: function () {
                return (itemstates['medallion-forest']); } },
            'Light Arrows': { isAvailable: function () {
                return (itemstates['medallion-shadow'] && itemstates['medallion-spirit']); } },

        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Kakariko Village",
        x: "65.0%",
        y: "24.0%",
        chestlist: {
            'Anju as Adult': { isAvailable: function () {
                return (true); } },
            'Anju\'s Chickens': { isAvailable: function () {
                return (true); } },
            'Kakariko Grotto Chest': { isAvailable: function () {
                return (true); } },
            'Kakariko Redead Grotto Chest': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer']); } },
            'Cow Heart Piece': { isAvailable: function () {
                return (true); } },
            'Man on Roof': { isAvailable: function () {
                return (itemstates['item-hookshot']); } },
            'Adult Shooting Gallery': { isAvailable: function () {
                return (itemstates['item-bow']); } },
            'Song of Storms': { isAvailable: function () {
                return (true); } },
            'Windmill Heart Piece': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-time'] || itemstates['item-boomerang']); } },
            'Dampe Race 1': { isAvailable: function () {
                return (true); } },
            'Dampe Race 2': { isAvailable: function () {
                return (true); } },
            'Dampe Digging': { isAvailable: function () {
                return (true); } },
            'Shield Grave Chest': { isAvailable: function () {
                return (true); } },
            'Redead Grave Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-suns']); } },
            'Sun\'s Song': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'Sun\'s Song Chest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-zelda'] && ((itemstates['item-dinsfire'] || (itemstates['item-arrows-fire'] && itemstates['item-bow'])) && itemstates['upgrade-magic'])); } },
            'Magic Bean Heart Piece': { isAvailable: function () {
                return (itemstates['upgrade-scale'] || itemstates['item-bombs'] || itemstates['item-hookshot'] >= 2); } },
            'Nocturne of Shadow': { isAvailable: function () {
                return (itemstates['medallion-forest'] && itemstates['medallion-fire'] && itemstates['medallion-water']); } },
            'Skulltula House 10': { isAvailable: function () {
                return (itemstates['skulltulas'] >= 1); } },
            'Skulltula House 20': { isAvailable: function () {
                return (itemstates['skulltulas'] >= 2); } },
            'Skulltula House 30': { isAvailable: function () {
                return (itemstates['skulltulas'] >= 3); } },
            'Skulltula House 40': { isAvailable: function () {
                return (itemstates['skulltulas'] >= 4); } },
            'Skulltula House 50': { isAvailable: function () {
                return (itemstates['skulltulas'] >= 5); } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Goron City",
        x: "60.0%",
        y: "06.5%",
        chestlist: {
            'Left Boulder Maze Chest': { isAvailable: function () {
                return (itemstates['upgrade-gauntlets'] >= 2 || itemstates['item-hammer']); } },
            'Center Boulder Maze Chest': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer'] || itemstates['upgrade-gauntlets'] >= 2); } },
            'Right Boulder Maze Chest': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer'] || itemstates['upgrade-gauntlets'] >= 2); } },
            'Hot Rodder Goron': { isAvailable: function () {
                return (itemstates['item-bombs']); } },
            'Link the Goron': { isAvailable: function () {
                return (itemstates['upgrade-gauntlets'] || itemstates['item-bombs'] || itemstates['item-bow']); } },
            'Spinning Pot Heart Piece': { isAvailable: function () {
                return ((itemstates['upgrade-gauntlets'] || itemstates['item-bombs']) && (itemstates['item-ocarina'] && itemstates['song-zelda'] || (itemstates['upgrade-magic'] && itemstates['item-dinsfire']))); } },
            'Darunia\'s Joy': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-ocarina'] && itemstates['song-saria']); } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Lost Woods",
        x: "78.0%",
        y: "48.0%",
        chestlist: {
            'Skull Kid': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria']); } },
            'Deku Salesman': { isAvailable: function () {
                return (true); } },
            'Ocarina Memory Game': { isAvailable: function () {
                return (true); } },
            'Target in Woods': { isAvailable: function () {
                return (itemstates['item-slingshot']); } },
            'Bomb Grotto Chest': { isAvailable: function () {
                return (itemstates['item-bombs'] || (itemstates['item-hammer'] && (item.SariasSong || itemstates['item-ocarina'] && itemstates['song-forest']))); } },
            'Deku Salesman Grotto': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer']); } },
            'Wolfos Grotto Chest': { isAvailable: function () {
                return (itemstates['item-bombs'] || (itemstates['item-hammer'] && (item.SariasSong || itemstates['item-ocarina'] && itemstates['song-forest']))); } },
            'Saria\'s Song': { isAvailable: function () {
                return (true); } },
            'Minuet of Forest': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] || itemstates['item-ocarina'] && itemstates['song-forest']); } },
            'Deku Theater Skull Mask': { isAvailable: function () {
                return (true); } },
            'Deku Theater Mask of Truth': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-saria'] && itemstates['spiritualstone-kokiri'] && itemstates['spiritualstone-goron'] && itemstates['spiritualstone-zora']); } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Zora\'s Domain",
        x: "93.5%",
        y: "29.0%",
        chestlist: {
            'Diving Minigame': { isAvailable: function () {
                return ((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']); } },
            'Zoras Domain Torch Run': { isAvailable: function () {
                return ((itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']) || itemstates['upgrade-scale']); } },
            'Fairy Fountain': { isAvailable: function () {
                return (itemstates['item-bottle-letter']&& itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'Iceberg Heart Piece': { isAvailable: function () {
                return (itemstates['item-bottle-letter']&& (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'Underwater Heart Piece': { isAvailable: function () {
                return (itemstates['item-bottle-letter']&& (itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['equipment-boots-iron'] && itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'King Zora Thawed': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-bottle'] && ((itemstates['item-bottle-letter']&& (itemstates['item-bombs'] || itemstates['upgrade-scale'])) || isBridgeOpen() || itemstates['upgrade-wallet'])); } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
    {
        name: "Death Mountain",
        x: "64.0%",
        y: "09.0%",
        chestlist: {
            'Heart Piece Above Dodongo Cavern': { isAvailable: function () {
                return (itemstates['item-bombs'] || (itemstates['upgrade-gauntlets'] && itemstates['upgrade-scale'])); } },
            'Outside Goron City Chest': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer']); } },
            'Outside Goron City Grotto': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-storms']); } },
            'Bolero of Fire': { isAvailable: function () {
                return (itemstates['item-ocarina'] && itemstates['song-fire'] || (itemstates['equipment-boots-hover'] && (itemstates['item-hammer'] || itemstates['item-bombs'] || itemstates['upgrade-gauntlets'])) || (itemstates['item-hookshot'] && itemstates['upgrade-gauntlets'])); } },
            'Crater Wall Heart Piece': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer'] || (itemstates['item-ocarina'] && itemstates['song-fire'] && (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) || itemstates['upgrade-gauntlets']); } },
            'Crater Magic Bean Heart Piece': { isAvailable: function () {
                return ((itemstates['item-bombs'] || itemstates['upgrade-scale']) && itemstates['item-ocarina'] && itemstates['song-fire']); } },
            'Crater Grotto': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer']); } },
            'Crater Fairy Fountain': { isAvailable: function () {
                return (itemstates['item-hammer'] && itemstates['item-ocarina'] && itemstates['song-zelda'] && (itemstates['upgrade-gauntlets'] || (itemstates['item-ocarina'] && itemstates['song-fire'] && itemstates['item-hookshot']) || itemstates['equipment-boots-hover'])); } },
            'Summit Fairy Fountain': { isAvailable: function () {
                return ((itemstates['item-bombs'] || itemstates['item-hammer']) && itemstates['item-ocarina'] && itemstates['song-zelda']); } },
            'Biggoron Sword': { isAvailable: function () {
                return (itemstates['item-bombs'] || itemstates['item-hammer'] || (itemstates['item-ocarina'] && itemstates['song-fire'] && (itemstates['equipment-boots-hover'] || itemstates['item-hookshot'])) || itemstates['upgrade-gauntlets']); } },
        },
        isBeatable: function(){
            return this.canGetChest();
        },
        canGetChest: function(){
            return generalCanGetChest(this.chestlist);
        }
    },
];




//define overworld chests
var owchestlist = [
    {
        name: "Kokiri Sword Chest",
        x: "76.0%",
        y: "63.5%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Mido's House (4)",
        x: "78.5%",
        y: "58.0%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Kokiri Song of Storms Grotto",
        x: "77.5%",
        y: "54.5%",
        isAvailable: function(){
            if(itemstates['item-ocarina'] && itemstates['song-storms'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Song of Time",
        x: "52.3%",
        y: "30.5%",
        isAvailable: function(){
            if(itemstates['spiritualstone-kokiri'] && itemstates['spiritualstone-goron'] && itemstates['spiritualstone-zora'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Hyrule Field North Grotto",
        x: "50.0%",
        y: "28.0%",
        isAvailable: function(){
            if(itemstates['item-bombs'] || itemstates['item-hammer'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Hyrule Field Forest Grotto",
        x: "60.0%",
        y: "59.0%",
        isAvailable: function(){
            if(itemstates['item-bombs'] || itemstates['item-hammer'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Hyrule Field South Grotto",
        x: "44.5%",
        y: "64.0%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Hyrule Field Deku Salesman Grotto",
        x: "42.0%",
        y: "64.0%",
        isAvailable: function(){
            if(itemstates['item-bombs'] || itemstates['item-hammer'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Diving Heart Piece Grotto",
        x: "44.0%",
        y: "32.0%",
        isAvailable: function(){
            if((itemstates['item-bombs'] || itemstates['item-hammer']) && (itemstates['upgrade-scale'] >= 2 || itemstates['equipment-boots-iron']))
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Talon's Chickens Minigame",
        x: "49.0%",
        y: "38.0%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Epona's Song",
        x: "47.0%",
        y: "41.5%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Lon Lon Heart Piece",
        x: "44.0%",
        y: "43.5%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Underwater Bottle",
        x: "38.6%",
        y: "80.0%",
        isAvailable: function(){
            if(itemstates['upgrade-scale'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Lake Hylia Sun",
        x: "41.5%",
        y: "91.0%",
        isAvailable: function(){
            if(itemstates['item-hookshot'] >= 2 && itemstates['item-bow'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Diving in the Lab",
        x: "35.2%",
        y: "77.4%",
        isAvailable: function(){
            if(itemstates['upgrade-scale'] >= 2)
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Lab Roof Heart Piece",
        x: "35.2%",
        y: "74.0%",
        isAvailable: function(){
            if(itemstates['upgrade-scale'] || itemstates['item-bombs'] || itemstates['item-hookshot'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Child Fishing",
        x: "45.0%",
        y: "78.0%",
        isAvailable: function(){
            if(itemstates['equipment-sword-kokiri'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Adult Fishing",
        x: "46.9%",
        y: "78.0%",
        isAvailable: function(){
            if(itemstates['item-hookshot'] || itemstates['upgrade-scale'] || itemstates['item-bombs'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Gerudo Valley Hammer Rocks Chest",
        x: "22.0%",
        y: "38.0%",
        isAvailable: function(){
            if((itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-hammer'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Gerudo Valley Crate Heart Piece",
        x: "24.0%",
        y: "41.5%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Gerudo Valley Waterfall Heart Piece",
        x: "25.5%",
        y: "32.0%",
        isAvailable: function(){
            return "available";
        }
    },
    {
        name: "Gerudo Fortress Rooftop Chest",
        x: "18.8%",
        y: "23.0%",
        isAvailable: function(){
            if((itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['equipment-boots-hover'] || itemstates['item-hookshot'] >= 2)
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Horseback Archery Game 1000pts",
        x: "21.7%",
        y: "28.0%",
        isAvailable: function(){
            if((itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['item-bow'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Horseback Archery Game 1500pts",
        x: "23.5%",
        y: "28.0%",
        isAvailable: function(){
            if((itemstates['item-ocarina'] && itemstates['song-epona'] || itemstates['item-hookshot'] >= 2) && itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['item-bow'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Haunted Wasteland Chest",
        x: "14.0%",
        y: "25.0%",
        isAvailable: function(){
            if(((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && ((itemstates['item-dinsfire'] || (itemstates['item-arrows-fire'] && itemstates['item-bow'])) && itemstates['upgrade-magic']))
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Requiem of Spirit",
        x: "04.5%",
        y: "21.5%",
        isAvailable: function(){
            if( (((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Desert Colossus Fairy",
        x: "08.0%",
        y: "19.0%",
        isAvailable: function(){
            if( ((((itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['equipment-boots-hover']) || itemstates['item-hookshot'] >= 2) && itemstates['item-truthlens'] && itemstates['upgrade-magic']) || itemstates['item-ocarina'] && itemstates['song-spirit']) && itemstates['item-bombs'] && itemstates['item-ocarina'] && itemstates['song-zelda'])
                return "available";
            return "unavailable";
        }
    },    
    {
        name: "Desert Colossus Heart Piece",
        x: "06.4%",
        y: "23.5%",
        isAvailable: function(){
            if(itemstates['item-ocarina'] && itemstates['song-spirit'] && (itemstates['item-bombs'] || itemstates['upgrade-scale']))
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Frog Ocarina Game",
        x: "79.8%",
        y: "32.0%",
        isAvailable: function(){
            if((itemstates['upgrade-scale'] || itemstates['item-bombs']) && itemstates['item-ocarina'] && itemstates['song-zelda'] && itemstates['item-ocarina'] && itemstates['song-saria'] && itemstates['item-ocarina'] && itemstates['song-suns'] && itemstates['item-ocarina'] && itemstates['song-epona'] && itemstates['item-ocarina'] && itemstates['song-time'] && itemstates['item-ocarina'] && itemstates['song-storms'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Frogs in the Rain",
        x: "78.0%",
        y: "32.0%",
        isAvailable: function(){
            if((itemstates['upgrade-scale'] || itemstates['item-bombs']) && itemstates['item-ocarina'] && itemstates['song-storms'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Zora River Heart Piece 1",
        x: "75.0%",
        y: "30.0%",
        isAvailable: function(){
            if(itemstates['upgrade-scale'] || itemstates['item-bombs'] || itemstates['equipment-boots-hover'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Zora River Heart Piece 2",
        x: "86.0%",
        y: "29.2%",
        isAvailable: function(){
            if(itemstates['upgrade-scale'] || itemstates['item-bombs'] || itemstates['equipment-boots-hover'])
                return "available";
            return "unavailable";
        }
    },
    {
        name: "Zora River Grotto",
        x: "75.5%",
        y: "34.5%",
        isAvailable: function(){
            return "available";
        }
    },
]