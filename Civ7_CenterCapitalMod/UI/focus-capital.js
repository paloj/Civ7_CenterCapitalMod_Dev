// focus-capital.js

//-------------------------------------------------------
/**
 * User Option: Set to true for instant camera movement, false for smooth zoom.
 */
const INSTANT_CAMERA = false;   // Change this to true if you want instantaneous movement.
const RESET_CYCLE = true;       // Change this to false if you don't want to reset the cycle when the capital is focused.

//-------------------------------------------------------
window.addEventListener("engine-input", (event) => {
    const actionName = event.detail?.name;
    const actionStatus = event.detail?.status;

    // FINISH typically corresponds to key-up, so we only handle the action once per press.
    if (actionStatus !== InputActionStatuses.FINISH) {
        return;
    }

    // Obtain the local player's object.
    const player = Players.get(GameContext.localPlayerID);
    if (!player) {
        console.error("❌ No local player found!");
        return;
    }

    // 1) Center on Capital
    if (actionName === "camera-center-capital") {
        console.error("🔑 Centering on capital...");
        const capital = player.Cities?.getCapital();
        if (capital) {
            console.error(`✅ Found capital: ${capital.name}`);

            // Workaround to check if the camera is already on the capital
            const screenCenterPlot = Camera.pickPlotFromPoint(window.innerWidth / 2, window.innerHeight / 2);
            const isAlreadyFocused = screenCenterPlot &&
                screenCenterPlot.x === capital.location.x &&
                screenCenterPlot.y === capital.location.y;

            // If the camera is already on the capital, open the city panel.
            if (isAlreadyFocused) {
                console.error("🔑 Selecting capital to open city panel...");
                UI.Player.selectCity(capital.id);
                return;
            }

            // Focus on the capital
            console.error("🔄 Moving camera to capital...");
            Camera.lookAtPlot(capital.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });

            // Reset the city cycle if needed
            if (RESET_CYCLE) {
                window.cityIndex = 0;
            }
        } else {
            console.error("❌ No capital found!");
        }
    }

    // 2) Cycle forward through player's cities
    else if (actionName === "camera-cycle-cities-forward") {
        console.error("🔑 Cycling forward through cities...");
        const cities = player.Cities?.getCities();
        if (cities && cities.length > 0) {
            if (window.cityIndex === undefined) {
                window.cityIndex = 0; // Initialize cycling
            } else {
                window.cityIndex += 1;
            }

            if (window.cityIndex >= cities.length) {
                window.cityIndex = 0; // Wrap around to first city
            }

            const city = cities[window.cityIndex];
            console.error(`✅ Jumping to city: ${city.name}`);
            lastFocusedCity = city; // Track the last city
            Camera.lookAtPlot(city.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });
        } else {
            console.error("❌ No cities found!");
        }
    }

    // 3) Cycle backward through player's cities
    else if (actionName === "camera-cycle-cities-backward") {
        console.error("🔑 Cycling backward through cities...");
        const cities = player.Cities?.getCities();
        if (cities && cities.length > 0) {
            window.cityIndex = (window.cityIndex || 0) - 1;
            if (window.cityIndex < 0) {
                window.cityIndex = cities.length - 1;
            }
            const city = cities[window.cityIndex];
            console.error(`✅ Jumping to city: ${city.name}`);
            lastFocusedCity = city; // Track the last city
            Camera.lookAtPlot(city.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });
        } else {
            console.error("❌ No cities found!");
        }
    }
});