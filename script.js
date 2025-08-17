// let originalEditor, userEditor;

// window.onload = () => {
//   // Initialize editors in Python mode by default
//   if (document.getElementById("originalCode")) {
//     originalEditor = CodeMirror.fromTextArea(document.getElementById("originalCode"), {
//       lineNumbers: true,
//       mode: "python"
//     });
//   }

//   if (document.getElementById("userCode")) {
//     userEditor = CodeMirror.fromTextArea(document.getElementById("userCode"), {
//       lineNumbers: true,
//       mode: "python"
//     });
//   }

//   // Only load history if we are on the history page
//   if (document.getElementById("history-container")) {
//     loadHistoryFromSession();
//   }
// };

// function changeLanguage() {
//   const lang = document.getElementById('languageSelector').value;
//   if (originalEditor) originalEditor.setOption("mode", lang);
//   if (userEditor) userEditor.setOption("mode", lang);
// }

// function escapeHtml(text) {
//   return text.replace(/[&<>"']/g, match => {
//     const escapeMap = {
//       '&': '&amp;',
//       '<': '&lt;',
//       '>': '&gt;',
//       '"': '&quot;',
//       "'": '&#039;'
//     };
//     return escapeMap[match];
//   });
// }

// async function compareCode() {
//   const original = originalEditor.getValue();
//   const user = userEditor.getValue();
//   const result = document.getElementById('result');

//   const originalLines = original.split('\n');
//   const userLines = user.split('\n');
//   const maxLines = Math.max(originalLines.length, userLines.length);

//   let html = `<strong>🔍 Line-by-Line Comparison:</strong><br>`;

//   for (let i = 0; i < maxLines; i++) {
//     const orig = originalLines[i] || '';
//     const usr = userLines[i] || '';
//     let lineText = `<div style="margin-bottom: 10px;"><strong>Line ${i + 1}:</strong> `;

//     if (orig === usr) {
//       lineText += `<div style="background-color:#e7fbe7; padding: 6px; border-radius: 5px;">✔️ ${escapeHtml(usr)}</div>`;
//     } else {
//       lineText += `<div style="background-color:#ffe6e6; padding: 6px; border-radius: 5px;">
//         ❌ <b>Expected:</b> ${escapeHtml(orig)}<br>
//         <b>Got:</b> ${escapeHtml(usr)}
//       </div>`;
//     }

//     lineText += `</div>`;
//     html += lineText;
//   }

//   result.innerHTML = html;
//   result.style.display = 'block';

//   // Save to backend silently
//   try {
//     const response = await fetch('http://localhost:3000/save', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ original, user })
//     });

//     const data = await response.json();
//     console.log("Save response:", data);
//     // Removed alert
//   } catch (err) {
//     console.error("Failed to save to backend", err);
//     // Removed alert
//   }

//   // Save to sessionStorage so it’s kept until tab is closed
//   saveHistoryToSession(original, user);
// }

// function saveHistoryToSession(original, user) {
//   let history = JSON.parse(sessionStorage.getItem("history")) || [];
//   history.push({
//     original,
//     user,
//     createdAt: new Date().toISOString()
//   });
//   sessionStorage.setItem("history", JSON.stringify(history));
// }

// function loadHistoryFromSession() {
//   let history = JSON.parse(sessionStorage.getItem("history")) || [];
//   if (history.length > 0) {
//     const result = document.getElementById('result');
//     result.innerHTML = '<h3>📜 Comparison History (This Session)</h3>';
//     history.forEach(entry => {
//       result.innerHTML += `
//         <strong>${new Date(entry.createdAt).toLocaleString()}</strong><br>
//         <code>Original:</code><br><pre>${escapeHtml(entry.original)}</pre>
//         <code>User:</code><br><pre>${escapeHtml(entry.user)}</pre><hr>
//       `;
//     });
//     result.style.display = 'block';
//   }
// }

// function viewHistory() {
//   loadHistoryFromSession();
// }

// function clearHistory() {
//   sessionStorage.removeItem("history");
//   const result = document.getElementById('result');
//   result.innerHTML = '🗑️ History cleared successfully!';
//   result.style.display = 'block';
//   result.style.backgroundColor = '#fff3cd';
//   result.style.borderLeft = '4px solid orange';
// }

// // Toggle dark mode (persistent using localStorage)
// document.getElementById("darkModeToggle").addEventListener("click", function () {
//   document.body.classList.toggle("dark-mode");

//   // Save state to localStorage
//   if (document.body.classList.contains("dark-mode")) {
//     localStorage.setItem("theme", "dark");
//   } else {
//     localStorage.setItem("theme", "light");
//   }

//   // Toggle CodeMirror theme
//   const editors = document.querySelectorAll(".CodeMirror");
//   editors.forEach(editor => {
//     const cm = editor.CodeMirror;
//     if (cm) {
//       cm.setOption("theme", document.body.classList.contains("dark-mode") ? "darcula" : "default");
//     }
//   });
// });

// // On page load, restore theme
// window.addEventListener("DOMContentLoaded", () => {
//   const theme = localStorage.getItem("theme");
//   if (theme === "dark") {
//     document.body.classList.add("dark-mode");

