const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${CONFIG.SHEET_NAME}`;

async function fetchSensorData() {
    try {
        const response = await fetch(url);
        
        // Check if the response is not OK (e.g., 404 Not Found)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const csvData = await response.text();
        
        // Security check: if the response contains HTML, it's an error page
        if (csvData.includes('<html') || csvData.includes('<!DOCTYPE html>')) {
            throw new Error("Received HTML instead of CSV. Please check your CONFIG.SHEET_ID and access permissions.");
        }
        
        const rows = csvData.split('\n');
        
        // Ensure there is at least a second row to read
        if (rows.length < 2) {
            throw new Error("The CSV does not contain enough rows.");
        }

        const dataRow = rows[1]; 
        const columns = dataRow.split(',');
        const cleanValue = (value) => value ? value.replace(/^"|"$/g, '') : "Empty";

        const temperature = cleanValue(columns[1]);
        const humidity = cleanValue(columns[4]);   
        const light = cleanValue(columns[7]);      
        const lastUpdate = cleanValue(columns[10]);
        
        console.log("Temperature:", temperature);
        console.log("Humidity:", humidity);
        console.log("Light:", light);
        console.log("Last update:", lastUpdate);
        
        document.getElementById('temp-value').innerText = temperature;
        document.getElementById('hum-value').innerText = humidity;
        document.getElementById('light-value').innerText = light;
        document.getElementById('update-value').innerText = lastUpdate;

    } catch (error) {
        console.error("An error occurred during fetch:", error.message);
        
        // Show a clean error message on the page instead of weird code
        document.getElementById('temp-value').innerText = "Error";
        document.getElementById('hum-value').innerText = "Error";
        document.getElementById('light-value').innerText = "Error";
        document.getElementById('update-value').innerText = "Connection error";
    }
}

fetchSensorData();