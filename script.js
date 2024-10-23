// Constants
const BACKEND_URL = 'https://backend-1-2x3i.onrender.com';
const CLIENT_ID = 'DKC5PJR4CSVOCX7WZY';  // Your Eventbrite Client ID

// Wait for DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    
    // Check URL parameters for errors or access token
    checkUrlParameters();
    
    if (authorizeBtn) {
        console.log('Authorize button found, adding click listener');
        authorizeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Authorize button clicked');
            initiateOAuthFlow();
        });
    }
    
    if (icalBtn) {
        console.log('iCal button found, adding click listener');
        icalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('iCal button clicked');
            handleIcalDownload();
        });
    }

    updateUIForAuthorizedState();
});

function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const accessToken = urlParams.get('access_token');

    if (error) {
        showMessage('Error: ' + error, 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (accessToken) {
        localStorage.setItem('eventbrite_access_token', accessToken);
        showMessage('Successfully connected to Eventbrite!', 'success');
        updateUIForAuthorizedState();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function initiateOAuthFlow() {
    console.log('Initiating OAuth flow');
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: `${BACKEND_URL}/oauth/callback`,
        state: state
    });

    const authUrl = `https://www.eventbrite.com/oauth/authorize?${params.toString()}`;
    console.log('Redirecting to:', authUrl);
    window.location.href = authUrl;
}

function handleIcalDownload() {
    console.log('Handling iCal download');
    const accessToken = localStorage.getItem('eventbrite_access_token');
    
    if (!accessToken) {
        showMessage('Please authorize with Eventbrite first.', 'error');
        return;
    }
    
    const downloadUrl = `${BACKEND_URL}/events/ical?access_token=${accessToken}`;
    console.log('Downloading from:', downloadUrl);
    window.location.href = downloadUrl;
}

function updateUIForAuthorizedState() {
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    const hasToken = localStorage.getItem('eventbrite_access_token');
    
    if (hasToken) {
        if (authorizeBtn) {
            authorizeBtn.textContent = 'Reauthorize with Eventbrite';
        }
        if (icalBtn) {
            icalBtn.disabled = false;
        }
    } else {
        if (authorizeBtn) {
            authorizeBtn.textContent = 'Authorize with Eventbrite';
        }
        if (icalBtn) {
            icalBtn.disabled = true;
        }
    }
}

function showMessage(message, type = 'info') {
    console.log(`Showing message: ${message} (${type})`);
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