//     const editors = document.querySelectorAll(".CodeMirror");
//     editors.forEach(editor => {
//       const cm = editor.CodeMirror;
//       if (cm) cm.setOption("theme", "darcula");
//     });
//   }
// });

//Creates two variables to store the CodeMirror editors for the original code and user code.
//We need to keep references to these editors so we can get their content and change settings later.
let originalEditor, userEditor;


//Preprocessing code before comparison
//Cleans the code for comparison by removing comments, extra spaces, and blank lines.
//So that small formatting differences don’t affect the comparison.
function preprocessCodeForCompare(code) {
  return code
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove single-line comments
    .replace(/#.*$/gm, "")  // Python-style comments
    .replace(/\/\/.*$/gm, "") // JS/Java-style comments
    // Trim spaces at start/end of lines
    .split("\n")
    .map(line => line.trim())
    // Remove blank lines
    .filter(line => line.length > 0)
    // Normalize spaces within the line
    .map(line => line.replace(/\s+/g, " "))
    .join("\n");
}

//Initialize editors and history on page load
//Finds the text areas in the page for original and user code.
// Converts them into CodeMirror editors with line numbers and Python syntax highlighting.
// Loads previous comparison history if available.
//It provides syntax highlighting, line numbers, and easier code editing compared to a plain <textarea>.

window.onload = () => {
  if (document.getElementById("originalCode")) {
    originalEditor = CodeMirror.fromTextArea(document.getElementById("originalCode"), {
      lineNumbers: true,
      mode: "python"
    });
  }

  if (document.getElementById("userCode")) {
    userEditor = CodeMirror.fromTextArea(document.getElementById("userCode"), {
      lineNumbers: true,
      mode: "python"
    });
  }

  if (document.getElementById("history-container")) {
    loadHistoryFromSession();
  }
};

function changeLanguage() {
  const lang = document.getElementById('languageSelector').value;
  if (originalEditor) originalEditor.setOption("mode", lang);
  if (userEditor) userEditor.setOption("mode", lang);
}


//Converts <, >, &, ", ' into safe HTML so they don’t break the page.
// Why: Without this, code like <div> would be rendered as HTML instead of showing as code.
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


//Compare the code
//Gets code from both editors.
// Cleans the code using preprocessCodeForCompare.
// Compares line by line.
// Shows green for correct lines and red for differences, with "Expected" vs "Got".
// Saves the comparison to session storage.
async function compareCode() {
  const originalRaw = originalEditor.getValue();
  const userRaw = userEditor.getValue();

  // Preprocess for comparison (ignore comments/whitespace/blank lines)
  const original = preprocessCodeForCompare(originalRaw);
  const user = preprocessCodeForCompare(userRaw);

  const result = document.getElementById('result');

  const originalLines = original.split('\n');
  const userLines = user.split('\n');
  const maxLines = Math.max(originalLines.length, userLines.length);

  let html = `<strong>🔍 Line-by-Line Comparison :</strong><br>`;

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

  // Save to sessionStorage (keep original raw code for display in history)
  saveHistoryToSession(originalRaw, userRaw);
}

function saveHistoryToSession(original, user) {
  let history = JSON.parse(sessionStorage.getItem("history")) || [];
  history.push({
    original,
    user,
    createdAt: new Date().toISOString()
  });
  sessionStorage.setItem("history", JSON.stringify(history));
}

//Session storage functions
// Saves each comparison in the browser session.
// Loads all previous comparisons.
// Clears history when requested.
// Why sessionStorage: Keeps data for the current session without using a backend database. Safer for temporary storage.

function loadHistoryFromSession() {
  let history = JSON.parse(sessionStorage.getItem("history")) || [];
  if (history.length > 0) {
    const result = document.getElementById('result');
    result.innerHTML = '<h3>📜 Comparison History (This Session)</h3>';
    history.forEach(entry => {
      result.innerHTML += `
        <strong>${new Date(entry.createdAt).toLocaleString()}</strong><br>
        <code>Original:</code><br><pre>${escapeHtml(entry.original)}</pre>
        <code>User:</code><br><pre>${escapeHtml(entry.user)}</pre><hr>
      `;
    });
    result.style.display = 'block';
  }
}

function viewHistory() {
  loadHistoryFromSession();
}

function clearHistory() {
  sessionStorage.removeItem("history");
  const result = document.getElementById('result');
  result.innerHTML = '🗑️ History cleared successfully!';
  result.style.display = 'block';
  result.style.backgroundColor = '#fff3cd';
  result.style.borderLeft = '4px solid orange';
}


// Toggles dark mode for the page and CodeMirror editors.
// Saves the preference in localStorage to remember it.

document.getElementById("darkModeToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  const editors = document.querySelectorAll(".CodeMirror");
  editors.forEach(editor => {
    const cm = editor.CodeMirror;
    if (cm) {
      cm.setOption("theme", document.body.classList.contains("dark-mode") ? "darcula" : "default");
    }
  });
});

// On page load, applies the saved dark mode preference.
// So the user doesn’t have to switch to dark mode every time.

window.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");

    const editors = document.querySelectorAll(".CodeMirror");
    editors.forEach(editor => {
      const cm = editor.CodeMirror;
      if (cm) cm.setOption("theme", "darcula");
    });
  }
});
