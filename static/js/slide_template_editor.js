let template = {
    name: "",
    type: "lyrics",
    background: {
        mode: "solid",
        value: "#000000"
    },
    textboxes: []
};

let selectedTextbox = null;
let backgroundImage = null;

const canvas = document.getElementById("editorCanvas");
const ctx = canvas.getContext("2d");

// --------------------
// ADD TEXTBOX
// --------------------
function addTextbox() {
    template.textboxes.push({
        label: `Field ${template.textboxes.length + 1}`,
        x1: 100,
        y1: 100,
        x2: 500,
        y2: 180,
        font: "Arial",
        fontSize: 32,
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        color: "#FFFFFF"
    });

    selectedTextbox = template.textboxes.length - 1;

    renderTextboxList();
    draw();
}

// --------------------
// DELETE SELECTED
// --------------------
function deleteSelectedTextbox() {
    if (selectedTextbox === null) return;

    template.textboxes.splice(selectedTextbox, 1);
    selectedTextbox = null;

    renderTextboxList();
    draw();
}

// --------------------
// RENDER TEXTBOX LIST
// --------------------
function renderTextboxList() {

    const list = document.getElementById("textboxList");
    list.innerHTML = "";

    template.textboxes.forEach((tb, i) => {

        const selected = selectedTextbox === i;

        list.innerHTML += `
        <div onclick="selectTextbox(${i})"
             class="
                border rounded-xl p-3 cursor-pointer transition
                ${selected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'}
             ">

            <div class="flex justify-between items-start mb-2">

                <div class="font-semibold text-sm">
                    Text Box ${i + 1}
                    ${selected
                        ? '<span class="text-xs text-blue-600 ml-2">(Selected)</span>'
                        : ''}
                </div>

            </div>

            <input value="${tb.label}"
                   onclick="event.stopPropagation()"
                   onchange="template.textboxes[${i}].label=this.value;draw()"
                   class="w-full border rounded p-2 mb-2">

            <div class="grid grid-cols-2 gap-2 mb-2">

                <input value="${tb.font}"
                       onclick="event.stopPropagation()"
                       onchange="template.textboxes[${i}].font=this.value;draw()"
                       class="border rounded p-2">

                <input type="number"
                       value="${tb.fontSize}"
                       onclick="event.stopPropagation()"
                       onchange="template.textboxes[${i}].fontSize=parseInt(this.value);draw()"
                       class="border rounded p-2">

            </div>

            <div class="flex gap-2 mb-3">

              <button onclick="event.stopPropagation();setAlign(${i}, 'left')"
                      class="px-3 py-1 border rounded">
                  ⬅
              </button>

              <button onclick="event.stopPropagation();setAlign(${i}, 'center')"
                      class="px-3 py-1 border rounded">
                  ⬌
              </button>

              <button onclick="event.stopPropagation();setAlign(${i}, 'right')"
                      class="px-3 py-1 border rounded">
                  ➡
              </button>

            </div>

            <input type="color"
                   value="${tb.color}"
                   onclick="event.stopPropagation()"
                   onchange="template.textboxes[${i}].color=this.value;draw()"
                   class="w-full h-10 mb-2">

            <div class="flex gap-2 mb-3">

                <button onclick="event.stopPropagation();toggleStyle(${i},'bold')"
                        class="px-3 py-1 border rounded font-bold">
                    B
                </button>

                <button onclick="event.stopPropagation();toggleStyle(${i},'italic')"
                        class="px-3 py-1 border rounded italic">
                    I
                </button>

                <button onclick="event.stopPropagation();toggleStyle(${i},'underline')"
                        class="px-3 py-1 border rounded underline">
                    U
                </button>

            </div>

            <div class="text-xs text-gray-500 mb-2">
                (${tb.x1}, ${tb.y1}) → (${tb.x2}, ${tb.y2})
            </div>

            <div class="flex justify-end">

                <button onclick="event.stopPropagation();deleteTextbox(${i})"
                        class="text-red-500 hover:text-red-700 text-lg"
                        title="Delete Textbox">
                    🗑
                </button>

            </div>

        </div>
        `;
    });
}

// --------------------
function toggleStyle(i, key) {
    template.textboxes[i][key] = !template.textboxes[i][key];
    draw();
}

