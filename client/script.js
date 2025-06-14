let originalEditor, userEditor;

window.onload = () => {
  originalEditor = CodeMirror.fromTextArea(document.getElementById("originalCode"), {
    lineNumbers: true,
    mode: "javascript",
    theme: "default"
  });

  userEditor = CodeMirror.fromTextArea(document.getElementById("userCode"), {
    lineNumbers: true,
    mode: "javascript",
    theme: "default"
  });
};

function compareCode() {
  const original = originalEditor.getValue();
  const user = userEditor.getValue();
  const result = document.getElementById('result');

  const diff = Diff.diffLines(original, user);

  result.innerHTML = '';
  diff.forEach(part => {
    const span = document.createElement('pre');
    span.textContent = part.value;

    if (part.added) {
      span.style.backgroundColor = '#d4edda'; // green
    } else if (part.removed) {
      span.style.backgroundColor = '#f8d7da'; // red
    } else {
      span.style.backgroundColor = '#ffffff'; // unchanged
    }

    result.appendChild(span);
  });

  result.style.display = 'block';

  // Save to localStorage
  const history = JSON.parse(localStorage.getItem('comparisonHistory')) || [];
  history.push({
    timestamp: new Date().toLocaleString(),
    original,
    user
  });
  localStorage.setItem('comparisonHistory', JSON.stringify(history));
}

function viewHistory() {
  const history = JSON.parse(localStorage.getItem('comparisonHistory')) || [];
  const result = document.getElementById('result');
  result.innerHTML = '<h3>Comparison History (Last 5)</h3>';

  history.slice(-5).reverse().forEach(entry => {
    const block = document.createElement('div');
    block.style.marginBottom = '10px';
    block.innerHTML = `
      <strong>${entry.timestamp}</strong><br>
      <code>Original:</code><br><pre>${entry.original}</pre>
      <code>User:</code><br><pre>${entry.user}</pre>
      <hr>
    `;
    result.appendChild(block);
  });

  result.style.display = 'block';
}
