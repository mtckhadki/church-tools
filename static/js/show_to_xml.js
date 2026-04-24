function uploadFiles() {
    let files = document.getElementById("files").files;
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    fetch("/convert/xml-to-show", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        let output = "";
        data.forEach(r => {
            output += `<div>${r.file} : ${r.status}</div>`;
        });
        document.getElementById("result").innerHTML = output;
    });
}