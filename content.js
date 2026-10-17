/*
 * ============================================================
 * MARKS ENTRY HELPER
 * ============================================================
 *
 * Configuration is MEMORY ONLY.
 *
 * Nothing is stored in localStorage.
 * Nothing is persisted.
 *
 * Configurable:
 *
 *     Start-entry hotkey
 *     ID -> Mark key
 *     Submit mark key
 *
 * Default:
 *
 *     Start       Alt+E
 *     ID -> Mark   Space
 *     Submit       Enter
 *
 * ============================================================
 */


// ============================================================
// BROWSER API
// ============================================================

const EXT =
    typeof browser !== "undefined"
        ? browser
        : chrome;


// ============================================================
// TABLE
// ============================================================

let result_tbody =
    document.getElementsByTagName("tbody")[1];


// ============================================================
// TABLE COLUMN INDEXES
// ============================================================

const ID_BOX = 0;
const NAME_BOX = 1;
const ATM_BOX = 2;

const QUIZ1_BOX = 3;
const QUIZ2_BOX = 4;
const QUIZ3_BOX = 5;

const AVG_QUIZ_BOX = 6;

const PRESN_BOX = 7;
const ASSIGN_BOX = 8;
const MIDTERM_BOX = 9;

const UTM_BOX = 10;
const ABS_BOX = 11;

const FINAL_BOX = 12;

const GT_BOX = 13;
const GR_BOX = 14;
const GP_BOX = 15;
const ACTION_BOX = 16;


// ============================================================
// LAB COLUMN INDEXES
// ============================================================

const LAB_FINAL_BOX = 4;
const LAB_REPORT_BOX = 5;
const LAB_PERFORM_BOX = 6;


// ============================================================
// MEMORY-ONLY CONFIGURATION
// ============================================================

let gradeEntryConfig =
    null;


let gradeEntryRunning =
    false;


// ============================================================
// FIELD NAMES
// ============================================================

const GRADE_FIELDS = {

    quiz1:
        "Quiz 1",

    quiz2:
        "Quiz 2",

    quiz3:
        "Quiz 3",

    presn:
        "Presentation",

    assign:
        "Assignment",

    mid:
        "Midterm",

    final:
        "Final",

    labPerformance:
        "Lab Performance",

    labReport:
        "Lab Report",

    labFinal:
        "Lab Final"
};


// ============================================================
// FIND ROW BY ID
// ============================================================

function find_tr_by_id(id) {

    result_tbody =
        document.getElementsByTagName("tbody")[1];


    if (!result_tbody)
        return null;


    for (
        let i = 0;
        i < result_tbody.children.length;
        i++
    ) {

        const tr =
            result_tbody.children[i];


        const idCell =
            tr.children[ID_BOX];


        if (!idCell)
            continue;


        if (
            idCell.innerText.includes(id)
        ) {

            return tr;
        }
    }


    return null;
}


// ============================================================
// ENTER INTO INPUT
// ============================================================

function enter_into_box(
    box,
    value,
    id,
    fieldName
) {

    if (!box)
        return false;


    const oldValue =
        box.value;


    /*
     * Warn if an existing non-zero
     * value is being changed.
     */

    if (
        oldValue !== "" &&
        Number(oldValue) !== 0 &&
        String(oldValue) !== String(value)
    ) {

        console.warn(
            `WARNING: ${id} ${fieldName} changing ` +
            `from "${oldValue}" to "${value}"`,
            box
        );
    }


    box.click();


    box.value =
        value;


    box.dispatchEvent(
        new Event(
            "input",
            {
                bubbles: true
            }
        )
    );


    box.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );


    return true;
}


// ============================================================
// THEORY ENTRY
// ============================================================

