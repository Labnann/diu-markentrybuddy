const EXT =
    typeof browser !== "undefined"
        ? browser
        : chrome;


const field =
    document.getElementById("field");

const fullMark =
    document.getElementById("fullMark");

const startHotkey =
    document.getElementById("startHotkey");

const moveHotkey =
    document.getElementById("moveHotkey");

const submitHotkey =
    document.getElementById("submitHotkey");

const saveButton =
    document.getElementById("save");

const startButton =
    document.getElementById("start");

const clearButton =
    document.getElementById("clear");

const status =
    document.getElementById("status");


const TARGET_URL =
    "https://teacherportal.diu.edu.bd/";


async function getActiveTab() {

    const tabs =
        await EXT.tabs.query({
            active: true,
            currentWindow: true
        });

    return tabs[0];
}


async function sendMessage(message) {

    const tab =
        await getActiveTab();


    if (!tab || !tab.id) {

        throw new Error(
            "No active tab."
        );
    }


    if (
        !tab.url ||
        !tab.url.startsWith(TARGET_URL)
    ) {

        throw new Error(
            "Open teacherportal.diu.edu.bd first."
        );
    }


    return await EXT.tabs.sendMessage(
        tab.id,
        message
    );
}


/*
 * Convert keyboard event into a
 * human-readable key combination.
 */

function eventToHotkey(event) {

    const parts = [];


    if (event.ctrlKey)
        parts.push("Ctrl");


    if (event.altKey)
        parts.push("Alt");


    if (event.shiftKey)
        parts.push("Shift");


    if (event.metaKey)
        parts.push("Meta");


    let key =
        event.key;


    if (key === " ")
        key = "Space";


    /*
     * Ignore modifier-only presses.
     */

    if (
        key === "Control" ||
        key === "Alt" ||
        key === "Shift" ||
        key === "Meta"
    ) {

        return null;
    }


    /*
     * Make single letters uppercase.
     */

    if (key.length === 1)
        key = key.toUpperCase();


    parts.push(key);


    return parts.join("+");
}


/*
 * Configure a key field.
 */

function setupHotkeyInput(input) {

    input.addEventListener(
        "keydown",
        event => {

            event.preventDefault();
            event.stopPropagation();


            const value =
                eventToHotkey(event);


            if (value) {

                input.value =
                    value;
            }
        }
    );


    input.addEventListener(
        "click",
        () => {

            input.focus();
        }
    );
}


setupHotkeyInput(
    startHotkey
);

setupHotkeyInput(
    moveHotkey
);

setupHotkeyInput(
    submitHotkey
);


/*
 * Defaults.
 */

if (!startHotkey.value)
    startHotkey.value = "Alt+E";

if (!moveHotkey.value)
    moveHotkey.value = "Space";

if (!submitHotkey.value)
    submitHotkey.value = "Enter";


function readConfig() {

    let maximumMark =
        null;


    if (
        fullMark.value.trim() !== ""
    ) {

        maximumMark =
            Number(
                fullMark.value
            );


        if (
            !Number.isFinite(
                maximumMark
            ) ||
            maximumMark < 0
        ) {

            throw new Error(
                "Invalid full mark."
            );
        }
    }


    const config = {

        box:
            field.value,

        fullMark:
            maximumMark,

        hotkey:
            startHotkey.value.trim(),

        moveHotkey:
            moveHotkey.value.trim(),

        submitHotkey:
            submitHotkey.value.trim()
    };


    if (!config.hotkey)
        throw new Error(
            "Please configure the start-entry hotkey."
        );


    if (!config.moveHotkey)
        throw new Error(
            "Please configure the ID → Mark key."
        );


    if (!config.submitHotkey)
        throw new Error(
            "Please configure the submit key."
        );


    return config;
}


function showStatus(message) {

    status.innerText =
        message;
}


saveButton.addEventListener(
    "click",
    async () => {

        try {

            const config =
                readConfig();


            await sendMessage({

                type:
                    "SET_CONFIG",

                config
            });


            showStatus(
                "Configuration set."
            );

        } catch (error) {

            showStatus(
                error.message
            );
        }
    }
);


startButton.addEventListener(
    "click",
    async () => {

        try {

            const config =
                readConfig();


            await sendMessage({

                type:
                    "SET_CONFIG",

                config
            });


            await sendMessage({

                type:
                    "START"
            });


            window.close();

        } catch (error) {

            showStatus(
                error.message
            );
        }
    }
);


clearButton.addEventListener(
    "click",
    async () => {

        try {

            await sendMessage({

                type:
                    "CLEAR_CONFIG"
            });


            /*
             * Restore defaults in popup.
             */

            startHotkey.value =
                "Alt+E";

            moveHotkey.value =
                "Space";

            submitHotkey.value =
                "Enter";


            showStatus(
                "Configuration cleared."
            );

        } catch (error) {

            showStatus(
                error.message
            );
        }
    }
);


/*
 * Load current in-memory configuration.
 */

(async function loadConfig() {

    try {

        const response =
            await sendMessage({

                type:
                    "GET_CONFIG"
            });


        if (
            !response ||
            !response.config
        ) {

            return;
        }


        const config =
            response.config;


        field.value =
            config.box;


        fullMark.value =
            config.fullMark ?? "";


        startHotkey.value =
            config.hotkey || "Alt+E";


        moveHotkey.value =
            config.moveHotkey || "Space";


        submitHotkey.value =
            config.submitHotkey || "Enter";


        showStatus(
            "Current configuration loaded."
        );

    } catch (error) {

        showStatus(
            error.message
        );
    }

})();
