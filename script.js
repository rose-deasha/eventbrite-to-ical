function downloadIcal() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert("Please enter an API key.");
        return;
    }

    // Make a request to the backend with the API key
    fetch('https://backend-1-2x3i.onrender.com/create-ical', {
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

document.getElementById('authorize-btn').addEventListener('click', function() {
    const clientId = 'YOUR_CLIENT_ID';  // Your API key (Client ID)
    const redirectUri = 'https://backend-1-2x3i.onrender.com/oauth/callback';  // Your backend redirect URI
    const authUrl = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect the user to Eventbrite’s authorization URL
    window.location.href = authUrl;
});

