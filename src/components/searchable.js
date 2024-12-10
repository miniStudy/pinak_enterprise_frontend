    // Function to handle the search functionality
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();  // Get the search query and convert it to lowercase
        const rows = document.querySelectorAll('#example tbody tr');  // Select all the rows in the table

        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');  // Get all the table cells in each row
            let rowText = ''; // String to store the combined text of all cells in a row

            // Loop through all cells in the row and combine the text
            for (let i = 0; i < cells.length; i++) {
                rowText += cells[i].textContent.toLowerCase(); // Convert text to lowercase
            }

            // If any part of the row matches the search query, show the row, otherwise hide it
            if (rowText.includes(searchQuery)) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    });
