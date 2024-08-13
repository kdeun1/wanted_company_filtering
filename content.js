function filterCards(keywords) {
  const cards = document.querySelectorAll('.Card_Card__WdaEk');

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

function resetCards() {
  const cards = document.querySelectorAll('.Card_Card__WdaEk');

  cards.forEach(card => {
    card.style.display = '';
  });
}

// 익스텐션에서 메시지를 받았을 때 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'filter') {
    const keywords = request.keyword.split(',');
    if (keywords) {
      filterCards(keywords);
    }
    sendResponse({ status: 'done' });
  } else if (request.action === 'reset') {
    resetCards();
    sendResponse({ status: 'done' });
  }
});
