document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('wanted_filter_company_name', result => {
    if (result?.wanted_filter_company_name) {
      document.getElementById('keyword').value =
        result.wanted_filter_company_name;
    }
  });
});

document.getElementById('filterButton').addEventListener('click', () => {
  const keyword = document.getElementById('keyword').value;
  if (!keyword) {
    return;
  }

  // 현재 탭에 content script에 메시지 보내기
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'filter', keyword: keyword },
      response => {
        console.log(response?.status);
      }
    );
  });
});

document.getElementById('resetButton').addEventListener('click', () => {
  // 현재 탭에 content script에 reset 메시지 보내기
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' }, response => {
      console.log(response?.status);
    });
  });
});

document.getElementById('clearButton').addEventListener('click', () => {
  // 현재 탭에 content script에 reset 메시지 보내기
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'clear' }, response => {
      console.log(response?.status);
    });
  });
});
