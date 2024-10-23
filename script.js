// Wait for DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    
    // Check if we're returning from OAuth redirect with access token
    checkForAccessToken();
    
    if (authorizeBtn) {
        authorizeBtn.addEventListener('click', initiateOAuthFlow);
    }
    
    if (icalBtn) {
        icalBtn.addEventListener('click', handleIcalDownload);
    }

    // Update UI based on authorization state
    updateUIForAuthorizedState();
});

function initiateOAuthFlow() {
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    // Set up OAuth parameters
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: 'YOUR_CLIENT_ID', // Replace with your Eventbrite client ID
        redirect_uri: 'https://backend-1-2x3i.onrender.com/oauth/callback',
        state: state
    });

    // Redirect to Eventbrite's authorization page
    window.location.href = `https://www.eventbrite.com/oauth/authorize?${params.toString()}`;
}

function checkForAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
        // Store the access token
        localStorage.setItem('eventbrite_access_token', accessToken);
        // Update UI
        updateUIForAuthorizedState();
        // Show success message
        showMessage('Successfully connected to Eventbrite!', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function handleIcalDownload() {
    const accessToken = localStorage.getItem('eventbrite_access_token');
    
    if (!accessToken) {
        showMessage('Please authorize with Eventbrite first.', 'error');
        return;
    }
    
    // Redirect to the backend's iCal endpoint
    window.location.href = `https://backend-1-2x3i.onrender.com/events/ical?access_token=${accessToken}`;
}

function updateUIForAuthorizedState() {
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    
    if (localStorage.getItem('eventbrite_access_token')) {
        if (authorizeBtn) authorizeBtn.textContent = 'Reauthorize with Eventbrite';
        if (icalBtn) {
            icalBtn.disabled = false;
            icalBtn.classList.remove('disabled');
        }
    } else {
        if (authorizeBtn) authorizeBtn.textContent = 'Authorize with Eventbrite';
        if (icalBtn) {
            icalBtn.disabled = true;
            icalBtn.classList.add('disabled');
        }
    }
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
