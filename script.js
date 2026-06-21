// =========================
// ELEMENTS
// =========================

const saveWallpaperBtn =
    document.getElementById(
        "saveWallpaperBtn"
    );
const fullscreenBtn =
    document.getElementById(
        "fullscreenBtn"
    );
const extraMinutesInput =
    document.getElementById(
        "extraMinutesInput"
    );

const generateFakeTimeBtn =
    document.getElementById(
        "generateFakeTimeBtn"
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

let darknessInterval = null;
let cameraStream = null;

const cameraFeed =
    document.getElementById(
        "cameraFeed"
    );

const motionCanvas =
    document.getElementById(
        "motionCanvas"
    );
let fakeClockInterval = null;
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
// LOAD SAVED WALLPAPER
// =========================

const savedWallpaper =
    localStorage.getItem(
        "chronoWallpaper"
    );

if (savedWallpaper) {

    wallpaperURL =
        savedWallpaper;

    lockScreen.style.backgroundImage =
        `url(${savedWallpaper})`;

}

// =========================
// WALLPAPER UPLOAD
// =========================

wallpaperInput.addEventListener(
    "change",
    (e) => {

        const file =
            e.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                wallpaperURL =
                    event.target.result;

                lockScreen.style.backgroundImage =
                    `url(${wallpaperURL})`;

            };

        reader.readAsDataURL(file);

    }
);
// save button code 
saveWallpaperBtn.addEventListener(
    "click",
    () => {

        if (!wallpaperURL) {

            alert(
                "Select a wallpaper first."
            );

            return;

        }

        localStorage.setItem(
            "chronoWallpaper",
            wallpaperURL
        );

        alert(
            "Wallpaper Saved!"
        );

    }
);

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

    let parts =
        fakeTime.split(":");

    let hours =
        parseInt(parts[0]);

    let minutes =
        parseInt(parts[1]);

    mainClock.innerText =
        fakeTime;

    statusTime.innerText =
        fakeTime;

    fakeClockInterval =
        setInterval(() => {

            minutes++;

            if (minutes > 59) {

                minutes = 0;
                hours++;

            }

            if (hours > 23) {

                hours = 0;

            }

            const h =
                String(hours)
                    .padStart(2, "0");

            const m =
                String(minutes)
                    .padStart(2, "0");

            mainClock.innerText =
                `${h}:${m}`;

            statusTime.innerText =
                `${h}:${m}`;

            fakeTime =
                `${h}:${m}`;

        }, 60000);

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

        startDarknessDetection();
        displayFakeTime();

        updateDateDisplay();

        updateBattery();



    });
// =========================
// darkemess detection 

async function startDarknessDetection() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        cameraFeed.srcObject =
            cameraStream;

        cameraFeed.onloadedmetadata = () => {

            detectDarkness();

        };

    }
    catch (error) {

        console.log(error);

    }

}
function detectDarkness() {

    const ctx =
        motionCanvas.getContext("2d");

    darknessInterval =
        setInterval(() => {

            if (
                !cameraFeed.videoWidth
            ) {
                return;
            }

            motionCanvas.width = 160;
            motionCanvas.height = 120;

            ctx.drawImage(
                cameraFeed,
                0,
                0,
                160,
                120
            );

            const frame =
                ctx.getImageData(
                    0,
                    0,
                    160,
                    120
                );

            let brightness = 0;

            for (
                let i = 0;
                i < frame.data.length;
                i += 4
            ) {

                brightness +=
                    frame.data[i] +
                    frame.data[i + 1] +
                    frame.data[i + 2];

            }

            brightness =
                brightness /
                (frame.data.length / 4);

            console.log(
                "Brightness:",
                brightness
            );

            if (
                brightness < 75
            ) {

                console.log(
                    "Darkness Detected"
                );

                clearInterval(
                    darknessInterval
                );

                darknessInterval = null;

                // Vibration feedback
                darknessInterval = null;
                // Hidden feedback

                exitMagicBtn.innerText = "⭐";

                exitMagicBtn.style.transform =
                    "scale(1.2)";

                setTimeout(() => {

                    exitMagicBtn.innerText = "✨";

                    exitMagicBtn.style.transform =
                        "scale(1)";

                }, 1000);


                // Wait 2 seconds

                setTimeout(() => {

                    restoreReality();

                }, 3000);

            }

        }, 300);

}

// =========================
// REALITY RESTORATION
// =========================

function restoreReality() {
    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track =>
                track.stop()
            );

        cameraFeed.srcObject =
            null;

        cameraStream = null;

    }
    if (!magicMode) return;

    if (darknessInterval) {

        clearInterval(
            darknessInterval
        );

        darknessInterval = null;

    }



    clearInterval(fakeClockInterval);
    magicMode = false;

    lockIcon.innerText = "🔓";

    lockIcon.classList.add(
        "unlocking"
    );

    
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

        magicMode = false;





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
// setting the time
// =========================

generateFakeTimeBtn.addEventListener(
    "click",
    () => {

        const extra =
            parseInt(
                extraMinutesInput.value
            );

        if (
            isNaN(extra)
        ) {
            return;
        }

        const now =
            new Date();

        now.setMinutes(
            now.getMinutes() + extra
        );

        const h =
            String(now.getHours())
                .padStart(2, "0");

        const m =
            String(now.getMinutes())
                .padStart(2, "0");

        fakeTime =
            `${h}:${m}`;

        previewTime.textContent =
            fakeTime;

    }
);
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

