// --- Localization Helper ---
const locales = {
    "af": "Ongelees",
    "az": "Oxunmamış",
    "id": "Belum dibaca",
    "ms": "Belum dibaca",
    "ca": "No llegit",
    "cs": "Nepřečtené",
    "cy": "Heb ddarllen",
    "da": "Ulæste",
    "de": "Ungelesen",
    "et": "Lugemata",
    "en-GB": "Unread",
    "en": "Unread",
    "es": "No leídos",
    "es-419": "No leídos",
    "eu": "Irakurri gabeak",
    "fil": "Hindi pa nababasa",
    "fr": "Non lus",
    "fr-CA": "Non lus",
    "ga": "Gan léamh",
    "gl": "Non lidos",
    "hr": "Nepročitano",
    "it": "Da leggere",
    "zu": "Okungafundiwe",
    "is": "Ólesið",
    "sw": "Haijasomwa",
    "lv": "Neizlasītās",
    "lt": "Neskaityta",
    "hu": "Olvasatlan",
    "no": "Ulest",
    "nl": "Ongelezen",
    "pl": "Nieprzeczytane",
    "pt-BR": "Não lidas",
    "pt-PT": "Não lidas",
    "ro": "Necitite",
    "sk": "Neprečítané",
    "sl": "Neprebrano",
    "fi": "Lukemattomat",
    "sv": "Oläst",
    "vi": "Chưa đọc",
    "tr": "Okunmamış",
    "el": "Μη αναγνωσμένα",
    "bg": "Непрочетени",
    "mn": "Уншаагүй",
    "ru": "Непрочитанные",
    "sr": "Непрочитано",
    "uk": "Непрочитані",
    "hy": "Չկարդացված",
    "he": "לא נקרא",
    "iw": "לא נקרא",
    "ur": "غیر خواندہ",
    "ar": "غير مقروءة",
    "fa": "خوانده نشده",
    "ne": "नपढेको",
    "mr": "न वाचलेले",
    "hi": "बिना पढ़े",
    "bn": "অপঠিত",
    "gu": "વાંચ્યા વગરના",
    "ta": "படிக்காதவை",
    "te": "చదవనివి",
    "kn": "ಓದದಿರುವ",
    "ml": "വായിക്കാത്തവ",
    "si": "නොකියවූ",
    "th": "ยังไม่ได้อ่าน",
    "lo": "ຍັງບໍ່ໄດ້ອ່ານ",
    "my": "မဖတ်ရသေးသော",
    "ka": "წაუკითხავი",
    "am": "ያልተነበበ",
    "chr": "Unread",
    "km": "មិនទាន់អាន",
    "zh-HK": "未讀",
    "zh-TW": "未讀",
    "zh-CN": "未读",
    "ja": "未読",
    "ko": "안 읽음"
};

function getUnreadLabel() {
  const lang = document.documentElement.lang;
  if (locales[lang]) {
    return locales[lang];
  }
  // Fallback for codes like "en-US" to "en"
  const shortLang = lang.split('-')[0];
  if (locales[shortLang]) {
    return locales[shortLang];
  }
  return "Unread";
}

function createAndInsertUnreadButton() {
  // Robust check: remove ANY existing unread buttons before creating a new one
  const existingButtons = document.querySelectorAll('.TO[data-tooltip="Unread"]');
  if (existingButtons.length > 0) {
    // If one already exists and looks correct, we don't need to do anything.
    // If multiple exist, we'll let the update loop clean them up, but we shouldn't add another.
    return; 
  }

  const starredButton = document.querySelector('a[href$="#starred"]');
  if (!starredButton) return;

  const starredContainer = starredButton.closest('.TO');
  if (!starredContainer) return;

  const unreadContainer = starredContainer.cloneNode(true);

  const unreadLabel = getUnreadLabel();
  unreadContainer.setAttribute('data-tooltip', unreadLabel);
  unreadContainer.id = '';

  const unreadLink = unreadContainer.querySelector('a');
  if (!unreadLink) return;

  const currentPath = window.location.pathname;
  const unreadUrl = `${currentPath}#search/is%3Aunread`;
  unreadLink.href = unreadUrl;
  
  unreadLink.textContent = unreadLabel;
  unreadLink.setAttribute('aria-label', unreadLabel);

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
  const unreadLabel = getUnreadLabel();
  const unreadButtonContainer = document.querySelector(`.TO[data-tooltip="${unreadLabel}"]`);
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

     // --- Sync Unread Count Bubble ---
    // Feature removed: Redundant unread count display.
    const unreadCountBubble = unreadButtonContainer.querySelector('.bsU');
    if (unreadCountBubble) {
        unreadCountBubble.remove();
    }
    
    const unreadLink = unreadButtonContainer.querySelector('a');
    if (unreadLink) {
        unreadLink.setAttribute('aria-label', unreadLabel);
    }
  }
}

// --- Main Loop for Insertion and State Management ---
// Consolidates insertion checks and state updates into a single, less frequent poll.
const mainLoopId = setInterval(() => {
  const unreadLabel = getUnreadLabel();
  const unreadButtonLink = document.querySelector(`a[aria-label="${unreadLabel}"]`);

  if (!unreadButtonLink) {
    // Attempt to insert if missing
    createAndInsertUnreadButton();
    // If insertion succeeded, we can immediately update state, but the next tick or event will also catch it.
    // We check if it was successfully inserted before updating state to avoid errors.
    if (document.querySelector(`a[aria-label="${unreadLabel}"]`)) {
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