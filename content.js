// content.js —— 带详细日志上报
let hasObserved = false;

function sendLog(message) {
  chrome.runtime.sendMessage({ type: 'log', message: message });
}

function extractReviews() {
  const articles = document.querySelectorAll('article.twc-border-b-\\[1px\\]');
  sendLog(`监听页面中共有 ${articles.length} 个评论容器`);

  if (articles.length === 0) {
    sendLog('⚠️ 未找到任何评论容器（可能结构变化或不在评论页）');
    return 0;
  }

  const newReviews = [];

  for (const article of articles) {
    try {
      const dateElem = article.querySelector(
        ':scope > div:first-child div.twc-text-\\[14px\\]\\/\\[15px\\].twc-text-bluegray-700'
      );
      const date = dateElem ? dateElem.textContent.trim() : '';

      const starIcons = article.querySelectorAll(':scope > div:first-child .twc-bg-full-star');
      const rating = starIcons.length.toString();

      const optionElem = article.children[1];
      const option = optionElem ? optionElem.textContent.trim() : '';

      const contentSpan = article.querySelector(':scope > div:nth-child(4) span[translate="no"]');
      const content = contentSpan ? contentSpan.textContent.trim() : '';

      if (content) {
        newReviews.push({ date, rating, option, content });
      }
    } catch (e) {
      sendLog('❌ 解析某条评论时出错: ' + e.message);
    }
  }

  if (newReviews.length > 0) {
    sendLog(`✅ 成功提取 ${newReviews.length} 条有效评论`);
    chrome.runtime.sendMessage({ type: 'newReviews', reviews: newReviews });
  } else {
    sendLog('ℹ️ 未提取到有效评论内容（可能已被记录或内容为空）');
  }

  return newReviews.length;
}

function startObserving() {
  if (hasObserved) {
    sendLog('⚠️ 已在监听，忽略重复启动');
    return;
  }
  hasObserved = true;
  sendLog('🟢 开始监听评论区 DOM 变化');

  extractReviews(); // 初始提取

  const observer = new MutationObserver(() => {
    // 防抖：只在 DOM 大量变化后触发一次
    setTimeout(() => {
      sendLog('监听页面 DOM 发生变化，尝试提取新评论...');
      extractReviews();
    }, 800);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startObserving') {
    startObserving();
  }
});