function filterCards(keywords) {
  const cards = document.querySelectorAll('[class*="Card_Card__"]');

  cards.forEach(card => {
    const cardText =
      card.children[0].children[0].getAttribute('data-company-name');
    for (let keyword of keywords) {
      if (cardText.includes(keyword.trim())) {
        card.style.display = 'none';
        break;
      }
    }
  });
}

function saveKeywordsToLocalStorage(keywords) {
  chrome.storage.local.set({ wanted_filter_company_name: keywords }, () => {
    console.log('Keywords saved to local storage:', keywords);
  });
}

function resetCards() {
  const cards = document.querySelectorAll('[class*="Card_Card__"]');

  cards.forEach(card => {
    card.style.display = '';
  });
}

function initKeywordsToLocalStorage() {
  chrome.storage.local.remove(['wanted_filter_company_name'], () => {
    console.log('Keywords removed to chrome storage');
  });
}

// 익스텐션에서 메시지를 받았을 때 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'filter') {
    resetCards();
    const keywords = request.keyword.split(',');
    if (keywords) {
      filterCards(keywords);
      saveKeywordsToLocalStorage(keywords);
    }
    sendResponse({ status: 'done' });
  } else if (request.action === 'reset') {
    resetCards();
    sendResponse({ status: 'done' });
  } else if (request.action === 'clear') {
    resetCards();
    initKeywordsToLocalStorage();
    sendResponse({ status: 'done' });
  }
});
