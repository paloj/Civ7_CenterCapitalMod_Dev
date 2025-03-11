[B][SIZE=5]Civ7 Center Capital Mod[/SIZE][/B]
---------------------------------------

[SIZE=4][B]Features[/B][/SIZE]
- Center to Capital with 'Home' key
- Cycle Cities with 'PageUp' and 'PageDown'
- (Keys are customizable)

---

[SIZE=4][B]Version History[/B][/SIZE]
[B]0.0.4 (Latest)[/B]
- Configurable city cycling order: 1. Grouped, 2. Alphabetical, 3. Geographical 4. Game default
- Improved city cycling logic — city list now refreshes [B]only when cycling[/B] for better performance.
- Added [B][ICODE]ENABLE_CONSOLE_ERRORS[/ICODE][/B] flag for easily toggling debug messages (set [ICODE]true[/ICODE] for development, [ICODE]false[/ICODE] for release).
- Added [B]timestamp logic[/B] to refresh the city table only if the previous refresh was [B]over 20 seconds ago[/B].
- Fixed issue where pressing 'Home' on a focused Capital wouldn't open the city details panel.
- Improved internal logging system for better debugging during development.

[B]0.0.3[/B]
- Removed dependency on [ICODE]lib-register-keybinding[/ICODE]
- Keybindings are now managed in [B][ICODE]input-action-default-gestures.xml[/ICODE][/B] (no longer configurable in game settings).
- Added user-configurable camera movement (zoom vs. instant).
- Ensured mod loads last to prevent conflicts.
- Capital details panel now opens on second press of the 'Home' key if already centered on the Capital.

[B]0.0.2[/B]
- Hotkeys now assignable in game settings menu, not just main menu. [I](This version causes compatibility issues.)[/I]

[B]0.0.1[/B]
- Initial release.
---

[SIZE=4][B]Tested on Civilization 7 version 1.1.0[/B][/SIZE]

---

[SIZE=4][B]What Does This Mod Do?[/B][/SIZE]
This mod adds three custom hotkeys to make city management easier in [B]Civilization VII[/B]:
- [B]Home[/B] → Center Camera on Capital. Second press → Open Capital city details panel
- [B]PageUp[/B] → Cycle Forward Through Cities
- [B]PageDown[/B] → Cycle Backward Through Cities

---

[SIZE=4][B]Installation[/B][/SIZE]
1. Copy the [B]"Civ7_CenterCapitalMod"[/B] folder into your Sid Meier’s Civilization VII Mods directory.

[B]Common Path:[/B]
[ICODE]C:\Users\<YourUserName>\AppData\Local\Firaxis Games\Sid Meier's Civilization VII\Mods[/ICODE]

2. Launch the game and enable the mod under [B]"Additional Content"[/B] (or your mod manager of choice).

---

[SIZE=4][B]Customizing Keybindings[/B][/SIZE]
Keybindings are now configured in the mod's XML file:

1. Open: [B]Civ7_CenterCapitalMod\data\input-action-default-gestures.xml[/B]
2. Locate these lines:
[ICODE]GestureData="KEY_HOME"[/ICODE]
[ICODE]GestureData="KEY_PAGEUP"[/ICODE]
[ICODE]GestureData="KEY_PAGEDOWN"[/ICODE]

3. Edit the [ICODE]GestureData[/ICODE] value. Examples:
- Single key: [ICODE]KEY_G[/ICODE]
- Ctrl + key: [ICODE]KEY_CONTROL+KEY_H[/ICODE]
- Alt + key: [ICODE]KEY_ALT+KEY_H[/ICODE]
- Ctrl + Alt + key: [ICODE]KEY_CONTROL+KEY_ALT+KEY_H[/ICODE]
- Shift + key: [ICODE]KEY_SHIFT+KEY_N[/ICODE]

4. Save the file and restart the game.

---

[SIZE=4][B]New Features[/B][/SIZE]

[B]Configurable City Cycling Modes (New!)[/B]
The mod now offers [B]4 distinct city cycling modes[/B] for improved navigation:

1. [B]Grouped Order[/B]
   - Player’s cities sorted by city ID in alphabetical order, starting with the capital.
2. [B]Alphabetical Order[/B]
   - All cities are sorted alphabetically. The capital is forced to be at index 0.
3. [B]Geographical Order[/B] [I](Recommended)[/I]
   - Cities are sorted by proximity to the capital, with an advanced [B]look-ahead pathfinding system[/B] for optimal path creation.
   - Use this setting for a natural city navigation path.
   - Capital is forced to be at index 0.
4. [B]Game Default Order[/B]
   - Uses the game’s native order — no sorting applied.

To configure the cycling mode:
1. Open: [B]Civ7_CenterCapitalMod\UI\focus-capital.js[/B]
2. Locate this setting at the top of the file:
[ICODE]const CYCLING_MODE = 3;[/ICODE]

3. Change the number to the desired mode:

| Mode | Description |
|------|--------------------------------|
| 1     | Grouped Order |
| 2     | Alphabetical Order |
| 3     | Geographical Order (Recommended) |
| 4     | Game Default Order |

4. Save the file and restart the game.

---

### [B]Timestamp Logic for Efficient Refreshing (New!)[/B]
To improve performance, the mod now refreshes the city table only if the last refresh was [B]over 20 seconds ago[/B].
- Located in [ICODE]focus-capital.js[/ICODE]
[ICODE]const REFRESH_INTERVAL = 20000; // Time in milliseconds (20 seconds)[/ICODE]
---

[SIZE=4][B]Troubleshooting[/B][/SIZE]
- Ensure this mod does not conflict with other mods using the same key actions.
- Confirm that the mod folder is in the correct location and that the mod is enabled.
- The camera actions are only active in the [B]"World"[/B] context (the main map view). They won’t work in menus or special screens.
- If changes don’t take effect, try disabling other mods to check for conflicts.

---

[SIZE=4][B]Enjoy the Mod![/B][/SIZE]
Feel free to adapt this mod for your own needs! If you’d like to improve or expand features, contributions are welcome.

---

[SIZE=4][B]Thanks for testing and suggestions:[/B][/SIZE]
[I][URL='https://forums.civfanatics.com/members/finwickle.295463/']Finwickle[/URL]
[URL='https://forums.civfanatics.com/members/beezany.156525/']beezany[/URL][/I]