function populate_by_id(
    id,
    {
        quiz1 = null,
        quiz2 = null,
        quiz3 = null,
        presn = null,
        assign = null,
        mid = null,
        final = null,
        abs = null
    } = {}
) {

    const subject_tr =
        find_tr_by_id(id);


    if (!subject_tr)
        return false;


    if (quiz1 !== null)
        enter_into_box(
            subject_tr.children[QUIZ1_BOX]
                ?.querySelector("input"),
            quiz1,
            id,
            "QUIZ1"
        );


    if (quiz2 !== null)
        enter_into_box(
            subject_tr.children[QUIZ2_BOX]
                ?.querySelector("input"),
            quiz2,
            id,
            "QUIZ2"
        );


    if (quiz3 !== null)
        enter_into_box(
            subject_tr.children[QUIZ3_BOX]
                ?.querySelector("input"),
            quiz3,
            id,
            "QUIZ3"
        );


    if (presn !== null)
        enter_into_box(
            subject_tr.children[PRESN_BOX]
                ?.querySelector("input"),
            presn,
            id,
            "PRESENTATION"
        );


    if (assign !== null)
        enter_into_box(
            subject_tr.children[ASSIGN_BOX]
                ?.querySelector("input"),
            assign,
            id,
            "ASSIGNMENT"
        );


    if (mid !== null)
        enter_into_box(
            subject_tr.children[MIDTERM_BOX]
                ?.querySelector("input"),
            mid,
            id,
            "MID"
        );


    if (final !== null)
        enter_into_box(
            subject_tr.children[FINAL_BOX]
                ?.querySelector("input"),
            final,
            id,
            "FINAL"
        );


    if (abs !== null) {

        const checkbox =
            subject_tr.children[ABS_BOX]
                ?.querySelector("input");


        if (checkbox) {

            checkbox.checked =
                !!abs;


            checkbox.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );
        }
    }


    subject_tr.click();


    return true;
}


// ============================================================
// LAB ENTRY
// ============================================================

function populate_lab_field(
    id,
    mark,
    field
) {

    const subject_tr =
        find_tr_by_id(id);


    if (!subject_tr)
        return false;


    let columnIndex;
    let fieldName;


    switch (field) {

        case "labPerformance":

            columnIndex =
                LAB_PERFORM_BOX;

            fieldName =
                "LAB_PERFORMANCE";

            break;


        case "labReport":

            columnIndex =
                LAB_REPORT_BOX;

            fieldName =
                "LAB_REPORT";

            break;


        case "labFinal":

            columnIndex =
                LAB_FINAL_BOX;

            fieldName =
                "LAB_FINAL";

            break;


        default:

            console.error(
                "Unknown lab field:",
                field
            );

            return false;
    }


    const input =
        subject_tr.children[columnIndex]
            ?.querySelector("input");


    if (!input) {

        console.error(
            `Could not find ${fieldName} ` +
            `input for student ${id}.`
        );


        return false;
    }


    enter_into_box(
        input,
        mark,
        id,
        fieldName
    );


    subject_tr.click();


    return true;
}


// ============================================================
// APPLY GRADE
// ============================================================

function applyGradeEntry(
    id,
    mark,
    field
) {

    switch (field) {

        case "quiz1":

            return populate_by_id(
                id,
                {
                    quiz1: mark
                }
            );


        case "quiz2":

            return populate_by_id(
                id,
                {
                    quiz2: mark
                }
            );


        case "quiz3":

            return populate_by_id(
                id,
                {
                    quiz3: mark
                }
            );


        case "presn":

            return populate_by_id(
                id,
                {
                    presn: mark
                }
            );


        case "assign":

            return populate_by_id(
                id,
                {
                    assign: mark
                }
            );


        case "mid":

            return populate_by_id(
                id,
                {
                    mid: mark
                }
            );


        case "final":

            return populate_by_id(
                id,
                {
                    final: mark
                }
            );


        case "labPerformance":
        case "labReport":
        case "labFinal":

            return populate_lab_field(
                id,
                mark,
                field
            );


        default:

            console.error(
                "Unknown field:",
                field
            );


            return false;
    }
}


// ============================================================
// FIND ROWS BY LAST 3 DIGITS
// ============================================================

function findRowsBySuffix(
    suffix
) {

    result_tbody =
        document.getElementsByTagName("tbody")[1];


    if (!result_tbody)
        return [];


    const matches = [];


    for (
        let i = 0;
        i < result_tbody.children.length;
        i++
    ) {

        const tr =
            result_tbody.children[i];


        const idCell =
            tr.children[ID_BOX];


        if (!idCell)
            continue;


        const actualId =
            idCell.innerText.trim();


        if (
            actualId.endsWith(suffix)
        ) {

            matches.push({

                tr,

                id:
                    actualId
            });
        }
    }


    return matches;
}


