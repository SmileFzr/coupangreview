let allReviews = [];
let isRecording = false;
let logLines = [];

function appendLog(message) {
  const now = new Date().toLocaleTimeString();
  const line = `[${now}] ${message}`;
  logLines.push(line);
  // 只保留最近 50 行
  if (logLines.length > 50) logLines.shift();
  document.getElementById('log').textContent = logLines.join('\n');
}

function updateStatus() {
  const count = allReviews.length;
  document.getElementById('status').textContent = isRecording
    ? `🟢 记录中... 已捕获 ${count} 条`
    : `⏸️ 已暂停 | 共 ${count} 条`;
}

function setupButtons() {
  document.getElementById('recordBtn')?.addEventListener('click', () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  document.getElementById('exportBtn')?.addEventListener('click', exportToCSV);
  document.getElementById('clearBtn')?.addEventListener('click', clearAll);
}

function startRecording() {
  isRecording = true;
  updateStatus();
  appendLog('用户点击“开始记录”');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'startObserving' }, (response) => {
        if (chrome.runtime.lastError) {
          appendLog('❌ 无法向页面发送指令: ' + chrome.runtime.lastError.message);
        } else {
          appendLog('✅ 已通知页面开始监听评论');
        }
      });
    } else {
      appendLog('❌ 未找到当前活动标签页');
    }
  });
}

function stopRecording() {
  isRecording = false;
  updateStatus();
  appendLog('用户点击“停止记录”');
}

function exportToCSV() {
  if (allReviews.length === 0) {
    appendLog('⚠️ 无数据可导出');
    return;
  }

  const headers = ['日期', '评分', '选项', '内容'];
  const csvRows = [headers.join(',')];

  allReviews.forEach(review => {
    const row = [
      review.date || '',
      review.rating || '',
      review.option || '',
      `"${(review.content || '').replace(/"/g, '""')}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'coupang_reviews.csv';
  a.click();
  URL.revokeObjectURL(url);
  appendLog(`✅ 成功导出 ${allReviews.length} 条评论`);
}

function clearAll() {
  allReviews = [];
  saveToStorage();
  updateStatus();
  appendLog('🗑️ 已清空所有记录');
}

function saveToStorage() {
  chrome.storage.local.set({ reviews: allReviews }); // ✅ 修正拼写
}

function restoreFromStorage() {
  chrome.storage.local.get(['reviews'], (result) => {
    if (Array.isArray(result.reviews)) {
      allReviews = result.reviews;
    }
    updateStatus();
    appendLog(`💾 从存储恢复 ${allReviews.length} 条记录`);
  });
}

// 接收 content.js 发来的消息（评论 or 日志）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'newReviews' && Array.isArray(request.reviews)) {
    allReviews.push(...request.reviews);
    updateStatus();
    saveToStorage();
    appendLog(`📥 收到 ${request.reviews.length} 条新评论`);
  }
  if (request.type === 'log' && typeof request.message === 'string') {
    appendLog(`📡 页面日志: ${request.message}`);
  }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  restoreFromStorage();
  setupButtons();
  appendLog('插件已加载');
});