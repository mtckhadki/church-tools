let slides = [];
let activeIndex = 0;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let drawing = false;
let resizing = false;
let selectedBox = null;
let selectedFieldIndex = null;

let startX, startY;

// --------------------
// SLIDE STRUCTURE
// --------------------
function createSlide() {
    return {
        type: "lyrics",
        image: null,
        scale: 1,
        fields: [], // metadata (labels)
        boxes: []   // actual drawn boxes
    };
}

// --------------------
function addSlide() {
    slides.push(createSlide());
    activeIndex = slides.length - 1;
    renderSlides();
}

function newSlide() {
    slides.push(createSlide());
    activeIndex = slides.length - 1;
    renderSlides();
}

function deleteSlide(i) {
    slides.splice(i, 1);
    activeIndex = Math.max(0, slides.length - 1);
    renderSlides();
    draw();
}

function duplicateSlide(i) {
    let copy = JSON.parse(JSON.stringify(slides[i]));
    slides.push(copy);
    activeIndex = slides.length - 1;
    renderSlides();
}

// --------------------
// RENDER PANEL
// --------------------
function renderSlides() {
    let container = document.getElementById("slides");
    container.innerHTML = "";

    slides.forEach((slide, i) => {

        let div = document.createElement("div");
        div.className = "border p-3 mb-3 rounded bg-gray-50";

        div.innerHTML = `
            <div class="flex justify-between">
                <select onchange="changeType(${i}, this.value)">
                    <option value="lyrics" ${slide.type==="lyrics"?"selected":""}>Lyrics</option>
                    <option value="scripture" ${slide.type==="scripture"?"selected":""}>Scripture</option>
                </select>

                <div>
                    <button onclick="duplicateSlide(${i})">📄</button>
                    <button onclick="deleteSlide(${i})">🗑</button>
                </div>
            </div>

            <input type="file" onchange="uploadImage(event, ${i})" class="mt-2">

            <div id="fields-${i}" class="mt-2"></div>
        `;

        container.appendChild(div);

        renderFields(i);
    });
}

// --------------------
// FIELDS BASED ON TYPE
// --------------------
function renderFields(i) {

    let slide = slides[i];
    let el = document.getElementById(`fields-${i}`);

    if (!el) return;

    el.innerHTML = "";

    let labels = [];

    if (slide.type === "scripture") {
        labels = ["Portion", "Title"];
    } else {
        labels = ["Title", "Tamil Title", "English Title"];
    }

    slide.fields = labels;

    labels.forEach((label, index) => {

        let row = document.createElement("div");
        row.className = "mb-2";

        row.innerHTML = `
            <input placeholder="${label}" 
                   onchange="updateText(${i}, ${index}, this.value)"
                   class="border p-2 w-full mb-1">

            <div class="text-xs text-gray-600">
                ${getCoordsText(slide.boxes[index])}
            </div>

            <div class="flex gap-2 mt-1">
                <button onclick="selectField(${i}, ${index})" class="text-blue-600">Select</button>
                <button onclick="alignCenter(${i}, ${index})">Center</button>
            </div>
        `;

        el.appendChild(row);
    });
}

// --------------------
function getCoordsText(box) {
    if (!box) return "(not set)";
    return `(${box.x1},${box.y1}) → (${box.x2},${box.y2})`;
}

// --------------------
function updateText(s, f, val) {
    if (!slides[s].boxes[f]) slides[s].boxes[f] = {};
    slides[s].boxes[f].text = val;
    draw();
}

// --------------------
function selectField(s, f) {
    activeIndex = s;
    selectedFieldIndex = f;
}

// --------------------
function changeType(i, type) {
    slides[i] = createSlide();
    slides[i].type = type;
    renderSlides();
}

// --------------------
// IMAGE FIT FIX (IMPORTANT)
// --------------------
function uploadImage(e, i) {

    let file = e.target.files[0];
    let img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {

        let scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
        );

        slides[i].image = img;
        slides[i].scale = scale;

        activeIndex = i;
        draw();
    };
}

// --------------------
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let slide = slides[activeIndex];
    if (!slide) return;

    if (slide.image) {
        let w = slide.image.width * slide.scale;
        let h = slide.image.height * slide.scale;

        ctx.drawImage(slide.image, 0, 0, w, h);
    }

    slide.boxes.forEach((b, i) => {
        if (!b) return;

        ctx.strokeStyle = i === selectedFieldIndex ? "red" : "yellow";
        ctx.strokeRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1);

        ctx.fillStyle = "white";
        ctx.font = `${b.fontSize || 30}px ${b.font || "Arial"}`;
        ctx.fillText(b.text || "Text", b.x1 + 5, b.y1 + 30);
    });

    drawGuides();
}

// --------------------
// DRAW BOX (FIELD-BASED)
// --------------------
canvas.onmousedown = e => {

    if (selectedFieldIndex === null) return;

    let rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    drawing = true;
};

canvas.onmousemove = e => {

    if (!drawing) return;

    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    draw();

    ctx.strokeStyle = "red";
    ctx.strokeRect(startX, startY, x - startX, y - startY);
};

canvas.onmouseup = e => {

    if (!drawing) return;

    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let slide = slides[activeIndex];

    slide.boxes[selectedFieldIndex] = {
        x1: startX,
        y1: startY,
        x2: x,
        y2: y,
        text: "",
        fontSize: 30,
        font: "Arial"
    };

    drawing = false;

    renderSlides();
    draw();
};

// --------------------
// ALIGN CENTER
// --------------------
function alignCenter(s, f) {

    let box = slides[s].boxes[f];
    if (!box) return;

    let centerX = canvas.width / 2;

    let width = box.x2 - box.x1;

    box.x1 = centerX - width / 2;
    box.x2 = centerX + width / 2;

    draw();
}

// --------------------
// GUIDES
// --------------------
function drawGuides() {
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
}

// --------------------
addSlide();