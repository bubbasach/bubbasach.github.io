const myButton = document.getElementById('myButton');
const friendButton = document.getElementById('friendButton');

const GITHUB_TOKEN = '';
const REPO_OWNER = 'bubbasach';
const REPO_NAME = 'bubbasach.github.io';
const WORKFLOW_FILE = 'update-state.yml';


// Load state from JSON file
async function loadState() {
    const url = `https://raw.githubusercontent.com/bubbasach/bubbasach.github.io/data-branch/button-project/state.json`;
    try {
        const response = await fetch(url);
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

// Save state by triggering the GitHub Actions workflow
async function saveState(state) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ref: 'main',
                inputs: {
                    myButtonState: state.myButton,
                    friendButtonState: state.friendButton,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to trigger workflow: ${response.statusText}`);
        }

        console.log('Workflow triggered successfully!');
    } catch (error) {
        console.error('Error triggering workflow:', error);
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


function disableButtons(clickedButton) {
    myButton.disabled = true;
    friendButton.disabled = true;

    const originalText = clickedButton.textContent;
    clickedButton.textContent = "Processing...";

    // Re-enable buttons after 5 seconds
    setTimeout(() => {
        myButton.disabled = false;
        friendButton.disabled = false;
        clickedButton.textContent = originalText;
    }, 15000);
}

// Event listeners for buttons
myButton.addEventListener('click', () => {
    const newState = { myButton: 'clicked', friendButton: 'unclicked' };
    disableButtons(myButton);
    saveState(newState);
    updateButtonText(myButton, newState.myButton, "Cheer Bear's turn");
    updateButtonText(friendButton, newState.friendButton, "Grumpy Bear's turn");
});

friendButton.addEventListener('click', () => {
    const newState = { myButton: 'unclicked', friendButton: 'clicked' };
    disableButtons(friendButton);
    saveState(newState);
    updateButtonText(myButton, newState.myButton, "Cheer Bear's turn");
    updateButtonText(friendButton, newState.friendButton, "Grumpy Bear's turn");
});

// Initialize
loadState();
