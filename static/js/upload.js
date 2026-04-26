const dropzone = document.getElementById("dropzone");
const input = document.getElementById("fileInput");

dropzone.onclick = () => input.click();

dropzone.ondragover = e => {
    e.preventDefault();
    dropzone.classList.add("bg-blue-50");
};

dropzone.ondragleave = () => {
    dropzone.classList.remove("bg-blue-50");
};

dropzone.ondrop = e => {
    e.preventDefault();
    dropzone.classList.remove("bg-blue-50");
    handleFiles(e.dataTransfer.files);
};

input.onchange = () => handleFiles(input.files);

function handleFiles(files) {
    [...files].forEach(file => uploadFile(file));
}

function uploadFile(file) {
    let container = document.createElement("div");
    container.className = "bg-white p-2 rounded shadow";

    container.innerHTML = `
        <div class="flex justify-between">
            <span>${file.name}</span>
            <span class="status">Uploading...</span>
        </div>
        <div class="w-full bg-gray-200 h-2 mt-2 rounded">
            <div class="bg-blue-500 h-2 rounded progress" style="width:0%"></div>
        </div>
    `;

    document.getElementById("progressList").appendChild(container);

    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    formData.append("files", file);

    xhr.upload.onprogress = e => {
        let percent = (e.loaded / e.total) * 100;
        container.querySelector(".progress").style.width = percent + "%";
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            container.querySelector(".status").innerText = "Done";
            showToast(`${file.name} converted`);
        } else {
            container.querySelector(".status").innerText = "Error";
            showToast(`${file.name} failed`, "error");
        }
    };

    xhr.open("POST", "/convert/xml-to-show");
    xhr.send(formData);
}