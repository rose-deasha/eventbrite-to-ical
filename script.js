// Wait for DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    
    // Check if we're returning from OAuth redirect
    checkForAuthCode();
    
    if (authorizeBtn) {
        authorizeBtn.addEventListener('click', initiateOAuthFlow);
    }
    
    if (icalBtn) {
        icalBtn.addEventListener('click', handleIcalDownload);
    }
});

function initiateOAuthFlow() {
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    // Set up OAuth parameters
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: 'YOUR_CLIENT_ID', // Replace with your Eventbrite app's client ID
        redirect_uri: 'YOUR_FRONTEND_URL', // Your frontend URL (e.g., https://yourdomain.com/callback)
        state: state,
        scope: 'event_list_venues event_list_tickets' // Add required scopes
    });

    // Redirect to Eventbrite's authorization page
    window.location.href = `https://www.eventbrite.com/oauth/authorize?${params.toString()}`;
}

function checkForAuthCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const savedState = localStorage.getItem('oauth_state');
    
    if (code && state && state === savedState) {
        // Clear the saved state
        localStorage.removeItem('oauth_state');
        
        // Exchange code for access token
        exchangeCodeForToken(code);
    }
}

function exchangeCodeForToken(code) {
    fetch('YOUR_BACKEND_URL/exchange-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            localStorage.setItem('eventbrite_access_token', data.access_token);
            updateUIForAuthorizedState();
            // Optional: Show success message
            showMessage('Successfully connected to Eventbrite!', 'success');
        } else {
            throw new Error('Failed to get access token');
        }
    })
    .catch(error => {
        console.error('Authorization error:', error);
        showMessage('Failed to authorize with Eventbrite. Please try again.', 'error');
    });
}

function handleIcalDownload() {
    const accessToken = localStorage.getItem('eventbrite_access_token');
    
    if (!accessToken) {
        showMessage('Please authorize with Eventbrite first.', 'error');
        return;
    }
    
    fetch('YOUR_BACKEND_URL/create-ical', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(handleResponse)
    .then(downloadFile)
    .catch(error => {
        console.error('Download error:', error);
        showMessage('Failed to download events. Please try again.', 'error');
    });
}

function updateUIForAuthorizedState() {
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    
    if (localStorage.getItem('eventbrite_access_token')) {
        authorizeBtn.textContent = 'Reauthorize with Eventbrite';
        icalBtn.disabled = false;
    } else {
        authorizeBtn.textContent = 'Authorize with Eventbrite';
        icalBtn.disabled = true;
    }
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.blob();
}

function downloadFile(blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eventbrite_events.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message') || createMessageElement();
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    setTimeout(() => messageDiv.className = 'message hidden', 5000);
}

function createMessageElement() {
    const div = document.createElement('div');
    div.id = 'message';
    div.className = 'message hidden';
    document.body.appendChild(div);
    return div;
}
