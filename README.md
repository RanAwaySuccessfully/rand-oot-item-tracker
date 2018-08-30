# OoT Randomizer Item Tracker
This is an attempt at making a better item tracker for the Ocarina of Time Randomizer. It runs in your browser, so there's no need to install or download anything. It is heavily based on [TestRunnerSRL's item tracker](https://github.com/TestRunnerSRL/oot-tracker).

# Adding New Items
New items can easily be added. You just need to create a new .png for both the N64 and 3DS iconsets. Then, you need to add the item's filename to the array on `var grid`, inside `drawItemList()` on `tracker.js`. Lastly, add the filename to the list in `var itemstates` on `itemstates.js`. There you go! Item added.

It's recommended for the image to have the same height as (or a multiple of) the image's width.

## Updating Types
The item tracker looks at the item's filename and size in order to determine how it'll update the item. Items that have the same width and height are switched between `state=0` and `state=1`. Items with higher heights are updated sequentially, with the topmost item being the `state=0` (unobtained) and `state=1` (obtained), the second one being `state=2`, the third one being `state=3` and so forth. These items are marked with a `-s!` at the end of their filename, so the item tracker can tell them apart from the rest. There's also items with `-n!`, which work the same way except they skip `state=1`, that is, their topmost icon is never on the "on" state, it just skips right to the next one.

Items with `-n!` and `-s!` must also have `-n1!` and `-s1!` versions. These are the images that will be displayed while in Editing Mode.

# To Do List

- Make a version with the v2.5 logic
- Dungeon Trackers (what medallion is in that dungeon, key counters, boss key marker)
- Custom Icon Sets
- Right-clicking on a medallion/song to mark it as collected doesn't have any effect on the map. It would be nice if items marked as collected in one appeared as collected on the other.
- Having an option to disable the checkmark on all songs or all songs+medallions+stones.

It is **very** likely that there's things missing here. If you have any suggestions or questions, feel free to ask.
