function downloadIcal() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert("Please enter an API key.");
        return;
    }

    // Make a request to the backend with the API key
    fetch('https://YOUR_BACKEND_URL/create-ical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'eventbrite_events.ics';
        document.body.appendChild(a); // Append the element to the body
        a.click(); // Trigger download
        document.body.removeChild(a); // Remove element after download
    })
    .catch(error => {
        alert("An error occurred: " + error.message);
    });
}
