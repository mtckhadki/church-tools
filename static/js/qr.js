function renderFields() {
    let type = document.getElementById("type").value;
    let html = "";

    if (type === "url") {
        html = `<input id="url" placeholder="Enter URL" class="border p-2 w-full">`;
    }

    if (type === "text") {
        html = `<textarea id="text" class="border p-2 w-full"></textarea>`;
    }

    if (type === "wifi") {
        html = `
            <input id="ssid" placeholder="SSID" class="border p-2 w-full mb-2">
            <input id="password" placeholder="Password" class="border p-2 w-full mb-2">
            <input id="security" placeholder="WPA/WEP" class="border p-2 w-full">
        `;
    }

    document.getElementById("fields").innerHTML = html;
}

function generateQR() {

    let formData = new FormData();

    formData.append("template", document.getElementById("template").value);
    formData.append("link", document.getElementById("link").value);

    let logo = document.getElementById("logo").files[0];
    if (logo) formData.append("logo", logo);

    fetch("/generate-qr", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        if (data.error) {
            showToast(data.error, "error");
            return;
        }

        document.getElementById("result").innerHTML = `
            <img src="/download?path=${data.file}" class="w-64 mt-4">
        `;

        showToast("QR Generated");
    });
}

renderFields();