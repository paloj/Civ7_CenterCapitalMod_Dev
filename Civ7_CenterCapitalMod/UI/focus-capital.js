// focus-capital.js

//-------------------------------------------------------
/**
 * User Option: Set to true for instant camera movement, false for smooth zoom.
 */
const INSTANT_CAMERA = false;           // Change this to true if you want instantaneous movement.
const RESET_CYCLE = true;               // Change this to false if you don't want to reset the cycle when the capital is focused.
const ENABLE_CONSOLE_ERRORS = false;     // Set to false for release version to disable logs
const CYCLING_MODE = 3;                 // 1 = Grouped, 2 = Alphabetical, 3 = Geographical, 4 = Game Default Order
const LOOK_A_HEAD = 3;                  // Number of cities to look ahead for geographical sorting (decrease for performance, increase for accuracy)
const REFRESH_INTERVAL = 20000;         // Minimum time in milliseconds (20s) between city list updates

window.isCapitalFocused = false;
window.cityIndex = 0;
window.lastRefreshTimestamp = 0;        // Last time the city list was refreshed

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

    const sortCities = (cities, capital, mode) => {
        if (!capital) {
            log("ERROR", "Capital not found for sorting!");
            return cities;
        }

        switch (mode) {
            case 1: // Default Order
                const capitalCivMatch = capital.name.match(/LOC_CITY_NAME_(\w+)\d+/);
                const capitalCiv = capitalCivMatch ? capitalCivMatch[1] : null;

                const playerCities = [];
                const capturedCities = [];

                cities.forEach(city => {
                    const civMatch = city.name.match(/LOC_CITY_NAME_(\w+)\d+/);
                    const civPrefix = civMatch ? civMatch[1] : null;

                    if (civPrefix === capitalCiv) {
                        playerCities.push(city);
                    } else {
                        capturedCities.push(city);
                    }
                });

                playerCities.sort((a, b) => a.name.localeCompare(b.name));
                capturedCities.sort((a, b) => a.name.localeCompare(b.name));

                return [...playerCities, ...capturedCities];

            case 2: // Alphabetical Order with Capital at Index 0
                const capitalCity = cities.find(city => city.name === capital.name);

                if (!capitalCity) {
                    log("ERROR", "Capital not found in city list!");
                    return cities; // Fallback to original list to avoid empty tables
                }

                const sortedCities = [...cities].sort((a, b) => {
                    const aName = Locale.compose(a.name).replace("LOC_CITY_NAME_", "");
                    const bName = Locale.compose(b.name).replace("LOC_CITY_NAME_", "");
                    return aName.localeCompare(bName);
                });

                // Move capital to index 0
                const capitalIndex = sortedCities.findIndex(city => city.name === capitalCity.name);
                if (capitalIndex !== -1) {
                    sortedCities.splice(capitalIndex, 1); // Remove capital from its current position
                    sortedCities.unshift(capitalCity);    // Place capital at index 0
                }

                return sortedCities;

            case 3: // Geographical Order
                return sortByGeographicalOrder(cities, capital, LOOK_A_HEAD);

            case 4: // Game Default Order
                return cities; // No sorting applied

            default:
                log("ERROR", "Invalid cycling mode selected.");
                return cities;
        }
    };

    const sortByGeographicalOrder = (cities, capital, lookaheadSteps = 3) => {
        log("DEBUG", `Starting sortByGeographicalOrder. Total cities before filtering: ${cities.length}`);

        const uniqueCities = cities.filter(city => {
            const isCapital = city.id === capital.id || city.name === capital.name;
            if (isCapital) log("DEBUG", `Removed duplicate capital from list: ${city.name} (ID: ${city.id})`);
            return !isCapital;
        });

        log("DEBUG", `Cities after capital removal: ${uniqueCities.length}`);

        const sortedCities = [capital];
        log("DEBUG", `Capital added to sortedCities at index 0: ${capital.name}`);

        const remainingCities = [...uniqueCities];
        log("DEBUG", `Remaining cities after copying: ${remainingCities.length}`);

        let currentCity = capital;

        while (remainingCities.length) {
            let bestNextCity = null;
            let shortestTotalDistance = Infinity;

            remainingCities.forEach(nextCity => {
                let totalDistance = getDistance(currentCity.location, nextCity.location);
                let visitedCities = new Set([currentCity.id, nextCity.id]);

                let futureCity = nextCity;

                for (let i = 1; i < lookaheadSteps; i++) {
                    let closestFutureCity = null;
                    let shortestFutureDistance = Infinity;

                    remainingCities.forEach(potentialFutureCity => {
                        if (!visitedCities.has(potentialFutureCity.id)) {
                            const distance = getDistance(futureCity.location, potentialFutureCity.location);
                            if (distance < shortestFutureDistance) {
                                shortestFutureDistance = distance;
                                closestFutureCity = potentialFutureCity;
                            }
                        }
                    });

                    if (closestFutureCity) {
                        totalDistance += shortestFutureDistance;
                        visitedCities.add(closestFutureCity.id);
                        futureCity = closestFutureCity;
                    } else {
                        break; // No valid next city in the lookahead chain
                    }
                }

                if (totalDistance < shortestTotalDistance) {
                    shortestTotalDistance = totalDistance;
                    bestNextCity = nextCity;
                }
            });

            if (bestNextCity) {
                log("DEBUG", `Next city added to sortedCities: ${bestNextCity.name}`);
                sortedCities.push(bestNextCity);
                currentCity = bestNextCity;

                const index = remainingCities.indexOf(bestNextCity);
                if (index > -1) {
                    remainingCities.splice(index, 1);
                }
            }
        }

        log("DEBUG", `Sorted cities before duplicate removal: ${sortedCities.map(city => city.name).join(", ")}`);

        const uniqueCityIds = new Set();
        const uniqueSortedCities = sortedCities.filter((city) => {
            if (uniqueCityIds.has(city.id)) {
                log("DEBUG", `Removed duplicate from sorted list: ${city.name}`);
                return false;
            } else {
                uniqueCityIds.add(city.id);
                return true;
            }
        });

        log("DEBUG", `Final sorted cities: ${uniqueSortedCities.map(city => city.name).join(", ")}`);

        return uniqueSortedCities;
    };

    const getDistance = (loc1, loc2) => {
        const dx = loc1.x - loc2.x;
        const dy = loc1.y - loc2.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const refreshCityTable = () => {
        const now = Date.now();

        // Check if refresh should be skipped based on the timestamp
        if (now - window.lastRefreshTimestamp < REFRESH_INTERVAL) {
            log("INFO", `Skipping city table refresh. Last refresh was ${((now - window.lastRefreshTimestamp) / 1000).toFixed(1)}s ago.`);
            return;
        }

        log("INFO", "Refreshing city table...");

        const cities = player.Cities?.getCities();
        if (!cities || cities.length === 0) {
            log("ERROR", "No cities found!");
            window.cityCycleTable = [];
            return;
        }

        const capital = player.Cities?.getCapital();
        if (!capital) {
            log("ERROR", "No capital found!");
            return;
        }

        window.cityCycleTable = sortCities(cities, capital, CYCLING_MODE);

        log("INFO", "City Table Refreshed Successfully:");
        window.cityCycleTable.forEach((city, index) => {
            const localizedCityName = Locale.compose(city.name);
            log("INFO", `   -> Index [${index}]: ${city.name}=${localizedCityName} (ID: ${city.id})`);
        });

        // Log how long the refresh took
        log("INFO", `City table refresh took ${(Date.now() - now).toFixed(1)}ms.`);

        // Update the timestamp after successful refresh
        window.lastRefreshTimestamp = now;

        if (window.cityIndex < 0) window.cityIndex = 0;
    };

    const getCityFromTable = (index) => {
        log("INFO", `Looking for city at index [${index}]...`);
        return window.cityCycleTable?.[index] || null;
    };

    // ============================
    // Capital Focus Logic
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
    // City Cycling Logic
    // ============================
    if (actionName === "camera-cycle-cities-forward") {
        log("ACTION", "Cycling forward through cities...");
        refreshCityTable();

        if (!window.cityCycleTable.length) {
            log("ERROR", "City cycle table is empty!");
            return;
        }

        window.cityIndex = (window.cityIndex + 1) % window.cityCycleTable.length;

        const city = getCityFromTable(window.cityIndex);

        if (city) {
            log("SUCCESS", `Jumping to city: ${city.name}=${Locale.compose(city.name)} at index [${window.cityIndex}]`);
            Camera.lookAtPlot(city.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });
            window.isCapitalFocused = city.name === player.Cities.getCapital().name;
        } else {
            log("ERROR", `City not found at index [${window.cityIndex}]`);
        }
    }

    if (actionName === "camera-cycle-cities-backward") {
        log("ACTION", "Cycling backward through cities...");
        refreshCityTable();

        if (!window.cityCycleTable.length) {
            log("ERROR", "City cycle table is empty!");
            return;
        }

        window.cityIndex = (window.cityIndex - 1 + window.cityCycleTable.length) % window.cityCycleTable.length;

        const city = getCityFromTable(window.cityIndex);

        if (city) {
            log("SUCCESS", `Jumping to city: ${city.name}=${Locale.compose(city.name)} at index [${window.cityIndex}]`);
            Camera.lookAtPlot(city.location, INSTANT_CAMERA ? { instantaneous: true } : { zoom: 0.25 });
            window.isCapitalFocused = city.name === player.Cities.getCapital().name;
        } else {
            log("ERROR", `City not found at index [${window.cityIndex}]`);
        }
    }
});
