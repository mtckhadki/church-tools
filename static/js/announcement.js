let sections = [];
let editors = [];

// 🔥 Create ONE section by default
window.onload = () => {
    addSection();
};

function addSection() {
    let id = sections.length;

    sections.push({ heading: "", content: "" });

    let container = document.createElement("div");
    container.className = `
        bg-gray-50 border rounded-lg p-4 mb-4 shadow-sm
        hover:shadow-md transition
    `;

    container.innerHTML = `
        <!-- TITLE -->
        <input 
            placeholder="Section Title"
            class="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onchange="updateHeading(${id}, this.value)"
        >

        <!-- EDITOR -->
        <div id="editor-${id}" class="bg-white"></div>

        <!-- DELETE BUTTON -->
        <div class="flex justify-end mt-3">
            <button onclick="removeSection(${id}, this)"
                class="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm">
                
                🗑 Delete
            </button>
        </div>
    `;

    document.getElementById("sections").appendChild(container);

    // 🔥 Rich Editor
    let quill = new Quill(`#editor-${id}`, {
        theme: "snow",
        modules: {
            toolbar: [
                [{ 'font': [] }, { 'size': [] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        }
    });

    // Fix editor height + scrolling
    quill.root.style.maxHeight = "120px";
    quill.root.style.overflowY = "auto";

    editors[id] = quill;
}

function updateHeading(index, value) {
    sections[index].heading = value;
}

function removeSection(index, btn) {
    btn.closest("div.bg-gray-50").remove();
    sections[index] = null;
}

function generateXML() {

    let cleanSections = [];

    sections.forEach((s, i) => {
        if (s) {
            s.content = editors[i].root.innerHTML;
            cleanSections.push(s);
        }
    });

    fetch("/announcement", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sections: cleanSections })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").innerHTML = `
            <div class="bg-green-100 p-3 rounded shadow">
                ✅ File created
                <br>
                <a href="/download?path=${data.file}" 
                   class="text-blue-600 underline">
                   Download File
                </a>
            </div>
        `;
    });
}