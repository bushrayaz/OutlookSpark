function customizeOutlookUI() {
    const keepButtons = ["Inbox", "Sent Items", "Drafts"];
    const sidebar = document.querySelector('[role="navigation"]');
 
 
    if (sidebar) {
        // Wrap sidebar items in a container
        let sidebarItems = document.getElementById("sidebarItems");
        if (!sidebarItems) {
            sidebarItems = document.createElement("div");
            sidebarItems.id = "sidebarItems";
           
            // Move all sidebar items inside this new container
            while (sidebar.firstChild) {
                sidebarItems.appendChild(sidebar.firstChild);
            }
            sidebar.appendChild(sidebarItems);
        }
 
 
        // Check if "More" button already exists
        let dropdown = document.getElementById("moreButton");
        if (!dropdown) {
            dropdown = document.createElement("button");
            dropdown.id = "moreButton";
            dropdown.innerText = "More ▼";
            dropdown.style.padding = "10px";
            dropdown.style.marginBottom = "10px";
            dropdown.style.backgroundColor = "#f0f0f0";
            dropdown.style.border = "1px solid #f0f0f0";
            dropdown.style.cursor = "pointer";
            dropdown.style.width = "100%";
            dropdown.style.textAlign = "center";
            dropdown.style.fontSize = "14px";
            dropdown.style.fontWeight = "bold";
            dropdown.style.position = "relative";  // Keep button fixed at top
            dropdown.style.zIndex = "1000"; // Ensure it stays on top
 
 
            // Insert "More" button at the very top of the sidebar
            sidebar.insertBefore(dropdown, sidebar.firstChild);
 
 
            // Hide all non-essential sidebar items initially
            const allButtons = sidebarItems.querySelectorAll("button, a");
            allButtons.forEach(button => {
                if (!keepButtons.some(name => button.innerText.includes(name))) {
                    button.style.display = "none";
                }
            });
 
 
            // Toggle visibility of sidebar items
            let hidden = true;
            dropdown.onclick = () => {
                hidden = !hidden;
                allButtons.forEach(button => {
                    if (!keepButtons.some(name => button.innerText.includes(name))) {
                        button.style.display = hidden ? "none" : "block";
                    }
                });
                dropdown.innerText = hidden ? "More ▲" : "More ▼";
            };
        }
    }
 }
 

function expandFocusedInbox() {
    const mainContent = document.querySelector('[role="main"]');
    const focusedInbox = document.querySelector('[aria-label="Message list"]');
    const parentContainer = document.querySelector('[data-test-id="message-pane"]');
    const emailReadPane = document.querySelector('[aria-label="Reading Pane"]');
    const composePane = document.querySelector('[aria-label="Compose mail"]');

    // Hide email read and compose pane when inbox is expanded
    if (emailReadPane) emailReadPane.style.display = "none";
    if (composePane) composePane.style.display = "none";

    if (mainContent) {
        mainContent.style.width = "95%"; // Fully expand
        mainContent.style.maxWidth = "none";
    }
    if (focusedInbox) {
        focusedInbox.style.width = "95%";
        focusedInbox.style.maxWidth = "none";
        focusedInbox.style.flexGrow = "1";
    }
    if (parentContainer) {
        parentContainer.style.width = "95%";
        parentContainer.style.maxWidth = "none";
        parentContainer.style.flexGrow = "1";
    }

    const focusedOtherContainer = document.querySelector('div[class*="rEzfP"]');
    if (focusedOtherContainer) {
        focusedOtherContainer.style.marginLeft = "10px";
        focusedOtherContainer.style.paddingLeft = "5px";
    }
}

function openEmailWithinBounds() {
    const emailReadPane = document.querySelector('[aria-label="Reading Pane"]');
    const composePane = document.querySelector('[aria-label="Compose mail"]');

    emailReadPane.style.display = "flex";
    composePane.style.display = "flex";


    if (emailReadPane) {
        // Check the current position of the email reading pane
        const rect = emailReadPane.getBoundingClientRect();
        const screenWidth = window.innerWidth;

        // If the email goes off-screen to the right, adjust its position
        if (rect.right > screenWidth) {
            emailReadPane.style.right = "0px"; // Bring it back within bounds
        }
    }
}