// ============================================================
// NORMALIZE HOTKEY
// ============================================================

function normalizeHotkey(
    hotkey
) {

    if (!hotkey)
        return "";


    return hotkey
        .split("+")
        .map(
            part =>
                part.trim()
        )
        .filter(Boolean)
        .map(
            part =>
                part.length === 1
                    ? part.toUpperCase()
                    : part
        )
        .join("+");
}


// ============================================================
// EVENT TO HOTKEY
// ============================================================

function eventToHotkey(
    event
) {

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


    if (
        key === "Control" ||
        key === "Alt" ||
        key === "Shift" ||
        key === "Meta"
    ) {

        return null;
    }


    if (key.length === 1)
        key = key.toUpperCase();


    parts.push(key);


    return parts.join("+");
}


// ============================================================
// HOTKEY MATCH
// ============================================================

function hotkeyMatches(
    event,
    configuredHotkey
) {

    if (!configuredHotkey)
        return false;


    const pressed =
        normalizeHotkey(
            eventToHotkey(event)
        );


    const configured =
        normalizeHotkey(
            configuredHotkey
        );


    return (
        pressed &&
        configured &&
        pressed === configured
    );
}


// ============================================================
// CREATE DIALOG
// ============================================================

function createDialog(
    title
) {

    document
        .getElementById(
            "grade-entry-overlay"
        )
        ?.remove();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "grade-entry-overlay";


    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 999999;

        background: rgba(0,0,0,.55);

        display: flex;
        align-items: center;
        justify-content: center;

        font-family: Arial, sans-serif;
    `;


    const dialog =
        document.createElement(
            "div"
        );


    dialog.style.cssText = `
        background: white;
        color: #222;

        width: 440px;
        max-width: calc(100vw - 40px);

        padding: 24px;

        border-radius: 10px;

        box-shadow:
            0 10px 40px rgba(0,0,0,.35);
    `;


    const heading =
        document.createElement(
            "h2"
        );


    heading.innerText =
        title;


    heading.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 22px;
    `;


    dialog.appendChild(
        heading
    );


    overlay.appendChild(
        dialog
    );


    document.body.appendChild(
        overlay
    );


    return {
        overlay,
        dialog
    };
}


// ============================================================
// CONFIGURATION DIALOG
// ============================================================

