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
                <td>${cardData.Stats || ''}</td>
                <td>${cardData.Abilities || ''}</td>
                <td>${cardData.Credits || ''}</td>
                <td>${cardData["Flavor Text"] || ''}</td>
            `;
        };

        reader.readAsText(file);
    });
}

function exportToExcel() {
    const table = document.getElementById('cardTable');
    const rows = Array.from(table.rows);

    // Ensure the correct column order by explicitly defining the headers
    const headers = ["Name", "Type", "Stats", "Abilities", "Credits", "Flavor Text"];
    const data = rows.map((row, rowIndex) => {
        const cells = Array.from(row.cells);
        if (rowIndex === 0) {
            // Return headers as the first row
            return headers;
        } else {
            // Map headers to corresponding cells
            return headers.map((_, colIndex) => {
                const cellContent = cells[colIndex]?.innerText || "";
                // Escape double quotes and wrap fields containing special characters
                const escapedContent = cellContent.replace(/"/g, '""'); // Escape double quotes
                return `"${escapedContent}"`; // Always wrap content in double quotes
            });
        }
    });

    // Convert the data to CSV
    const csvContent = data.map(row => row.join(",")).join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'card_data.csv';
    a.click();

    URL.revokeObjectURL(url);
}
