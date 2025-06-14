let originalEditor, userEditor;

window.onload = () => {
  originalEditor = CodeMirror.fromTextArea(document.getElementById("originalCode"), {
    lineNumbers: true,
    mode: "javascript"
  });

  userEditor = CodeMirror.fromTextArea(document.getElementById("userCode"), {
    lineNumbers: true,
    mode: "javascript"
  });

  // Optional: Load history on startup
  // viewHistory();
};

function changeLanguage() {
  const lang = document.getElementById('languageSelector').value;
  originalEditor.setOption("mode", lang);
  userEditor.setOption("mode", lang);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, match => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return escapeMap[match];
  });
}

async function compareCode() {
  const original = originalEditor.getValue();
  const user = userEditor.getValue();
  const result = document.getElementById('result');

  const originalLines = original.split('\n');
  const userLines = user.split('\n');
  const maxLines = Math.max(originalLines.length, userLines.length);

  let html = `<strong>🔍 Line-by-Line Comparison:</strong><br>`;

  for (let i = 0; i < maxLines; i++) {
    const orig = originalLines[i] || '';
    const usr = userLines[i] || '';
    let lineText = `<div style="margin-bottom: 10px;"><strong>Line ${i + 1}:</strong> `;

    if (orig === usr) {
      lineText += `<div style="background-color:#e7fbe7; padding: 6px; border-radius: 5px;">✔️ ${escapeHtml(usr)}</div>`;
    } else {
      lineText += `<div style="background-color:#ffe6e6; padding: 6px; border-radius: 5px;">
        ❌ <b>Expected:</b> ${escapeHtml(orig)}<br>
        <b>Got:</b> ${escapeHtml(usr)}
      </div>`;
    }

    lineText += `</div>`;
    html += lineText;
  }

  result.innerHTML = html;
  result.style.display = 'block';

  try {
    const response = await fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original, user })
    });

    const data = await response.json();
    console.log(data);
    alert(data.message || "Saved successfully.");
  } catch (err) {
    console.error("Failed to save to backend", err);
    alert("❌ Failed to save comparison to backend.");
  }
}

function viewHistory() {
  fetch('http://localhost:3000/history')
    .then(res => res.json())
    .then(history => {
      const result = document.getElementById('result');
      result.innerHTML = '<h3>📜 Comparison History (Backend)</h3>';
      history.forEach(entry => {
        result.innerHTML += `
          <strong>${new Date(entry.createdAt).toLocaleString()}</strong><br>
          <code>Original:</code><br><pre>${escapeHtml(entry.original)}</pre>
          <code>User:</code><br><pre>${escapeHtml(entry.user)}</pre><hr>
        `;
      });
      result.style.display = 'block';
    })
    .catch(err => {
      console.error("Error loading history:", err);
      alert("❌ Failed to fetch history.");
    });
}

function clearHistory() {
  fetch('http://localhost:3000/clear', { method: 'DELETE' })
    .then(() => {
      const result = document.getElementById('result');
      result.innerHTML = '🗑️ History cleared successfully!';
      result.style.display = 'block';
      result.style.backgroundColor = '#fff3cd';
      result.style.borderLeft = '4px solid orange';
    })
    .catch(err => {
      console.error("Error clearing history:", err);
      alert("❌ Failed to clear history.");
    });
}