function configureGradeEntry(
    existingConfig = null
) {

    return new Promise(
        resolve => {

            const {
                overlay,
                dialog
            } =
                createDialog(
                    "Grade Entry Configuration"
                );


            // ------------------------------------------------
            // FIELD
            // ------------------------------------------------

            const fieldLabel =
                document.createElement(
                    "label"
                );


            fieldLabel.innerText =
                "Field to update";


            fieldLabel.style.cssText = `
                display: block;
                margin-bottom: 6px;
                font-weight: bold;
            `;


            const fieldSelect =
                document.createElement(
                    "select"
                );


            fieldSelect.style.cssText = `
                box-sizing: border-box;
                width: 100%;

                padding: 9px;
                margin-bottom: 16px;

                border: 1px solid #aaa;
                border-radius: 5px;

                font-size: 15px;
            `;


            for (
                const [
                    value,
                    label
                ]
                of Object.entries(
                    GRADE_FIELDS
                )
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    value;


                option.innerText =
                    label;


                if (
                    existingConfig?.box ===
                    value
                ) {

                    option.selected =
                        true;
                }


                fieldSelect.appendChild(
                    option
                );
            }


            // ------------------------------------------------
            // FULL MARK
            // ------------------------------------------------

            const fullMarkLabel =
                document.createElement(
                    "label"
                );


            fullMarkLabel.innerText =
                "Full mark (optional)";


            fullMarkLabel.style.cssText = `
                display: block;
                margin-bottom: 6px;
                font-weight: bold;
            `;


            const fullMarkInput =
                document.createElement(
                    "input"
                );


            fullMarkInput.type =
                "number";


            fullMarkInput.min =
                "0";


            fullMarkInput.step =
                "any";


            fullMarkInput.placeholder =
                "Example: 40";


            fullMarkInput.value =
                existingConfig?.fullMark ?? "";


            fullMarkInput.style.cssText = `
                box-sizing: border-box;
                width: 100%;

                padding: 9px;
                margin-bottom: 16px;

                border: 1px solid #aaa;
                border-radius: 5px;

                font-size: 15px;
            `;


            // ------------------------------------------------
            // HELPER TO CREATE KEY FIELD
            // ------------------------------------------------

            function createKeyField(
                labelText,
                defaultValue
            ) {

                const label =
                    document.createElement(
                        "label"
                    );


                label.innerText =
                    labelText;


                label.style.cssText = `
                    display: block;
                    margin-bottom: 6px;
                    font-weight: bold;
                `;


                const input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    "text";


                input.readOnly =
                    true;


                input.value =
                    defaultValue;


                input.style.cssText = `
                    box-sizing: border-box;
                    width: 100%;

                    padding: 9px;
                    margin-bottom: 14px;

                    border: 1px solid #aaa;
                    border-radius: 5px;

                    font-size: 15px;

                    background: #f7f7f7;

                    cursor: pointer;
                `;


                input.addEventListener(
                    "keydown",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const value =
                            eventToHotkey(
                                event
                            );


                        if (value) {

                            input.value =
                                value;
                        }
                    }
                );


                return {
                    label,
                    input
                };
            }


            const startField =
                createKeyField(
                    "Start-entry hotkey",
                    existingConfig?.hotkey ||
                        "Alt+E"
                );


            const moveField =
                createKeyField(
                    "ID → Mark key",
                    existingConfig?.moveHotkey ||
                        "Space"
                );


            const submitField =
                createKeyField(
                    "Submit mark key",
                    existingConfig?.submitHotkey ||
                        "Enter"
                );


            // ------------------------------------------------
            // BUTTONS
            // ------------------------------------------------

            const buttons =
                document.createElement(
                    "div"
                );


            buttons.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 5px;
            `;


            const cancelButton =
                document.createElement(
                    "button"
                );


            cancelButton.innerText =
                "Cancel";


            cancelButton.onclick =
                () => {

                    overlay.remove();

                    resolve(null);
                };


            const saveButton =
                document.createElement(
                    "button"
                );


            saveButton.innerText =
                "Save";


            saveButton.onclick =
                () => {

                    let maximumMark =
                        null;


                    if (
                        fullMarkInput
                            .value
                            .trim() !== ""
                    ) {

                        maximumMark =
                            Number(
                                fullMarkInput.value
                            );


                        if (
                            !Number.isFinite(
                                maximumMark
                            ) ||
                            maximumMark < 0
                        ) {

                            alert(
                                "Invalid full mark."
                            );

                            return;
                        }
                    }


                    const config = {

                        box:
                            fieldSelect.value,

                        fullMark:
                            maximumMark,

                        hotkey:
                            startField.input
                                .value
                                .trim(),

                        moveHotkey:
                            moveField.input
                                .value
                                .trim(),

                        submitHotkey:
                            submitField.input
                                .value
                                .trim()
                    };


                    if (!config.hotkey) {

                        alert(
                            "Please configure the start-entry hotkey."
                        );

                        return;
                    }


                    if (!config.moveHotkey) {

                        alert(
                            "Please configure the ID → Mark key."
                        );

                        return;
                    }


                    if (!config.submitHotkey) {

                        alert(
                            "Please configure the submit mark key."
                        );

                        return;
                    }


                    gradeEntryConfig =
                        config;


                    overlay.remove();


                    resolve(
                        config
                    );
                };


            buttons.appendChild(
                cancelButton
            );


            buttons.appendChild(
                saveButton
            );


            // ------------------------------------------------
            // ADD ELEMENTS
            // ------------------------------------------------

            dialog.appendChild(
                fieldLabel
            );

            dialog.appendChild(
                fieldSelect
            );

            dialog.appendChild(
                fullMarkLabel
            );

            dialog.appendChild(
                fullMarkInput
            );

            dialog.appendChild(
                startField.label
            );

            dialog.appendChild(
                startField.input
            );

            dialog.appendChild(
                moveField.label
            );

            dialog.appendChild(
                moveField.input
            );

            dialog.appendChild(
                submitField.label
            );

            dialog.appendChild(
                submitField.input
            );

            dialog.appendChild(
                buttons
            );


            setTimeout(
                () =>
                    fieldSelect.focus(),
                50
            );
        }
    );
}


// ============================================================
// ENTRY DIALOG
// ============================================================

function askForGradeEntry() {

    return new Promise(
        resolve => {

            const {
                overlay,
                dialog
            } =
                createDialog(
                    `Enter ${GRADE_FIELDS[
                        gradeEntryConfig.box
                    ]}`
                );


            const instruction =
                document.createElement(
                    "div"
                );


            instruction.innerHTML = `
                <div style="
                    margin-bottom: 16px;
                    color: #555;
                    font-size: 14px;
                    line-height: 1.5;
                ">
                    Enter the last 3 digits of the ID
                    and the mark.
                    <br><br>
                    <strong>
                        ${gradeEntryConfig.moveHotkey}
                    </strong>
                    moves from ID to Mark.
                    <br>
                    <strong>
                        ${gradeEntryConfig.submitHotkey}
                    </strong>
                    submits the entry.
                    <br><br>
                    Cancel stops entry.
                </div>
            `;


            dialog.appendChild(
                instruction
            );


            // ------------------------------------------------
            // ID
            // ------------------------------------------------

            const idLabel =
                document.createElement(
                    "label"
                );


            idLabel.innerText =
                "Last 3 digits of student ID";


            idLabel.style.cssText = `
                display: block;
                margin-bottom: 6px;
                font-weight: bold;
            `;


            const idInput =
                document.createElement(
                    "input"
                );


            idInput.type =
                "text";


            idInput.inputMode =
                "numeric";


            idInput.maxLength =
                3;


            idInput.placeholder =
                "Example: 290";


            idInput.autocomplete =
                "off";


            idInput.style.cssText = `
                box-sizing: border-box;
                width: 100%;

                padding: 10px;

                border: 1px solid #aaa;
                border-radius: 5px;

                font-size: 18px;

                letter-spacing: 1px;

                margin-bottom: 14px;
            `;


            // ------------------------------------------------
            // MARK
            // ------------------------------------------------

            const markLabel =
                document.createElement(
                    "label"
                );


            markLabel.innerText =
                "Mark";


            markLabel.style.cssText = `
                display: block;
                margin-bottom: 6px;
                font-weight: bold;
            `;


            const markInput =
                document.createElement(
                    "input"
                );


            markInput.type =
                "text";


            markInput.inputMode =
                "decimal";


            markInput.placeholder =
                "Example: 10";


            markInput.autocomplete =
                "off";


            markInput.style.cssText = `
                box-sizing: border-box;
                width: 100%;

                padding: 10px;

                border: 1px solid #aaa;

                border-radius: 5px;

                font-size: 18px;

                margin-bottom: 20px;
            `;


            // ------------------------------------------------
            // BUTTONS
            // ------------------------------------------------

            const buttons =
                document.createElement(
                    "div"
                );


            buttons.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            `;


            const cancelButton =
                document.createElement(
                    "button"
                );


            cancelButton.innerText =
                "Cancel";


            cancelButton.onclick =
                () => {

                    overlay.remove();

                    resolve(null);
                };


            const submitButton =
                document.createElement(
                    "button"
                );


            submitButton.innerText =
                "Submit";


            let submitted =
                false;


            // ------------------------------------------------
            // SUBMIT
            // ------------------------------------------------

            function submit() {

                if (submitted)
                    return;


                const suffix =
                    idInput.value.trim();


                const markText =
                    markInput.value.trim();


                if (
                    !/^\d{3}$/.test(
                        suffix
                    )
                ) {

                    alert(
                        "Student ID must contain exactly 3 digits."
                    );


                    idInput.focus();

                    return;
                }


                if (
                    markText === "" ||
                    !/^-?\d+(\.\d+)?$/.test(
                        markText
                    )
                ) {

                    alert(
                        "Please enter a valid mark."
                    );


                    markInput.focus();

                    return;
                }


                const mark =
                    Number(
                        markText
                    );


                if (
                    !Number.isFinite(
                        mark
                    )
                ) {

                    alert(
                        "Invalid mark."
                    );


                    markInput.focus();

                    return;
                }


                if (
                    gradeEntryConfig.fullMark !==
                    null &&
                    mark >
                    gradeEntryConfig.fullMark
                ) {

                    alert(
                        `Mark ${mark} exceeds ` +
                        `full mark ${gradeEntryConfig.fullMark}.`
                    );


                    markInput.focus();

                    return;
                }


                submitted =
                    true;


                resolve({

                    suffix,

                    mark,

                    overlay
                });
            }


            submitButton.onclick =
                submit;


            // ------------------------------------------------
            // CONFIGURED ID -> MARK KEY
            // ------------------------------------------------

            idInput.addEventListener(
                "keydown",
                event => {

                    if (
                        hotkeyMatches(
                            event,
                            gradeEntryConfig.moveHotkey
                        )
                    ) {

                        event.preventDefault();

                        event.stopPropagation();

                        markInput.focus();

                        return;
                    }


                    /*
                     * Enter should only perform its
                     * configured function.
                     *
                     * If Enter is NOT the configured
                     * move key, do nothing here.
                     */
                }
            );


            // ------------------------------------------------
            // CONFIGURED SUBMIT KEY
            // ------------------------------------------------

            markInput.addEventListener(
                "keydown",
                event => {

                    if (
                        hotkeyMatches(
                            event,
                            gradeEntryConfig.submitHotkey
                        )
                    ) {

                        event.preventDefault();

                        event.stopPropagation();

                        submit();

                        return;
                    }
                }
            );


            // ------------------------------------------------
            // BUTTONS
            // ------------------------------------------------

            buttons.appendChild(
                cancelButton
            );


            buttons.appendChild(
                submitButton
            );


            dialog.appendChild(
                idLabel
            );


            dialog.appendChild(
                idInput
            );


            dialog.appendChild(
                markLabel
            );


            dialog.appendChild(
                markInput
            );


            dialog.appendChild(
                buttons
            );


            setTimeout(
                () =>
                    idInput.focus(),
                50
            );
        }
    );
}


