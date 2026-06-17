


let micStream = null;

let audioContext;
let analyser;
let microphone;
let snapListening = false;
// =========================
// ELEMENTS
// =========================
const fullscreenBtn =
    document.getElementById(
        "fullscreenBtn"
    );

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

let fakeTime = "";

let magicMode = false;

let wallpaperURL = null;

let clockInterval = null;


fullscreenBtn.addEventListener(
    "click",
    async () => {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document
                    .documentElement
                    .requestFullscreen();

            }

        }
        catch (error) {

            console.log(
                error
            );

        }

    }
);

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

    if (selectedTime === "") {

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

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const currentTime =
        `${hours}:${minutes}`;

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

        if (fakeTime === "") {

            alert(
                "Please press OK after selecting a time."
            );

            return;
        }
        if (
            !document.fullscreenElement
        ) {

            document.documentElement
                .requestFullscreen()
                .catch(() => { });

        }

        magicMode = true;

        setupScreen.classList.add("hidden");

        lockScreen.classList.remove("hidden");

        if (wallpaperURL) {
            lockScreen.style.backgroundImage =
                `url(${wallpaperURL})`;
        }


        displayFakeTime();

        updateDateDisplay();

        updateBattery();
        startSnapDetection();


    });
// =========================
// SPEECH RECOGNITION
// =========================

async function startSnapDetection() {

    try {

        micStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        audioContext =
            new AudioContext();

        analyser =
            audioContext.createAnalyser();

        microphone =
            audioContext.createMediaStreamSource(
                micStream
            );

        microphone.connect(analyser);

        analyser.fftSize = 2048;

        snapListening = true;

        detectSnap();

    }
    catch (error) {

        alert(
            "Microphone access required."
        );

        console.log(error);

    }

}
function detectSnap() {

    const data =
        new Uint8Array(
            analyser.frequencyBinCount
        );

    function check() {

        if (!snapListening) return;

        analyser.getByteFrequencyData(
            data
        );

        let peak = 0;

        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            if (data[i] > peak) {

                peak = data[i];

            }

        }

        if (peak > 170) {

            console.log(
                "Snap Detected!"
            );

            snapListening = false;

            restoreReality();

            return;
        }

        requestAnimationFrame(
            check
        );

    }

    check();

}

// =========================
// REALITY RESTORATION
// =========================

function restoreReality() {

    if (!magicMode) return;

    

    snapListening = false;

    magicMode = false;


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

        }, 800);
}

// =========================
// FINISH RESTORE
// =========================

function finishRealityRestore() {



    updateRealClock();

    clockInterval =
        setInterval(
            updateRealClock,
            1000
        );



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
        snapListening = false;

        if (micStream) {

            micStream
                .getTracks()
                .forEach(track => track.stop());

        }
        magicMode = false;
        micStream = null;




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



    });

// =========================
// INITIAL SETUP
// =========================

updateDateDisplay();

updateBattery();
// =========================
// MICROPHONE PERMISSION
// =========================

window.addEventListener("load", async () => {

    try {

        micStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        micStream
            .getTracks()
            .forEach(track => track.stop());

        console.log(
            "Microphone permission granted."
        );

    }
    catch (error) {

        console.log(
            "Microphone permission denied."
        );

    }

});


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
// =========================
// DOUBLE TAP / DOUBLE CLICK
// =========================

let lastTap = 0;

function handleDoubleTap() {

    if (!magicMode) return;

    const now = Date.now();

    if (
        now - lastTap < 400
    ) {

        console.log(
            "Double Tap Detected!"
        );

        restoreReality();

    }

    lastTap = now;

}

lockScreen.addEventListener(
    "touchstart",
    handleDoubleTap
);

lockScreen.addEventListener(
    "click",
    handleDoubleTap
);
