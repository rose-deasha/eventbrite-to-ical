<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eventbrite OAuth & iCal Download</title>
    <style>
        /* Your button styles */
        #authorize-btn, #ical-btn {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
        }

        #authorize-btn:hover, #ical-btn:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Authorize Eventbrite and Download iCal</h1>

    <input type="text" id="apiKey" placeholder="Enter Eventbrite API Key (if needed)" />
    <button id="authorize-btn">Authorize with Eventbrite</button>
    <button id="ical-btn">Download iCal</button>

    <script>
        // Function to download iCal
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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'eventbrite_events.ics';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(error => {
                alert("An error occurred: " + error.message);
            });
        }

        // Function to handle OAuth authorization
        document.getElementById('authorize-btn').addEventListener('click', function() {
            const clientId = 'YOUR_CLIENT_ID';  // Your API key (Client ID)
            const redirectUri = 'https://backend-1-2x3i.onrender.com/oauth/callback';  // Your backend redirect URI
            const authUrl = `https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

            // Redirect the user to Eventbrite’s authorization URL
            window.location.href = authUrl;
        });

        // Function to download iCal file
        document.getElementById('ical-btn').addEventListener('click', function() {
            // Try to get the access token from URL or storage
            let accessToken = localStorage.getItem('eventbrite_access_token');
            const urlParams = new URLSearchParams(window.location.search);
            if (!accessToken && urlParams.has('access_token')) {
                accessToken = urlParams.get('access_token');
                localStorage.setItem('eventbrite_access_token', accessToken);  // Store token
            }

            if (!accessToken) {
                alert('Missing access token. Please authorize the app first.');
                return;
            }

            // Fetch the iCal using the access token
            fetch(`https://backend-1-2x3i.onrender.com/events/ical?access_token=${accessToken}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'eventbrite_events.ics';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
                .catch(error => {
                    console.error('Failed to fetch iCal:', error);
                    alert('Error occurred: ' + error.message);
                });
        });
    </script>
</body>
</html>
