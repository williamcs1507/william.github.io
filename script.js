const SPREADSHEET_ID = '1h2CzeXqNqTwgx2JSNkKPp7WzlUalpYImnSEZBISuTVA'; // Google Sheet ID
const API_KEY = 'AIzaSyDLnB81oSKxtjt76nvMPgCiNvW0MKQFE6M';

const kulaForm = document.getElementById('booking-form');

const dateUsed = [];

const allHours = [
    "11.00 - 12.00",
    "12.00 - 13.00",
    "13.00 - 14.00",
    "14.00 - 15.00",
    "15.00 - 16.00",
    "17.00 - 18.00",
    "18.00 - 19.00",
    "19.00 - 20.00"
];

kulaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const kulaText1 = document.getElementById('nama-text').value;
    const kulaText2 = document.getElementById('paket').value;
    const kulaText3 = document.getElementById('tanggal').value;
    const kulaText4 = document.getElementById('jam').value;
    const kulaText5 = document.getElementById('phone').value;

    const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSeJfJ62PNIH86ITRxql2yxrAgR64jbrfwCfq4ANKIj4VyzmbA/formResponse";

    const formData = new URLSearchParams();
    formData.append("entry.186699018", kulaText1);
    formData.append("entry.1947807311", kulaText2);
    formData.append("entry.748694051", kulaText3);
    formData.append("entry.575709239", kulaText4);
    formData.append("entry.807439808", kulaText5);

    fetch(googleFormURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
    })
        .then(() => {
            alert("Form submitted successfully!");
            kulaForm.reset();
        })
        .catch((error) => {
            console.error("Error submitting the form:", error);
        });
});

function fetchKula() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Booking!D2:E?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;

            if (!rows || rows.length === 0) {
                console.error('No data found in the sheet.');
                return;
            }

            rows.forEach(([date, hour]) => {
                if (!dateUsed[date]) {
                    dateUsed[date] = [];
                }
                dateUsed[date].push(hour);
            });
        })
        .catch(error => console.error('Error fetching data from Google Sheets:', error));
}

function getHoursForDate(date) {
    return dateUsed[date] || [];
}

document.addEventListener("DOMContentLoaded", function () {
    fetchKula();

    const tanggalInput = document.getElementById("tanggal");
    const jamSelect = document.getElementById("jam");

    tanggalInput.addEventListener("input", function () {
        const selectedDate = tanggalInput.value;
        const bookedHours = dateUsed[selectedDate] || [];

        console.log(bookedHours);
        jamSelect.innerHTML = '<option value="">Pilih Waktu</option>';

        let hasAvailableHours = false;
        allHours.forEach(hour => {
            if (!bookedHours.includes(hour)) {
                const option = document.createElement("option");
                option.value = hour;
                option.textContent = hour;
                jamSelect.appendChild(option);
                hasAvailableHours = true;
            }
        });

        jamSelect.disabled = !hasAvailableHours;
    });
});