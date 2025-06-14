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
};

function changeLanguage() {
  const lang = document.getElementById('languageSelector').value;
  originalEditor.setOption("mode", lang);
  userEditor.setOption("mode", lang);
}

function compareCode() {
  const original = originalEditor.getValue();
  const user = userEditor.getValue();
  const result = document.getElementById('result');

  const originalLines = original.split('\n');
  const userLines = user.split('\n');
  const maxLines = Math.max(originalLines.length, userLines.length);

  let html = `<strong>Line-by-Line Comparison:</strong><br>`;

  for (let i = 0; i < maxLines; i++) {
    const orig = originalLines[i] || '';
    const usr = userLines[i] || '';
    let lineText = `Line ${i + 1}: `;

    if (orig === usr) {
      lineText += `<span style="background-color:#e2f0cb;">✔️ ${usr}</span>`;
    } else {
      lineText += `<span style="background-color:#f8d7da;">❌<br>Expected: ${orig}<br>Got: ${usr}</span>`;
    }

    html += `<pre>${lineText}</pre>`;
  }

  result.innerHTML = html;
  result.style.display = 'block';

  fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original, user })
  });
}

function viewHistory() {
  fetch('http://localhost:3000/history')
    .then(res => res.json())
    .then(history => {
      const result = document.getElementById('result');
      result.innerHTML = '<h3>Comparison History (Backend)</h3>';
      history.forEach(entry => {
        result.innerHTML += `
          <strong>${new Date(entry.createdAt).toLocaleString()}</strong><br>
          <code>Original:</code><br><pre>${entry.original}</pre>
          <code>User:</code><br><pre>${entry.user}</pre><hr>
        `;
      });
      result.style.display = 'block';
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
    });
}
