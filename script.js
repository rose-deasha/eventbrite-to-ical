// Wait for DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    
    // Check if we're returning from OAuth redirect with access token
    checkForAccessToken();
    
    if (authorizeBtn) {
        console.log('Authorize button found, adding click listener');
        authorizeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Authorize button clicked');
            initiateOAuthFlow();
        });
    } else {
        console.error('Authorize button not found in DOM');
    }
    
    if (icalBtn) {
        console.log('iCal button found, adding click listener');
        icalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('iCal button clicked');
            handleIcalDownload();
        });
    } else {
        console.error('iCal button not found in DOM');
    }

    // Update UI based on authorization state
    updateUIForAuthorizedState();
});

function initiateOAuthFlow() {
    console.log('Initiating OAuth flow');
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    try {
        // Set up OAuth parameters
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: 'DKC5PJR4CSVOCX7WZY',
            redirect_uri: 'https://backend-1-2x3i.onrender.com/oauth/callback',
            state: state
        });

        const authUrl = `https://www.eventbrite.com/oauth/authorize?${params.toString()}`;
        console.log('Redirecting to:', authUrl);
        
        // Redirect to Eventbrite's authorization page
        window.location.href = authUrl;
    } catch (error) {
        console.error('Error in initiateOAuthFlow:', error);
        showMessage('Error starting authorization: ' + error.message, 'error');
    }
}

function checkForAccessToken() {
    console.log('Checking for access token');
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
        console.log('Access token found in URL');
        // Store the access token
        localStorage.setItem('eventbrite_access_token', accessToken);
        // Update UI
        updateUIForAuthorizedState();
        // Show success message
        showMessage('Successfully connected to Eventbrite!', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        console.log('No access token found in URL');
    }
}

function handleIcalDownload() {
    console.log('Handling iCal download');
    const accessToken = localStorage.getItem('eventbrite_access_token');
    
    if (!accessToken) {
        console.error('No access token found in localStorage');
        showMessage('Please authorize with Eventbrite first.', 'error');
        return;
    }
    
    try {
        const downloadUrl = `https://backend-1-2x3i.onrender.com/events/ical?access_token=${accessToken}`;
        console.log('Redirecting to download URL:', downloadUrl);
        window.location.href = downloadUrl;
    } catch (error) {
        console.error('Error in handleIcalDownload:', error);
        showMessage('Error downloading calendar: ' + error.message, 'error');
    }
}

function updateUIForAuthorizedState() {
    console.log('Updating UI state');
    const authorizeBtn = document.getElementById('authorize-btn');
    const icalBtn = document.getElementById('ical-btn');
    const hasToken = localStorage.getItem('eventbrite_access_token');
    
    console.log('Has access token:', !!hasToken);
    
    if (hasToken) {
        if (authorizeBtn) {
            authorizeBtn.textContent = 'Reauthorize with Eventbrite';
            authorizeBtn.classList.add('authorized');
        }
        if (icalBtn) {
            icalBtn.disabled = false;
            icalBtn.classList.remove('disabled');
        }
    } else {
        if (authorizeBtn) {
            authorizeBtn.textContent = 'Authorize with Eventbrite';
            authorizeBtn.classList.remove('authorized');
        }
        if (icalBtn) {
            icalBtn.disabled = true;
            icalBtn.classList.add('disabled');
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
