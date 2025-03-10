[b][size=5]Civ7 Center Capital Mod[/size][/b]
---------------------------------------

[size=4][b]Features[/b][/size]
- Center to Capital with 'Home' key
- Cycle Cities with 'PageUp' and 'PageDown'
- (Keys are customizable)

---

[size=4][b]Version History[/b][/size]
[b]0.0.4 (Latest)[/b]
- Configurable city cycling order: 1. Grouped, 2. Alphabetical, 3. Geographical 4. Game default
- Improved city cycling logic — city list now refreshes [b]only when cycling[/b] for better performance.
- Added [b][code]ENABLE_CONSOLE_ERRORS[/code][/b] flag for easily toggling debug messages (set [code]true[/code] for development, [code]false[/code] for release).
- Added [b]timestamp logic[/b] to refresh the city table only if the previous refresh was [b]over 20 seconds ago[/b].
- Fixed issue where pressing 'Home' on a focused Capital wouldn't open the city details panel.
- Improved internal logging system for better debugging during development.

[b]0.0.3[/b]
- Removed dependency on [code]lib-register-keybinding[/code].
- Keybindings are now managed in [b][code]input-action-default-gestures.xml[/code][/b] (no longer configurable in game settings).
- Added user-configurable camera movement (zoom vs. instant).
- Ensured mod loads last to prevent conflicts.
- Capital details panel now opens on second press of the 'Home' key if already centered on the Capital.

[b]0.0.2[/b]
- Hotkeys now assignable in game settings menu, not just main menu. [i](This version causes compatibility issues.)[/i]

[b]0.0.1[/b]
- Initial release.

---

[size=4][b]Tested on Civilization 7 version 1.1.0[/b][/size]

---

[size=4][b]What Does This Mod Do?[/b][/size]
This mod adds three custom hotkeys to make city management easier in [b]Civilization VII[/b]:
- [b]Home[/b] → Center Camera on Capital. Second press → Open Capital city details panel
- [b]PageUp[/b] → Cycle Forward Through Cities
- [b]PageDown[/b] → Cycle Backward Through Cities

---

[size=4][b]Installation[/b][/size]
1. Copy the [b]"Civ7_CenterCapitalMod"[/b] folder into your Sid Meier’s Civilization VII Mods directory.

[b]Common Path:[/b]
[code]
C:\Users\<YourUserName>\AppData\Local\Firaxis Games\Sid Meier's Civilization VII\Mods
[/code]

2. Launch the game and enable the mod under [b]"Additional Content"[/b] (or your mod manager of choice).

---

[size=4][b]Customizing Keybindings[/b][/size]
Keybindings are now configured in the mod's XML file:

1. Open: [b]Civ7_CenterCapitalMod\data\input-action-default-gestures.xml[/b]
2. Locate these lines:
[code]
GestureData="KEY_HOME"
GestureData="KEY_PAGEUP"
GestureData="KEY_PAGEDOWN"
[/code]
3. Edit the [code]GestureData[/code] value. Examples:
- Single key: [code]KEY_G[/code]
- Ctrl + key: [code]KEY_CONTROL+KEY_H[/code]
- Alt + key: [code]KEY_ALT+KEY_H[/code]
- Ctrl + Alt + key: [code]KEY_CONTROL+KEY_ALT+KEY_H[/code]
- Shift + key: [code]KEY_SHIFT+KEY_N[/code]

4. Save the file and restart the game.

---

[size=4][b]New Features[/b][/size]

[b]Configurable City Cycling Modes (New!)[/b]
The mod now offers [b]4 distinct city cycling modes[/b] for improved navigation:

1. [b]Default Order[/b]  
   - Player’s cities sorted by city ID in alphabetical order, starting with the capital.  
2. [b]Alphabetical Order[/b]  
   - All cities are sorted alphabetically. The capital is forced to be at index 0.  
3. [b]Geographical Order[/b] [i](Recommended)[/i]  
   - Cities are sorted by proximity to the capital, with an advanced [b]look-ahead pathfinding system[/b] for optimal path creation.  
   - Use this setting for a natural city navigation path.  
4. [b]Game Default Order[/b]  
   - Uses the game’s native order — no sorting applied.  

To configure the cycling mode:
1. Open: [b]Civ7_CenterCapitalMod\UI\focus-capital.js[/b]
2. Locate this setting at the top of the file:
[code]
const CYCLING_MODE = 3;
[/code]

3. Change the number to the desired mode:

| Mode | Description |
|------|--------------------------------|
| 1     | Grouped Order |
| 2     | Alphabetical Order |
| 3     | Geographical Order (Recommended) |
| 4     | Game Default Order |

4. Save the file and restart the game.

---

### [b]Timestamp Logic for Efficient Refreshing (New!)[/b]
To improve performance, the mod now refreshes the city table only if the last refresh was [b]over 20 seconds ago[/b].
- Located in [code]focus-capital.js[/code]: 
[code]
const REFRESH_INTERVAL = 20000; // Time in milliseconds (20 seconds)
[/code]

---

[size=4][b]Troubleshooting[/b][/size]
- Ensure this mod does not conflict with other mods using the same key actions.
- Confirm that the mod folder is in the correct location and that the mod is enabled.
- The camera actions are only active in the [b]"World"[/b] context (the main map view). They won’t work in menus or special screens.
- If changes don’t take effect, try disabling other mods to check for conflicts.

---

[size=4][b]Enjoy the Mod![/b][/size]
Feel free to adapt this mod for your own needs! If you’d like to improve or expand features, contributions are welcome.

---

[size=4][b]Thanks for testing and suggestions:[/b][/size]
[i][url=https://forums.civfanatics.com/members/finwickle.295463/]Finwickle[/url][/i]  
[i][url=https://forums.civfanatics.com/members/beezany.156525/]beezany[/url][/i]  