function closeAndExpandInbox() {
    const composePane = document.querySelector('[aria-label="Compose mail"]');
    const emailReadPane = document.querySelector('[aria-label="Reading Pane"]');
    const mainContent = document.querySelector('[role="main"]');
    const focusedInbox = document.querySelector('[aria-label="Message list"]');

    // Check if either compose or email read pane is visible
    if (!composePane && !emailReadPane) {
        // Expand inbox back to normal size
        if (mainContent) {
            mainContent.style.width = "95%";
        }
        if (focusedInbox) {
            console.log('here')
            focusedInbox.style.width = "95%";
        }

        emailReadPane.style.display = "none";
        composePane.style.display = "none";

        // Ensure no email is pushed off the screen
        openEmailWithinBounds();
    }
}

function shrinkInboxForComposeOrReading() {
    // Add event listener to shrink inbox when composing or reading
    document.addEventListener("click", (event) => {
        const newMailButton = event.target.closest('[aria-label="New mail"]');
        const emailItem = event.target.closest('[data-test-id="message-item"]');
        const closeButton = event.target.closest('[aria-label="Close"]'); // Close button for reading pane

        const mainContent = document.querySelector('[role="main"]');
        const focusedInbox = document.querySelector('[aria-label="Message list"]');
        
        // Shrink inbox when new mail is opened or an email is clicked
        if (newMailButton || emailItem) {
            if (mainContent) mainContent.style.width = "50%"; // Shrink the inbox
            if (focusedInbox) focusedInbox.style.width = "50%";
        }

        // Reset size when compose or reading pane is closed
        if (closeButton) {
            if (mainContent) mainContent.style.width = "95%"; // Expand inbox back
            if (focusedInbox) focusedInbox.style.width = "95%";
        }
    });
}

function fixScreenBounds() {
    const composePane = document.querySelector('[aria-label="Compose mail"]');
    const emailReadPane = document.querySelector('[aria-label="Reading Pane"]');

    if (composePane) {
        composePane.style.right = "5px"; // Ensures it stays within the right boundary
    }
    if (emailReadPane) {
        emailReadPane.style.right = "5px";
    }
}

function detectCloseEvents() {
    const observer = new MutationObserver(() => {
        const composePane = document.querySelector('[aria-label="Compose mail"]');
        const emailReadPane = document.querySelector('[aria-label="Reading Pane"]');

        if (!composePane && !emailReadPane) {
            closeAndExpandInbox(); // Expand inbox back when nothing is open
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function roundInboxCorners() {
    const inboxContainer = document.querySelector('[aria-label="Message list"]');
    const composePane = document.querySelector('[aria-label="Compose mail"]');
    const emailReadPane = document.querySelector('[aria-label="Reading Pane"]');

    if (inboxContainer) {
        inboxContainer.style.borderRadius = "12px"; // Rounded corners
        inboxContainer.style.overflow = "hidden"; // Prevent content spill
        inboxContainer.style.margin = "10px"; // Add spacing
        inboxContainer.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.1)"; // Optional: Adds a subtle shadow
    }
    if (composePane) {
        composePane.style.borderRadius = "12px"; // Rounded corners
        composePane.style.overflow = "hidden"; // Prevent content spill
        composePane.style.margin = "10px"; // Add spacing
        composePane.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.1)"; // Optional: Adds a subtle shadow
    }
    if (emailReadPane) {
        emailReadPane.style.borderRadius = "12px"; // Rounded corners
        emailReadPane.style.overflow = "hidden"; // Prevent content spill
        emailReadPane.style.margin = "10px"; // Add spacing
        emailReadPane.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.1)"; // Optional: Adds a subtle shadow
    }
}



// Run customization after page loads
window.onload = () => {
    setTimeout(customizeOutlookUI, 3000);
    setTimeout(() => {
        expandFocusedInbox();
        shrinkInboxForComposeOrReading();
        detectCloseEvents();
        fixScreenBounds();     
        roundInboxCorners();
    }, 300);
};

