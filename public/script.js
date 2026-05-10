// ============================================================================
// GEMINI AI STUDIO - FRONTEND LOGIC
// ============================================================================

const TIMEOUT_MS = 60000; // 60 seconds

// ============================================================================
// TAB NAVIGATION
// ============================================================================

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// ============================================================================
// CHAT
// ============================================================================

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox   = document.getElementById('chat-box');
const exportBtn = document.getElementById('export-btn');

let conversationHistory = [];

// Show welcome state
(function showChatEmpty() {
  const div = document.createElement('div');
  div.className = 'chat-empty';
  div.innerHTML = `
    <div class="empty-icon">&#10022;</div>
    <p><strong>Gemini AI is ready</strong></p>
    <p>Start a conversation below.</p>
  `;
  chatBox.appendChild(div);
})();

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  setChatFormDisabled(true);

  // Remove empty state placeholder
  const emptyEl = chatBox.querySelector('.chat-empty');
  if (emptyEl) emptyEl.remove();

  appendMessage('user', userMessage);
  userInput.value = '';

  conversationHistory.push({ role: 'user', text: userMessage });

  const thinkingEl = appendThinking();

  try {
    const data = await apiRequest('/api/chat', { conversation: conversationHistory });
    thinkingEl.remove();
    const aiText = data.result;
    conversationHistory.push({ role: 'model', text: aiText });
    appendMessage('bot', aiText);
  } catch (err) {
    thinkingEl.remove();
    appendMessage('bot', `\u26a0\ufe0f ${err.message}`);
  } finally {
    setChatFormDisabled(false);
    userInput.focus();
  }
});

exportBtn.addEventListener('click', () => {
  if (conversationHistory.length === 0) {
    alert('No conversation to export.');
    return;
  }
  const lines = conversationHistory.map(({ role, text }) =>
    `[${role === 'user' ? 'You' : 'Gemini'}]\n${text}\n`
  );
  const blob = new Blob([lines.join('\n---\n\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `gemini-chat-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

function appendMessage(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', sender);

  const content = document.createElement('div');
  content.className = 'message-content';

  // Render markdown for bot messages
  if (sender === 'bot' && window.marked) {
    content.innerHTML = marked.parse(text);
  } else {
    content.textContent = text;
  }

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copy';
  copyBtn.addEventListener('click', () => copyToClipboard(text, copyBtn));
  content.appendChild(copyBtn);

  wrapper.appendChild(content);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  return wrapper;
}

function appendThinking() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message', 'bot');

  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = `
    <div class="thinking-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  wrapper.appendChild(content);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  return wrapper;
}

function setChatFormDisabled(disabled) {
  userInput.disabled = disabled;
  chatForm.querySelector('button').disabled = disabled;
}

// ============================================================================
// UPLOAD PANELS  (Image / Document / Audio)
// ============================================================================

setupUploadPanel({
  tabId:           'image',
  fileInputId:     'image-file',
  dropZoneId:      'image-drop-zone',
  previewWrapperId:'image-preview-wrap',
  previewImgId:    'image-preview',
  fileInfoId:      null,
  filenameId:      null,
  promptId:        'image-prompt',
  submitId:        'image-submit',
  resultId:        'image-result',
  endpoint:        '/generate-text-from-image',
  fileField:       'image',
  isImage:         true,
  submitLabel:     'Analyzing...',
});

setupUploadPanel({
  tabId:           'document',
  fileInputId:     'document-file',
  dropZoneId:      'document-drop-zone',
  previewWrapperId: null,
  previewImgId:    null,
  fileInfoId:      'document-file-info',
  filenameId:      'document-filename',
  promptId:        'document-prompt',
  submitId:        'document-submit',
  resultId:        'document-result',
  endpoint:        '/generate-text-from-document',
  fileField:       'document',
  isImage:         false,
  submitLabel:     'Analyzing...',
});

setupUploadPanel({
  tabId:           'audio',
  fileInputId:     'audio-file',
  dropZoneId:      'audio-drop-zone',
  previewWrapperId: null,
  previewImgId:    null,
  fileInfoId:      'audio-file-info',
  filenameId:      'audio-filename',
  promptId:        'audio-prompt',
  submitId:        'audio-submit',
  resultId:        'audio-result',
  endpoint:        '/generate-text-from-audio',
  fileField:       'audio',
  isImage:         false,
  submitLabel:     'Transcribing...',
});

function setupUploadPanel(cfg) {
  const fileInput   = document.getElementById(cfg.fileInputId);
  const dropZone    = document.getElementById(cfg.dropZoneId);
  const promptEl    = document.getElementById(cfg.promptId);
  const submitBtn   = document.getElementById(cfg.submitId);
  const resultBox   = document.getElementById(cfg.resultId);
  const previewWrap = cfg.previewWrapperId ? document.getElementById(cfg.previewWrapperId) : null;
  const previewImg  = cfg.previewImgId     ? document.getElementById(cfg.previewImgId)     : null;
  const fileInfo    = cfg.fileInfoId       ? document.getElementById(cfg.fileInfoId)       : null;
  const filenameEl  = cfg.filenameId       ? document.getElementById(cfg.filenameId)       : null;

  let selectedFile = null;

  // Clicking anywhere on the drop zone opens the file picker
  dropZone.addEventListener('click', () => fileInput.click());

  // Drag & drop
  dropZone.addEventListener('dragover',  (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) setFile(fileInput.files[0]);
  });

  // Remove-file buttons for this tab
  document.querySelectorAll(`.remove-file-btn[data-target="${cfg.tabId}"]`).forEach(btn => {
    btn.addEventListener('click', clearFile);
  });

  submitBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = cfg.submitLabel;

    resultBox.className = 'result-box loading';
    resultBox.innerHTML = `
      <div class="thinking-dots"><span></span><span></span><span></span></div>
      <span>Processing...</span>
    `;
    resultBox.classList.remove('hidden');

    try {
      const formData = new FormData();
      formData.append(cfg.fileField, selectedFile);
      const promptText = promptEl.value.trim();
      if (promptText) formData.append('prompt', promptText);

      const response = await fetchWithTimeout(cfg.endpoint, { method: 'POST', body: formData }, TIMEOUT_MS);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      resultBox.className = 'result-box';

      if (window.marked) {
        resultBox.innerHTML = marked.parse(data.result || '');
      } else {
        resultBox.textContent = data.result || 'No result received.';
      }
    } catch (err) {
      resultBox.className = 'result-box error';
      resultBox.textContent = `\u26a0\ufe0f ${err.message}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  function setFile(file) {
    selectedFile = file;
    dropZone.classList.add('hidden');

    if (cfg.isImage && previewWrap && previewImg) {
      const reader = new FileReader();
      reader.onload = (e) => { previewImg.src = e.target.result; };
      reader.readAsDataURL(file);
      previewWrap.classList.remove('hidden');
    } else if (fileInfo && filenameEl) {
      filenameEl.textContent = file.name;
      fileInfo.classList.remove('hidden');
    }

    submitBtn.disabled = false;
    resultBox.classList.add('hidden');
  }

  function clearFile() {
    selectedFile = null;
    fileInput.value = '';
    dropZone.classList.remove('hidden');
    if (previewWrap) previewWrap.classList.add('hidden');
    if (fileInfo)    fileInfo.classList.add('hidden');
    submitBtn.disabled = true;
    resultBox.classList.add('hidden');
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

async function apiRequest(endpoint, body) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timed out.');
    throw err;
  }
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timed out.');
    throw err;
  }
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
  }).catch(() => {
    btn.textContent = 'Failed';
    setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
  });
}
