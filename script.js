// =========================
// ELEMENTS
// =========================

const setupScreen =
    document.getElementById("setupScreen");

const lockScreen =
    document.getElementById("lockScreen");

const wallpaperInput =
    document.getElementById("wallpaperInput");

const fakeTimeInput =
    document.getElementById("fakeTimeInput");

const previewTime =
    document.getElementById("previewTime");

const activateMagicBtn =
    document.getElementById("activateMagicBtn");

const mainClock =
    document.getElementById("mainClock");

const lockDay =
    document.getElementById("lockDay");

const lockDate =
    document.getElementById("lockDate");

const statusTime =
    document.getElementById("statusTime");

const batteryText =
    document.getElementById("batteryText");

const voiceStatus =
    document.getElementById("voiceStatus");

const realityMessage =
    document.getElementById("realityMessage");

const lockIcon =
    document.getElementById("lockIcon");



const exitMagicBtn =
    document.getElementById("exitMagicBtn");

const deactivateModal =
    document.getElementById("deactivateModal");

const yesDeactivate =
    document.getElementById("yesDeactivate");

const noDeactivate =
    document.getElementById("noDeactivate");

const dynamicIsland =
    document.querySelector(".dynamic-island");

// =========================
// VARIABLES
// =========================

let fakeTime = "04:00";

let magicMode = false;

let wallpaperURL = null;

let clockInterval = null;

let recognition = null;

let listening = false;


// =========================
// PREVIEW TIME
// =========================

const setFakeTimeBtn =
document.getElementById("setFakeTimeBtn");

setFakeTimeBtn.addEventListener("click", () => {

    const selectedTime =
    document.getElementById("fakeTimeInput").value;

    console.log("Selected Time:", selectedTime);

    alert("Selected Time = " + selectedTime);

    if(selectedTime === ""){

        alert("Input value is empty!");

        return;
    }

    fakeTime = selectedTime;

    document.getElementById("previewTime").textContent =
    selectedTime;

});

// =========================
// WALLPAPER UPLOAD
// =========================

wallpaperInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        wallpaperURL = event.target.result;

    };

    reader.readAsDataURL(file);

});

// =========================
// DATE FORMATTER
// =========================

function updateDateDisplay() {

    const now = new Date();

    const day =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );

    const date =
        now.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric"
            }
        );

    lockDay.innerText = day;
    lockDate.innerText = date;

}

// =========================
// REAL CLOCK
// =========================

function updateRealClock() {

    const now = new Date();

    const currentTime =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    mainClock.innerText =
        currentTime;

    statusTime.innerText =
        currentTime;

}

// =========================
// BATTERY SYSTEM
// =========================

async function updateBattery() {

    if (!navigator.getBattery) {
        batteryText.innerText =
            "100%";
        return;
    }

    try {

        const battery =
            await navigator.getBattery();

        const percent =
            Math.floor(
                battery.level * 100
            );

        batteryText.innerText =
            percent + "%";

    }
    catch (error) {

        batteryText.innerText =
            "100%";

    }

}

// =========================
// SET FAKE CLOCK
// =========================

function displayFakeTime() {

    if (fakeTime === "") {
        alert(
            "Press OK after selecting a fake time."
        );
        return;
    }

    mainClock.innerText =
        fakeTime;

    statusTime.innerText =
        fakeTime;

}

// =========================
// ACTIVATE MAGIC MODE
// =========================

activateMagicBtn.addEventListener(
    "click",
    () => {

        magicMode = true;

        setupScreen.classList.add(
            "hidden"
        );

        lockScreen.classList.remove(
            "hidden"
        );

        if (wallpaperURL) {
            lockScreen.style.backgroundImage =
                `url(${wallpaperURL})`;
        }

        fakeTime =
            fakeTimeInput.value || "04:00";

        displayFakeTime();

        updateDateDisplay();

        updateBattery();

        startListening();

    });
// =========================
// SPEECH RECOGNITION
// =========================

