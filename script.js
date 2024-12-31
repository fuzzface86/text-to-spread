function processFiles() {
    const fileInput = document.getElementById('fileInput');
    const table = document.getElementById('cardTable').getElementsByTagName('tbody')[0];

    Array.from(fileInput.files).forEach(file => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const lines = event.target.result.split('\n');
            const cardData = {};

            lines.forEach(line => {
                const [key, ...value] = line.split(':');
                if (key && value) {
                    cardData[key.trim()] = value.join(':').trim();
                }
            });

            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${cardData.Name || ''}</td>
                <td>${cardData.Type || ''}</td>
                <td>${cardData.Faction || ''}</td>
                <td>${cardData["Power Level"] || cardData.Stats || ''}</td>
                <td>${cardData.Abilities || ''}</td>
                <td>${cardData.Credits || ''}</td>
                <td>${cardData["Flavor Text"] || ''}</td>
            `;
        };

        reader.readAsText(file);
    });
}

function clearTable() {
    const table = document.getElementById('cardTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Remove all rows from the table body
    document.getElementById('fileInput').value = ""; // Clear the file input
}

function exportToExcel() {
    const table = document.getElementById('cardTable');
    const rows = Array.from(table.rows);

    const headers = ["Name", "Type", "Faction", "Power Level", "Abilities", "Credits", "Flavor Text"];
    const data = rows.map((row, rowIndex) => {
        const cells = Array.from(row.cells);
        if (rowIndex === 0) {
            return headers;
        } else {
            return headers.map((_, colIndex) => {
                const cellContent = cells[colIndex]?.innerText || "";
                const escapedContent = cellContent.replace(/"/g, '""');
                return `"${escapedContent}"`;
            });
        }
    });

    const csvContent = data.map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'card_data.csv';
    a.click();

    URL.revokeObjectURL(url);
}
