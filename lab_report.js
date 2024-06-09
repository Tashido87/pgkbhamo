document.addEventListener('DOMContentLoaded', function () {
    flatpickr('.date-input', {
        enableTime: false,
        dateFormat: "d-M-Y",
        altInput: true,
        altFormat: "j-M-Y",
        clickOpens: true,
        static: true // For flat design like iOS
    });

    document.getElementById('clear-dates').addEventListener('click', function () {
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
    });

    document.getElementById('get-result').addEventListener('click', function () {
        fetchAndParseData();
    });
});

async function fetchAndParseData() {
    const url = 'https://script.google.com/macros/s/AKfycbzbaGDGL5857PAWZ9rJDGKqRVX-V2UTGzEnfmaZFiUuO4cxY5kr_-Kh9E7ALCQUo5Wv/exec';
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const loadingIndicator = document.getElementById('loading');
    const overlay = document.getElementById('overlay');

    // Show loading indicator
    loadingIndicator.style.display = 'block';
    overlay.style.display = 'block';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();

        console.log('Fetched data:', jsonData);

        // Convert start and end date to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        console.log('Start date:', start);
        console.log('End date:', end);

        // Filter data based on start and end dates
        const filteredData = jsonData.filter(row => {
            const date = new Date(row[0]);
            return date >= start && date <= end;
        });

        console.log('Filtered data:', filteredData);

        // Perform calculations and update the table
        updateTable(filteredData, start, end);
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        overlay.style.display = 'none';
    }
}

function parseCsvData(csv) {
    const lines = csv.split('\n');
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length > 1) {
            result.push(line);
        }
    }
    return result;
}

const cellConfigurations = [
    {
        selector: '.age-15-19-hiv-tested-sw-f',
        conditions1: {
            risk: 'SW',
            gender: 'F',
            test: 'Yes',
            ageRange: [15, 19],
            site: 'KPSC',
            calendar: 'New'
        },
        conditions2: {
            risk: 'SW',
            gender: 'F',
            test: 'Yes',
            ageRange: [15, 19],
            site: 'Mobile',
            calendar: 'New'
        }
    },
    // Add more configurations as needed
];

function updateTable(data, start, end) {
    cellConfigurations.forEach(config => {
        const result1 = countMatches(data, config.conditions1, start, end);
        const result2 = countMatches(data, config.conditions2, start, end);
        const totalResult = result1 + result2;

        console.log(`Calculated result for ${config.selector}: ${totalResult}`);
        const cell = document.querySelector(config.selector);
        if (cell) {
            cell.textContent = totalResult;
            console.log('Updated cell:', cell);
        } else {
            console.error(`Cell not found for selector: ${config.selector}`);
        }
    });
}

function countMatches(data, conditions, startDate, endDate) {
    console.log('Conditions:', conditions);

    const filteredData = data.filter(row => {
        const date = new Date(row[0]); // Column 0
        const age = parseInt(row[5], 10); // Column 5
        const risk = row[2]; // Column 2
        const gender = row[6]; // Column 6
        const test = row[10]; // Column 10
        const site = row[13]; // Column 13
        const calendar = row[23]; // Column 23

        const dateMatch = date >= startDate && date <= endDate;
        const ageMatch = age >= conditions.ageRange[0] && age <= conditions.ageRange[1];
        const riskMatch = risk === conditions.risk;
        const genderMatch = gender === conditions.gender;
        const testMatch = test === conditions.test;
        const siteMatch = site === conditions.site;
        const calendarMatch = calendar === conditions.calendar;

        // Detailed logging for debugging
        if (dateMatch && ageMatch && riskMatch && genderMatch && testMatch && siteMatch && calendarMatch) {
            console.log(`Match found - Date: ${date.toISOString().split('T')[0]}, Age: ${age}, Risk: ${risk}, Gender: ${gender}, Test: ${test}, Site: ${site}, Calendar: ${calendar}`);
        }

        return dateMatch && ageMatch && riskMatch && genderMatch && testMatch && siteMatch && calendarMatch;
    });

    console.log(`Filtered data length for conditions: ${JSON.stringify(conditions)}: ${filteredData.length}`);
    return filteredData.length;
}
