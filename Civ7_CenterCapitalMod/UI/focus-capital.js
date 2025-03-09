// focus-capital.js

//-------------------------------------------------------
/**
 * User Option: Set to true for instant camera movement, false for smooth zoom.
 */
const INSTANT_CAMERA = false;           // Change this to true if you want instantaneous movement.
const RESET_CYCLE = true;               // Change this to false if you don't want to reset the cycle when the capital is focused.
const ENABLE_CONSOLE_ERRORS = false;    // Set to false for release version to disable logs

window.isCapitalFocused = false;
window.cityIndex = 0;

//-------------------------------------------------------
const log = (type, message) => {
    if (!ENABLE_CONSOLE_ERRORS) return;
    switch (type) {
        case "INFO": console.error(`[INFO] ${message}`); break;
        case "SUCCESS": console.error(`[SUCCESS] ${message}`); break;
        case "ERROR": console.error(`[ERROR] ${message}`); break;
        case "ACTION": console.error(`[ACTION] ${message}`); break;
        default: console.error(`[LOG] ${message}`);
    }
};

//-------------------------------------------------------
window.addEventListener("engine-input", (event) => {
    const actionName = event.detail?.name;
    const actionStatus = event.detail?.status;

    if (actionStatus !== InputActionStatuses.FINISH) {
        return;
    }

    const player = Players.get(GameContext.localPlayerID);
    if (!player) {
        log("ERROR", "No local player found!");
        return;
    }

    const refreshCityTable = () => {
        log("INFO", "Refreshing city table...");

        const cities = player.Cities?.getCities();
        if (!cities || cities.length === 0) {
            log("ERROR", "No cities found!");
            window.cityCycleTable = [];
            return;
        }

        const playerCities = [];
        const capturedCities = [];

        cities.forEach(city => {
            if (city.name.startsWith("LOC_CITY_NAME_MISSISSIPPIAN")) {
                playerCities.push(city);
            } else {
                capturedCities.push(city);
            }
        });

        playerCities.sort((a, b) => parseInt(a.name.match(/\d+/)?.[0] || 0) - parseInt(b.name.match(/\d+/)?.[0] || 0));
        capturedCities.sort((a, b) => parseInt(a.name.match(/\d+/)?.[0] || 0) - parseInt(b.name.match(/\d+/)?.[0] || 0));

        window.cityCycleTable = [...playerCities, ...capturedCities];

        log("INFO", "City Table Refreshed Successfully:");
        window.cityCycleTable.forEach((city, index) => {
            log("INFO", `   -> Index [${index}]: ${city.name} (ID: ${city.id})`);
        });

        if (!window.cityIndex || window.cityIndex >= window.cityCycleTable.length) {
            log("INFO", "Resetting city index to 0.");
            window.cityIndex = 0;
        }
    };

    const getCityFromTable = (index) => {
        log("INFO", `Looking for city at index [${index}]...`);
        return window.cityCycleTable?.[index] || null;
    };

    // ============================
    // Capital Focus Logic (No Refresh Required)
    // ============================
    if (actionName === "camera-center-capital") {
        log("ACTION", "Centering on capital...");

        const capital = player.Cities?.getCapital();
        if (!capital) {
            log("ERROR", "No capital found!");
            return;
        }

        log("SUCCESS", `Found capital: ${capital.name} (ID: ${capital.id})`);

        const screenCenterPlot = Camera.pickPlotFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const isAlreadyFocused = screenCenterPlot &&
            screenCenterPlot.x === capital.location.x &&
            screenCenterPlot.y === capital.location.y;

        if (isAlreadyFocused && window.isCapitalFocused) {
            log("ACTION", "Selecting capital to open city panel...");
            UI.Player.selectCity(capital.id);
            return;
        }

        log("ACTION", "Moving camera to capital...");
        Camera.lookAtPlot(capital.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });

        window.isCapitalFocused = true;
        window.cityIndex = 0;
    }

    // ============================
    // City Cycling Logic (With Refresh & Sorting)
    // ============================
    if (actionName === "camera-cycle-cities-forward") {
        log("ACTION", "Cycling forward through cities...");
        refreshCityTable();

        if (window.cityCycleTable.length > 0) {
            window.cityIndex = (window.cityIndex + 1) % window.cityCycleTable.length;
            const city = getCityFromTable(window.cityIndex);

            if (city) {
                log("SUCCESS", `Jumping to city: ${city.name} (ID: ${city.id}) at index [${window.cityIndex}]`);
                Camera.lookAtPlot(city.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });

                window.isCapitalFocused = city.name === "LOC_CITY_NAME_MISSISSIPPIAN1";
            } else {
                log("ERROR", `City not found in table at index [${window.cityIndex}].`);
            }
        } else {
            log("ERROR", "No cities available in the cycle table!");
        }
    }

    if (actionName === "camera-cycle-cities-backward") {
        log("ACTION", "Cycling backward through cities...");
        refreshCityTable();

        if (window.cityCycleTable.length > 0) {
            window.cityIndex = (window.cityIndex - 1 + window.cityCycleTable.length) % window.cityCycleTable.length;
            const city = getCityFromTable(window.cityIndex);

            if (city) {
                log("SUCCESS", `Jumping to city: ${city.name} (ID: ${city.id}) at index [${window.cityIndex}]`);
                Camera.lookAtPlot(city.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });

                window.isCapitalFocused = city.name === "LOC_CITY_NAME_MISSISSIPPIAN1";
            } else {
                log("ERROR", `City not found in table at index [${window.cityIndex}].`);
            }
        } else {
            log("ERROR", "No cities available in the cycle table!");
        }
    }
});
