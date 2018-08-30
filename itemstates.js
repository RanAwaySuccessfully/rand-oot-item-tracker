"use strict";
function manageItemStates(item, set, state) {
    if (!item) {return 0;}
    item = item.replace(/(N64|3DS|USR)\//g, "");
    item = item.replace(/url\("/g,  "").replace(/.png("\))?/g, "");
    item = item.replace(/-(n|s)(1)?!/g, "");
    if (set) {
        itemstates[item] = state;
        drawMap();
        drawSideInfo();
        saveItemStates();
    } else {
        return itemstates[item];
    }
}
function saveItemStates() {
    var string = "";
    var i;
    for (i in itemstates) {string += itemstates[i];}
    createCookie("itemstates", string);
}
function readItemStates() {
    var string = readCookie("itemstates");
    if (!string) {return;}
    var array = string.split("");
    var i;
    var key;
    for (key in itemstates) {itemstates[key] = array[i]; i++;}
}
var itemstates = {
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
    "medallion-light": 0
};
var sidestates = {
    "heart-piece": 0,
    "heart-container": 0,
    "skulltullas": 0,
    "item-beans": 0
};