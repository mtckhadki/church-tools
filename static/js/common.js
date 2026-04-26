function showToast(message, type = "success") {

    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");

    toast.className = `
        px-4 py-3 rounded-lg shadow-lg text-white
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
    `;

    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}