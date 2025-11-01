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

  const unreadUrl = 'https://mail.google.com/mail/u/0/#search/is%3Aunread';
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
    const unreadUrl = 'https://mail.google.com/mail/u/0/#search/is%3Aunread';
    if (window.location.href.includes(unreadUrl)) {
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

// --- Insertion Logic ---
const insertionInterval = setInterval(() => {
  // If the unread button is NOT present, insert it.
  if (!document.querySelector('a[aria-label="Unread"]')) {
    createAndInsertUnreadButton();
  }
}, 200);

// --- Observer for State Updates ---
const stateObserver = new MutationObserver(() => {
  updateUnreadButtonState();
});

stateObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial state update when the script runs
updateUnreadButtonState();