// ============================================================
// SCROLL UPDATED ROW
// ============================================================

function scrollUpdatedRowBelowDialog(
    row,
    overlay
) {

    if (!row)
        return;


    const dialog =
        overlay?.querySelector(
            "div"
        );


    if (!dialog) {

        row.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"
        });


        return;
    }


    const dialogRect =
        dialog.getBoundingClientRect();


    const rowRect =
        row.getBoundingClientRect();


    const gap =
        35;


    const desiredTop =
        dialogRect.bottom +
        gap;


    const difference =
        rowRect.top -
        desiredTop;


    window.scrollBy({

        top:
            difference,

        behavior:
            "smooth"
    });
}


// ============================================================
// SLEEP
// ============================================================

function sleep(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


// ============================================================
// MAIN ENTRY
// ============================================================

async function startInteractiveGradeEntry() {

    if (gradeEntryRunning) {

        console.warn(
            "Grade entry already running."
        );

        return;
    }


    gradeEntryRunning =
        true;


    try {

        // ----------------------------------------------------
        // CONFIGURATION
        // ----------------------------------------------------

        if (!gradeEntryConfig) {

            const config =
                await configureGradeEntry();


            if (!config)
                return;
        }


        // ----------------------------------------------------
        // PREVIOUS ENTRIES
        // ----------------------------------------------------

        const previousEntries =
            [];


        // ----------------------------------------------------
        // CONTINUOUS ENTRY
        // ----------------------------------------------------

        while (true) {

            const entry =
                await askForGradeEntry();


            // ------------------------------------------------
            // CANCEL
            // ------------------------------------------------

            if (!entry) {

                console.log(
                    "Finished!"
                );

                return;
            }


            const overlay =
                entry.overlay;


            // ------------------------------------------------
            // FIND STUDENT
            // ------------------------------------------------

            const matches =
                findRowsBySuffix(
                    entry.suffix
                );


            // ------------------------------------------------
            // NO MATCH
            // ------------------------------------------------

            if (
                matches.length === 0
            ) {

                console.warn(
                    `WARNING: No student found ` +
                    `with suffix ${entry.suffix}.`
                );


                overlay.remove();


                alert(
                    `WARNING\n\n` +
                    `No student found whose ID ` +
                    `ends with "${entry.suffix}".\n\n` +
                    `Grade entry aborted.`
                );


                return;
            }


            // ------------------------------------------------
            // MULTIPLE MATCHES
            // ------------------------------------------------

            if (
                matches.length > 1
            ) {

                const ids =
                    matches
                        .map(
                            x => x.id
                        )
                        .join("\n");


                console.warn(
                    "WARNING: Multiple students found:",
                    ids
                );


                overlay.remove();


                alert(
                    `WARNING\n\n` +
                    `Multiple students found ` +
                    `with suffix "${entry.suffix}":\n\n` +
                    `${ids}\n\n` +
                    `Grade entry aborted.`
                );


                return;
            }


            // ------------------------------------------------
            // DUPLICATE ENTRY
            // ------------------------------------------------

            const duplicate =
                previousEntries.find(
                    x =>
                        x.suffix ===
                        entry.suffix
                );


            if (duplicate) {

                const answer =
                    confirm(

                        `You already entered this student.\n\n` +

                        `Student ID: ${duplicate.id}\n` +

                        `Previous mark: ${duplicate.mark}\n` +

                        `New mark: ${entry.mark}\n\n` +

                        `Do you want to enter it again?`
                    );


                if (!answer) {

                    overlay.remove();

                    continue;
                }
            }


            // ------------------------------------------------
            // ACTUAL ID
            // ------------------------------------------------

            const actualId =
                matches[0].id;


            const updatedRow =
                matches[0].tr;


            // ------------------------------------------------
            // UPDATE
            // ------------------------------------------------

            const success =
                applyGradeEntry(
                    actualId,
                    entry.mark,
                    gradeEntryConfig.box
                );


            if (!success) {

                overlay.remove();


                alert(
                    `WARNING\n\n` +
                    `Could not update:\n\n` +
                    `${actualId}\n\n` +
                    `Grade entry aborted.`
                );


                return;
            }


            // ------------------------------------------------
            // RECORD
            // ------------------------------------------------

            previousEntries.push({

                suffix:
                    entry.suffix,

                mark:
                    entry.mark,

                id:
                    actualId
            });


            console.log(
                `${actualId} → ` +
                `${GRADE_FIELDS[
                    gradeEntryConfig.box
                ]} → ` +
                `${entry.mark}`
            );


            // ------------------------------------------------
            // SCROLL
            // ------------------------------------------------

            scrollUpdatedRowBelowDialog(
                updatedRow,
                overlay
            );


            await sleep(400);


            // ------------------------------------------------
            // CLOSE CURRENT DIALOG
            // ------------------------------------------------

            overlay.remove();


            await sleep(100);
        }

    } finally {

        gradeEntryRunning =
            false;
    }
}


// ============================================================
// POPUP MESSAGES
// ============================================================

EXT.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse
    ) => {

        switch (message.type) {

            case "SET_CONFIG":

                gradeEntryConfig =
                    message.config;


                console.log(
                    "Configuration updated:",
                    gradeEntryConfig
                );


                sendResponse({
                    ok: true
                });


                return true;


            case "GET_CONFIG":

                sendResponse({

                    ok: true,

                    config:
                        gradeEntryConfig
                });


                return true;


            case "CLEAR_CONFIG":

                gradeEntryConfig =
                    null;


                console.log(
                    "Configuration cleared."
                );


                sendResponse({
                    ok: true
                });


                return true;


            case "START":

                startInteractiveGradeEntry();


                sendResponse({
                    ok: true
                });


                return true;


            default:

                sendResponse({
                    ok: false
                });


                return true;
        }
    }
);


// ============================================================
// START-ENTRY HOTKEY
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            gradeEntryConfig &&
            hotkeyMatches(
                event,
                gradeEntryConfig.hotkey
            )
        ) {

            event.preventDefault();

            event.stopPropagation();

            startInteractiveGradeEntry();
        }
    },
    true
);


// ============================================================
// READY
// ============================================================

console.log(
    "%cMarks Entry Helper loaded.",
    "font-size:16px;font-weight:bold;"
);

console.log(
    "Configuration is memory-only."
);

console.log(
    "Start-entry default: Alt+E"
);

console.log(
    "ID → Mark default: Space"
);

console.log(
    "Submit default: Enter"
);
