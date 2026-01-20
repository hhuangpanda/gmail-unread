// --- Localization Helper ---
const locales = {
    "af": "Ongelees",
    "az": "Oxunmamış",
    "id": "Belum dibaca",
    "ms": "Belum dibaca",
    "ca": "No llegits",
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
    "it": "Non letti",
    "zu": "Okungafundiwe",
    "is": "Ólesið",
    "sw": "Haijasomwa",
    "lv": "Neizlasītās",
    "lt": "Neskaityti",
    "hu": "Olvasatlanok",
    "no": "Uleste",
    "nl": "Ongelezen",
    "pl": "Nieprzeczytane",
    "pt-BR": "Não lidos",
    "pt-PT": "Não lidos",
    "ro": "Necitite",
    "sk": "Neprečítané",
    "sl": "Neprebrano",
    "fi": "Lukemattomat",
    "sv": "Olästa",
    "vi": "Chưa đọc",
    "tr": "Okunmamış",
    "el": "Μη αναγνωσμένα",
    "bg": "Непрочетени",
    "mn": "Уншаагүй",
    "ru": "Непрочитанные",
    "sr": "Непрочитано",
    "uk": "Непрочитані",
    "hy": "Չկարդացված",
    "he": "לא נקראו",
    "iw": "לא נקראו",
    "ur": "غیر خواندہ",
    "ar": "غير مقروءة",
    "fa": "خوانده نشده",
    "ne": "नपढेका",
    "mr": "न वाचलेले",
    "hi": "बिना पढ़े",
    "bn": "অপঠিত",
    "gu": "વાંચ્યા વગરના",
    "ta": "படிக்காதவை",
    "te": "చదవనివి",
    "kn": "ಓದದಿರುವುದು",
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
  const unreadLabel = getUnreadLabel();
  // Robust check: remove ANY existing unread buttons before creating a new one
  const existingButtons = document.querySelectorAll(`.TO[data-tooltip="${unreadLabel}"]`);
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
    if (window.location.hash.startsWith(unreadHash)) {
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

// --- Mutation Observer for Insertion ---
// Watches for DOM changes to insert the button when Gmail loads or updates.
let throttleTimer;
const startTime = Date.now();

const observer = new MutationObserver((mutations) => {
  const isStartupPhase = Date.now() - startTime < 5000; // First 5 seconds

  if (isStartupPhase) {
    // Run immediately during startup to prevent flickering
    checkAndInsert();
  } else {
    // Throttle afterwards to save CPU
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      throttleTimer = null;
      checkAndInsert();
    }, 500);
  }
});

function checkAndInsert() {
    const unreadLabel = getUnreadLabel();
    const unreadButtonLink = document.querySelector(`a[aria-label="${unreadLabel}"]`);

    if (!unreadButtonLink) {
      createAndInsertUnreadButton();
    }
    // Always update state to ensure it matches the URL, even if the button already existed
    updateUnreadButtonState();
}

observer.observe(document.body, { childList: true, subtree: true });

// --- Event Listeners for Instant Responsiveness ---
// These ensure the button highlights immediately on navigation, without waiting for the interval.
window.addEventListener('hashchange', updateUnreadButtonState);
window.addEventListener('popstate', updateUnreadButtonState);

// Initial run
checkAndInsert();