// --------------------
function selectTextbox(i) {
    selectedTextbox = i;
    renderTextboxList();
    draw();
}

function setAlign(index, align) {
    template.textboxes[index].align = align;
    draw();
}

function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

function setAlign(index, align) {
    template.textboxes[index].align = align;
    draw();
}

// --------------------
// DRAW BACKGROUND
// --------------------
function drawBackground() {

    const mode = document.getElementById("bgMode").value;

    if (mode === "image" && backgroundImage) {

        const scale = Math.max(
            canvas.width / backgroundImage.width,
            canvas.height / backgroundImage.height
        );

        const w = backgroundImage.width * scale;
        const h = backgroundImage.height * scale;

        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.drawImage(backgroundImage, x, y, w, h);
    }

    else if (mode === "solid") {

        ctx.fillStyle = document.getElementById("solidColor").value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    else if (mode === "gradient") {

        const gradient = ctx.createLinearGradient(
            0, 0,
            canvas.width, canvas.height
        );

        gradient.addColorStop(0, document.getElementById("gradient1").value);
        gradient.addColorStop(1, document.getElementById("gradient2").value);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// --------------------
// DRAW
// --------------------
function draw() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();

    template.textboxes.forEach((tb, i) => {

        ctx.strokeStyle = selectedTextbox===i ? "red" : "yellow";

        ctx.strokeRect(
            tb.x1,
            tb.y1,
            tb.x2 - tb.x1,
            tb.y2 - tb.y1
        );

        ctx.fillStyle = tb.color;

        ctx.font = `
            ${tb.bold ? "bold" : ""}
            ${tb.italic ? "italic" : ""}
            ${tb.fontSize}px ${tb.font}
        `;

        let textX = tb.x1 + 5;

        ctx.textAlign = "left";

        if (tb.align === "center") {
            textX = (tb.x1 + tb.x2) / 2;
            ctx.textAlign = "center";
        }

        if (tb.align === "right") {
            textX = tb.x2 - 5;
            ctx.textAlign = "right";
        }

        ctx.fillText(
            tb.label,
            textX,
            tb.y1 + 35
        );
    });
}

function deleteTextbox(index) {

    template.textboxes.splice(index, 1);

    if (selectedTextbox === index) {
        selectedTextbox = null;
    } else if (selectedTextbox > index) {
        selectedTextbox--;
    }

    renderTextboxList();
    draw();
}

function selectTextbox(i) {
    selectedTextbox = i;

    renderTextboxList();
    draw();
}

async function saveTemplate() {

    try {

        template.name = document.getElementById("templateName").value;
        template.type = document.getElementById("templateType").value;

        if (!template.name.trim()) {
            showToast("Template name is required", "error");
            return;
        }

        const res = await fetch("/api/slide-templates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(template)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to save template");
        }

        showToast("Template saved successfully!", "success");

        setTimeout(() => {
            window.location.href = "/slide-templates";
        }, 1200);

    } catch (err) {
        showToast(err.message, "error");
    }
}

// --------------------
// DRAW BOX WITH MOUSE
// --------------------
let drawing = false;
let startX, startY;

canvas.onmousedown = e => {

    if (selectedTextbox === null) return;

    const pos = getCanvasCoordinates(e);

    startX = pos.x;
    startY = pos.y;

    drawing = true;
};

canvas.onmousemove = e => {

    if (!drawing) return;

    const pos = getCanvasCoordinates(e);

    draw();

    ctx.strokeStyle = "red";
    ctx.strokeRect(
        startX,
        startY,
        pos.x - startX,
        pos.y - startY
    );
};

canvas.onmouseup = e => {

    if (!drawing) return;

    const pos = getCanvasCoordinates(e);

    const tb = template.textboxes[selectedTextbox];

    tb.x1 = startX;
    tb.y1 = startY;
    tb.x2 = pos.x;
    tb.y2 = pos.y;

    drawing = false;

    renderTextboxList();
    draw();
};

document.getElementById("bgImage").addEventListener("change", function (e) {

    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = function () {
        backgroundImage = img;
        draw();
    };

    img.src = URL.createObjectURL(file);
});

// --------------------
// BACKGROUND CHANGE EVENTS
// --------------------
["bgMode","solidColor","gradient1","gradient2"].forEach(id => {
    document.getElementById(id).addEventListener("change", draw);
});

// --------------------
draw();