function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        voiceStatus.innerText =
            "Speech Recognition Not Supported";
        return;
    }

    recognition =
        new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    listening = true;



    recognition.onresult = (event) => {

        const transcript =
            event.results[
                event.results.length - 1
            ][0].transcript.toLowerCase();

        console.log(
            "Voice:",
            transcript
        );

        if (
            transcript.includes("magic")
        ) {
            restoreReality();
        }

    };

    recognition.onerror = () => {


    };

    recognition.onend = () => {

        if (
            magicMode &&
            listening
        ) {
            recognition.start();
        }

    };

    recognition.start();

}

// =========================
// REALITY RESTORATION
// =========================

function restoreReality() {

    if (!magicMode) return;

    listening = false;

    if (recognition) {
        recognition.stop();
    }

    lockIcon.innerText = "🔓";

    lockIcon.classList.add(
        "unlocking"
    );

    if (navigator.vibrate) {
        navigator.vibrate(
            [100, 50, 100]
        );
    }

    runTimeWarp();
}
// =========================
// TIME WARP EFFECT
// =========================

function runTimeWarp() {

    const now = new Date();

    const realHours =
        now.getHours();

    const realMinutes =
        now.getMinutes();

    let parts =
        fakeTime.split(":");

    let fakeHours =
        parseInt(parts[0]);

    let fakeMinutes =
        parseInt(parts[1]);

    const animation =
        setInterval(() => {

            if (
                fakeHours === realHours &&
                fakeMinutes === realMinutes
            ) {
                clearInterval(animation);

                finishRealityRestore();

                return;
            }

            if (
                fakeHours > realHours ||
                (
                    fakeHours === realHours &&
                    fakeMinutes > realMinutes
                )
            ) {
                fakeMinutes--;

                if (fakeMinutes < 0) {
                    fakeMinutes = 59;
                    fakeHours--;
                }
            }
            else {
                fakeMinutes++;

                if (fakeMinutes > 59) {
                    fakeMinutes = 0;
                    fakeHours++;
                }
            }

            const h =
                String(fakeHours)
                    .padStart(2, "0");

            const m =
                String(fakeMinutes)
                    .padStart(2, "0");

            mainClock.innerText =
                `${h}:${m}`;

        }, 80);
}

// =========================
// FINISH RESTORE
// =========================

function finishRealityRestore() {

    realityMessage.classList.add(
        "show"
    );

    realityMessage.innerText =
        "Reality Restored";

    updateRealClock();

    clockInterval =
        setInterval(
            updateRealClock,
            1000
        );

    setTimeout(() => {

        realityMessage.classList.remove(
            "show"
        );

    }, 2500);

    setTimeout(() => {

        dynamicIsland.classList.remove(
            "expand"
        );

    }, 1000);

    setTimeout(() => {

        lockIcon.innerText =
            "🔒";

        lockIcon.classList.remove(
            "unlocking"
        );

    }, 2000);

}

// =========================
// EXIT MAGIC BUTTON
// =========================

exitMagicBtn.addEventListener(
    "click",
    () => {

        deactivateModal.classList.remove(
            "hidden"
        );

    });

// =========================
// CLOSE MODAL
// =========================

noDeactivate.addEventListener(
    "click",
    () => {

        deactivateModal.classList.add(
            "hidden"
        );

    });

// =========================
// DEACTIVATE MAGIC MODE
// =========================

yesDeactivate.addEventListener(
    "click",
    () => {

        magicMode = false;

        listening = false;

        if (recognition) {
            recognition.stop();
        }

        clearInterval(
            clockInterval
        );

        deactivateModal.classList.add(
            "hidden"
        );

        lockScreen.classList.add(
            "hidden"
        );

        setupScreen.classList.remove(
            "hidden"
        );

        realityMessage.classList.remove(
            "show"
        );

        voiceStatus.innerText =
            '🎤 Listening For "Magic"';

    });

// =========================
// INITIAL SETUP
// =========================

updateDateDisplay();

updateBattery();



// =========================
// OPTIONAL AUTO BATTERY
// =========================

setInterval(() => {

    updateBattery();

}, 30000);

// =========================
// OPTIONAL DATE REFRESH
// =========================

setInterval(() => {

    updateDateDisplay();

}, 60000);
