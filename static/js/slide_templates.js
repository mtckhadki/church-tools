let allTemplates = [];

async function loadTemplates() {

    const res = await fetch('/api/slide-templates');
    allTemplates = await res.json();

    renderTemplates(allTemplates);
}

function renderTemplates(templates) {

    const grid = document.getElementById('templateGrid');

    grid.innerHTML = '';

    templates.forEach(t => {

        grid.innerHTML += `
        <div class="bg-white rounded-xl shadow p-5 border hover:shadow-lg transition">

            <div class="flex justify-between items-start mb-3">

                <div>
                    <h3 class="font-bold text-lg">${t.name}</h3>
                    <p class="text-sm text-gray-500 capitalize">${t.type}</p>
                </div>

                <button onclick="deleteTemplate('${t.id}')"
                        class="text-red-500 hover:text-red-700">
                    🗑
                </button>

            </div>

            <div class="flex gap-2 mt-4">

                <a href="/slide-template-editor?id=${t.id}"
                   class="flex-1 bg-blue-600 text-white text-center py-2 rounded">
                    Edit
                </a>

                <button onclick="duplicateTemplate('${t.id}')"
                        class="flex-1 border py-2 rounded">
                    Duplicate
                </button>

            </div>

        </div>
        `;
    });
}

function filterTemplates() {

    const query = document.getElementById("templateSearch")
        .value
        .toLowerCase();

    const filtered = allTemplates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query)
    );

    renderTemplates(filtered);
}

async function deleteTemplate(id) {
    await fetch(`/api/slide-templates/${id}`, { method: 'DELETE' });
    loadTemplates();
}

loadTemplates();