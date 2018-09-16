"use strict";
function manageItemStates(item, set, state, max) {
    if (!item) {return 0;}
    if (max) {if (state > max) {state = max;}}
    item = item.replace(/(N64|3DS|USR)\//g, "");
    item = item.replace(/url\("/g,  "").replace(/.png("\))?/g, "");
    item = item.replace(/-(n|s)(1)?!/g, "");
    if (set) {
        itemstates[item] = state;
        drawMap();
        drawSideInfo();
        var string = "";
        var key;
        for (key in itemstates) {string += itemstates[key];}
        createCookie("itemstates", string);
    } else {
        return itemstates[item];
    }
}
function readItemStates() {
    var string = readCookie("itemstates");
    if (!string) {return;}
    var array = string.split("");
    var i = 0;
    var key;
    for (key in itemstates) {itemstates[key] = Number(array[i]); i++;}
    
    array = readCookie("sidestates");
    if (!array) {return;}
    array = JSON.parse(array);
    i = 0;
    for (key in sidestates) {sidestates[key] = Number(array[i]); i++;}
}
function sideStates(element) {
    var value = Number(element.value);
    var item = element.parentElement.children[0].getAttribute("src");
    var min = Number(element.getAttribute("min"));
    var max = Number(element.getAttribute("max"));
    item = item.replace(/(N64|3DS|USR)\//g, "");
    item = item.replace(/.png/g, "").replace(/-(n|s)(1)?!/g, "");
    
    if (value < min) {value = min;} else if (value > max) {value = max;}
    sidestates[item] = value;
    
    var array = [];
    var key;
    for (key in sidestates) {array.push(sidestates[key]);}
    array = JSON.stringify(array);
    createCookie("sidestates", array);
}
function readSideStates() {
    var divs = document.getElementsByClassName("miscitem");
    var src;
    for (var i = 0; i < divs.length; i++) {
        src = divs[i].children[0].getAttribute("src");
        src = src.replace(/(N64|3DS|USR)\//g, "").replace(/.png/g, "");
        src = src.replace(/-(n|s)(1)?!/g, "");
        divs[i].children[1].value = sidestates[src];
    }
}
var itemstates = {
    
    /* ITEM TRACKER */
    
    "item-bow": 0,
    "item-hookshot": 0,
    "item-hammer": 0,
    "item-slingshot": 0,
    "item-boomerang": 0,
    "item-bombs": 0,
    "item-truthlens": 0,
    "item-dinsfire": 0,
    "item-faroreswind": 0,
    "item-nayruslove": 0,
    "item-arrows-fire": 0,
    "item-arrows-ice": 0,
    "item-arrows-light": 0,
    "item-ocarina": 0,
    "item-bottle": 0,
    "item-bottle-letter": 0,
    "item-bottle-bigpoe": 0,
    "item-beans": 0,
    "item-bombchus": 0,
    "item-nuts": 0,
    "item-sticks": 0,
    "item-truthmask": 0,
    "item-weirdegg": 0,

    "skulltulas": 0,
    "gerudo-token": 0,

    "equipment-sword-kokiri": 0,
    "equipment-sword-master": 0,
    "equipment-sword-biggoron": 0,
    "equipment-shield-deku": 0,
    "equipment-shield-hylian": 0,
    "equipment-shield-mirror": 0,
    "equipment-tunic-kokiri": 1,
    "equipment-tunic-goron": 0,
    "equipment-tunic-zora": 0,
    "equipment-boots-kokiri": 1,
    "equipment-boots-iron": 0,
    "equipment-boots-hover": 0,
    
    "upgrade-agony": 0,
    "upgrade-gauntlets": 0,
    "upgrade-magic": 0,
    "upgrade-scale": 0,
    "upgrade-wallet": 0,

    "song-zelda": 0,
    "song-epona": 0,
    "song-suns": 0,
    "song-saria": 0,
    "song-time": 0,
    "song-storms": 0,
    "song-forest": 0,
    "song-light": 0,
    "song-fire": 0,
    "song-water": 0,
    "song-shadow": 0,
    "song-spirit": 0,
    
    "scarecrow": 0,

    "spiritualstone-kokiri": 0,
    "spiritualstone-goron": 0,
    "spiritualstone-zora": 0,
    "medallion-forest": 0,
    "medallion-fire": 0,
    "medallion-water": 0,
    "medallion-spirit": 0,
    "medallion-shadow": 0,
    "medallion-light": 0,
    
    /* DUNGEON TRACKER */
    
    "d0-medallion": 0,
    "d1-medallion": 0,
    "d2-medallion": 0,
    "d3-medallion": 0,
    "d4-medallion": 0,
    "d5-medallion": 0,
    "d6-medallion": 0,
    "d7-medallion": 0,
    "d8-medallion": 0,

    "d4-keycount": 0,
    "d5-keycount": 0,
    "d6-keycount": 0,
    "d7-keycount": 0,
    "d8-keycount": 0,
    "d9-keycount": 0,
    "d10-keycount": 0,
    "d11-keycount": 0,
    "d12-keycount": 0,

    "d4-bosskey": 0,
    "d5-bosskey": 0,
    "d6-bosskey": 0,
    "d7-bosskey": 0,
    "d8-bosskey": 0,
    "d9-bosskey": 0
};
var sidestates = {
    "heart-piece": 0,
    "heart-container": 0,
    "skulltulas": 0,
    "item-beans": 0
};