Civ7 Center Capital Mod
-------------------------
Version History
0.0.3 - Removed dependency on lib-register-keybinding. input-action-default-gestures.xml now holds the keybindings so they are no longer changeable from the game settings menu.
      - Added user-configurable camera movement (zoom vs. instant).
      - Ensured mod loads last to prevent conflicts.
      - The default keys for Center to Capital is Home and city cycling PageUp=Next city, PageDown=Previous city.
      - If capital is centered and the center-to-capital key is pressed again it opens the Capital​ city details panel.
0.0.2 - Hotkeys now assignable in game settings menu, not just main menu. (Thanks maddachshund). *This version causes compability issues!
0.0.1 - Initial release.
Tested on Civilization 7 version 1.0.1 Patch 3.

What does this mod do?
This mod adds three custom hotkeys to make city management easier in Civilization VII:
- Home → Center Camera on Capital. Second press → Open Capital city details panel
- PageUp → Cycle Forward Through Cities
- PageDown → Cycle Backward Through Cities

Installation
-------------------------
1. Copy the "Civ7_CenterCapitalMod" folder into your Sid Meier’s Civilization VII Mods directory.
  Common Path:
C:\Users<YourUserName>\AppData\Local\Firaxis Games\Sid Meier's Civilization VII\Mods
2. Launch the game and enable the mod under "Additional Content" (or your mod manager of choice).

To change keybindings, modify input-action-default-gestures.xml in the mod folder:
1. Open: Civ7_CenterCapitalMod\data\input-action-default-gestures.xml
2. Locate these lines:
GestureData="KEY_HOME"
GestureData="KEY_PAGEUP"
GestureData="KEY_PAGEDOWN"

3. Edit the GestureData value. Examples:
o Single key: KEY_G
o Ctrl + key: KEY_CONTROL+KEY_H
o Alt + key: KEY_ALT+KEY_H
o Ctrl + Alt + key: KEY_CONTROL+KEY_ALT+KEY_H
o Shift + key: KEY_SHIFT+KEY_N
4. Save the file and restart the game.

User-Configurable Camera Movement (New!)
-------------------------
You can now choose between zooming in or instantly moving the camera.
1. Open: Civ7_CenterCapitalMod\UI\focus-capital.js
2. Locate this setting at the top of the file:
  const INSTANT_CAMERA = false; // Change to `true` for instant camera movement.
3. To enable instant movement, change false to true:
  const INSTANT_CAMERA = true;
4. Save the file and restart the game.

Reset city-cycle-index when centering to Capital (New!)
-------------------------
By default the mod now resets the city cycling index after the Capital has been centered.
To disable the resetting of city cycling index:
1. Open: Civ7_CenterCapitalMod\UI\focus-capital.js
2. Locate this setting at the top of the file:
const RESET_CYCLE = true; // Change this to `false` if you don't want to reset the cycle when the capital is focused.
3. To disable the resetting, change the true to false:
const RESET_CYCLE = false;
4. Save the file and restart the game.

Ensuring the Mod Loads Last
This mod is configured to load after other mods to avoid conflicts.
- References to base-standard and core systems, ensuring it loads last:
  <References>
    <Mod id="base-standard" title="Base Game" />
    <Mod id="core" title="Core Systems" />
</References>
- A high sort index (9999) to prioritize late loading:
  <SortIndex>9999</SortIndex>
If other mods still interfere, you can rename the mod folder to start with "zzz_" to manually force it to load last:
zzz_Civ7_CenterCapitalMod

Troubleshooting
- Make sure this mod does not conflict with other mods using the same key actions.
- Confirm that the mod folder is in the correct location and that the mod is enabled.
- The camera actions are only active in the "World" context (the main map view). If you are in a menu or a special screen, the hotkeys may not work.
- If changes don’t take effect, try disabling other mods to check for conflicts.

Enjoy the Mod!
Feel free to adapt the mod further for your own needs. You can add additional actions or localize it for other languages by editing the files in the "text" folder.

Common Key Identifiers
Alphanumeric Keys
KEY_0 through KEY_9
KEY_A through KEY_Z
Function Keys
KEY_F1 through KEY_F12
Arrow Keys
KEY_UP
KEY_DOWN
KEY_LEFT
KEY_RIGHT
Editing / Navigation Keys
KEY_BACKSPACE
KEY_DELETE
KEY_INSERT
KEY_HOME
KEY_END
KEY_PAGEUP (sometimes KEY_PGUP)
KEY_PAGEDOWN (sometimes KEY_PGDOWN)
Whitespace / Control Keys
KEY_TAB
KEY_SPACE
KEY_ENTER (or sometimes KEY_RETURN)
KEY_ESCAPE
Modifier Keys
KEY_SHIFT
KEY_ALT
KEY_CONTROL (sometimes spelled KEY_CTRL in certain mods)
Note: Caps Lock, Windows key, or other special keys may not always be recognized or may use different identifiers. Check for collisions or test them directly to confirm they’re supported in your environment.
