function createAndInsertUnreadButton() {
  const starredButton = document.querySelector('a[href$="#starred"]');
  if (!starredButton) return;

  const starredContainer = starredButton.closest('.TO');
  if (!starredContainer) return;

  const unreadContainer = starredContainer.cloneNode(true);

  unreadContainer.setAttribute('data-tooltip', 'Unread');
  unreadContainer.id = '';

  const unreadLink = unreadContainer.querySelector('a');
  if (!unreadLink) return;

  const currentPath = window.location.pathname;
  const unreadUrl = `${currentPath}#search/is%3Aunread`;
  unreadLink.href = unreadUrl;
  unreadLink.textContent = 'Unread';
  unreadLink.setAttribute('aria-label', 'Unread');

  const countBubble = unreadContainer.querySelector('.bsU');
  if (countBubble) {
    countBubble.remove();
  }

  // --- Change the icon class ---
  const tnDiv = unreadContainer.querySelector('.TN.bzz'); // Find the div with TN and bzz classes
  if (tnDiv) {
    tnDiv.classList.remove('aHS-bnw'); // Remove Starred icon class
    tnDiv.classList.add('aHS-aHO');    // Add All Mail icon class
  }
  // --- End icon change ---

  unreadContainer.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = unreadUrl;
  });

  unreadContainer.addEventListener('mouseover', () => {
    unreadContainer.classList.add('NQ');
  });
  unreadContainer.addEventListener('mouseout', () => {
    unreadContainer.classList.remove('NQ');
  });

  starredContainer.parentElement.insertBefore(unreadContainer, starredContainer);
}

function updateUnreadButtonState() {
  const unreadButtonContainer = document.querySelector('.TO[data-tooltip="Unread"]');
  if (unreadButtonContainer) {
    const unreadHash = '#search/is%3Aunread';
    if (window.location.hash === unreadHash) {
      // Selected state: TO aBP nZ aiq
      unreadButtonContainer.classList.add('aBP');
      unreadButtonContainer.classList.add('nZ');
      unreadButtonContainer.classList.add('aiq');
    } else {
      // Unselected state: TO aiq
      unreadButtonContainer.classList.remove('aBP');
      unreadButtonContainer.classList.remove('nZ');
      unreadButtonContainer.classList.add('aiq');
    }
  }
}

// --- Main Loop for Insertion and State Management ---
// Consolidates insertion checks and state updates into a single, less frequent poll.
const mainLoopId = setInterval(() => {
  const unreadButtonLink = document.querySelector('a[aria-label="Unread"]');

  if (!unreadButtonLink) {
    // Attempt to insert if missing
    createAndInsertUnreadButton();
    // If insertion succeeded, we can immediately update state, but the next tick or event will also catch it.
    // We check if it was successfully inserted before updating state to avoid errors.
    if (document.querySelector('a[aria-label="Unread"]')) {
      updateUnreadButtonState();
    }
  } else {
    // If present, ensure visual state matches the URL
    updateUnreadButtonState();
  }
}, 500);

// --- Event Listeners for Instant Responsiveness ---
// These ensure the button highlights immediately on navigation, without waiting for the interval.
window.addEventListener('hashchange', updateUnreadButtonState);
window.addEventListener('popstate', updateUnreadButtonState);

// Initial run
updateUnreadButtonState();