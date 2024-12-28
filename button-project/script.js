const myButton = document.getElementById('myButton');
const friendButton = document.getElementById('friendButton');

// Backend API URL
const BACKEND_URL = 'http://localhost:3000'; // Replace with your deployed backend URL

// Load state from the backend
async function loadState() {
    try {
        const response = await fetch(`${BACKEND_URL}/state`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const state = await response.json();
        updateButtonText(myButton, state.myButton, "Cheer Bear's turn");
        updateButtonText(friendButton, state.friendButton, "Grumpy Bear's turn");
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

// Save state by sending a POST request to the backend
async function saveState(state) {
    try {
        const response = await fetch(`${BACKEND_URL}/state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
        });

        if (!response.ok) {
            throw new Error(`Failed to save state: ${response.statusText}`);
        }

        console.log('State saved successfully!');
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

// Update button text and styles based on state
function updateButtonText(button, state, clickedText) {
    if (state === 'clicked') {
        button.textContent = clickedText;
        button.classList.add('clicked');
    } else {
        button.textContent = 'I Love You';
        button.classList.remove('clicked');
    }
}

// Disable buttons temporarily
function disableButtons(clickedButton) {
    myButton.disabled = true;
    friendButton.disabled = true;

    const originalText = clickedButton.textContent;
    clickedButton.textContent = "Processing...";

    // Re-enable buttons after 15 seconds
    setTimeout(() => {
        myButton.disabled = false;
        friendButton.disabled = false;
        clickedButton.textContent = originalText;
    }, 15000);
}

// Event listeners for buttons
myButton.addEventListener('click', () => {
    const newState = { myButton: 'clicked', friendButton: 'unclicked' };
    // disableButtons(myButton);
    saveState(newState);
    updateButtonText(myButton, newState.myButton, "Cheer Bear's turn");
    updateButtonText(friendButton, newState.friendButton, "Grumpy Bear's turn");
});

friendButton.addEventListener('click', () => {
    const newState = { myButton: 'unclicked', friendButton: 'clicked' };
    // disableButtons(friendButton);
    saveState(newState);
    updateButtonText(myButton, newState.myButton, "Cheer Bear's turn");
    updateButtonText(friendButton, newState.friendButton, "Grumpy Bear's turn");
});

// Initialize
loadState();
