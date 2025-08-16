// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("history-container");

//   fetch("http://localhost:3000/load-history")
//     .then(res => res.json())
//     .then(data => {
//       data.forEach(item => {
//         const div = document.createElement("div");
//         div.classList.add("history-item");
//         div.innerHTML = `
//           <input type="checkbox" class="select-item" data-id="${item._id}">
//           <pre><strong>Code 1:</strong>\n${item.code1}</pre>
//           <pre><strong>Code 2:</strong>\n${item.code2}</pre>
//           <hr>
//         `;
//         container.appendChild(div);
//       });
//     });

//   // Delete selected
//   document.getElementById("delete-selected").addEventListener("click", () => {
//     const selected = document.querySelectorAll(".select-item:checked");
//     selected.forEach(checkbox => {
//       const id = checkbox.getAttribute("data-id");
//       fetch(`http://localhost:3000/delete-history/${id}`, {
//         method: "DELETE"
//       }).then(() => checkbox.parentElement.remove());
//     });
//   });

//   // Delete all
//   document.getElementById("delete-all").addEventListener("click", () => {
//     fetch("http://localhost:3000/delete-history", {
//       method: "DELETE"
//     }).then(() => {
//       container.innerHTML = "";
//     });
//   });
// });


// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("history-container");

//   // Load history from sessionStorage instead of server
//   let history = JSON.parse(sessionStorage.getItem("history")) || [];

//   if (history.length === 0) {
//     container.innerHTML = "<p>No history found in this session.</p>";
//     return;
//   }

//   history.forEach((item, index) => {
//     const div = document.createElement("div");
//     div.classList.add("history-item");
//     div.innerHTML = `
//       <input type="checkbox" class="select-item" data-index="${index}">
//       <pre><strong>Code 1:</strong>\n${item.original}</pre>
//       <pre><strong>Code 2:</strong>\n${item.user}</pre>
//       <small>${new Date(item.createdAt).toLocaleString()}</small>
//       <hr>
//     `;
//     container.appendChild(div);
//   });

//   // Delete selected
//   document.getElementById("delete-selected").addEventListener("click", () => {
//     const selected = document.querySelectorAll(".select-item:checked");
//     let history = JSON.parse(sessionStorage.getItem("history")) || [];

//     // Remove from array (reverse order to avoid index shifting)
//     Array.from(selected).reverse().forEach(checkbox => {
//       const idx = parseInt(checkbox.getAttribute("data-index"));
//       history.splice(idx, 1);
//     });

//     sessionStorage.setItem("history", JSON.stringify(history));
//     location.reload();
//   });

//   // Delete all
//   document.getElementById("delete-all").addEventListener("click", () => {
//     sessionStorage.removeItem("history");
//     container.innerHTML = "<p>History cleared.</p>";
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("history-container");

  // Load history from sessionStorage
  let history = JSON.parse(sessionStorage.getItem("history")) || [];

  if (history.length === 0) {
    container.innerHTML = "<p>No history found in this session.</p>";
    return;
  }

  history.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("history-item");

// Diff function (ignoring whitespace/comments/newlines)
function diffStrings(code1, code2) {
  const normalize = str =>
    str
      .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "") // remove comments
      .replace(/[ \t]+/g, " ") // collapse multiple spaces
      .replace(/\r?\n\s*\r?\n/g, "\n") // remove blank lines
      .trim();

  const c1 = normalize(code1).split("\n");
  const c2 = normalize(code2).split("\n");

  let result1 = "";
  let result2 = "";

  const maxLen = Math.max(c1.length, c2.length);

  for (let i = 0; i < maxLen; i++) {
    if (c1[i] === c2[i]) {
      result1 += `<div>${c1[i] || ""}</div>`;
      result2 += `<div>${c2[i] || ""}</div>`;
    } else {
      result1 += `<div class="diff-removed">${c1[i] || ""}</div>`;
      result2 += `<div class="diff-added">${c2[i] || ""}</div>`;
    }
  }

  return [result1, result2];
}


    const [highlighted1, highlighted2] = diffStrings(item.original, item.user);

    div.innerHTML = `
      <input type="checkbox" class="select-item" data-index="${index}">
      <div class="history-diff">
        <div class="history-code">
          <strong>Code 1:</strong>
          <pre>${highlighted1}</pre>
        </div>
        <div class="history-code">
          <strong>Code 2:</strong>
          <pre>${highlighted2}</pre>
        </div>
      </div>
      <small>${new Date(item.createdAt).toLocaleString()}</small>
      <hr>
    `;
    container.appendChild(div);
  });

  // Delete selected
  document.getElementById("delete-selected").addEventListener("click", () => {
    const selected = document.querySelectorAll(".select-item:checked");
    let history = JSON.parse(sessionStorage.getItem("history")) || [];

    Array.from(selected).reverse().forEach(checkbox => {
      const idx = parseInt(checkbox.getAttribute("data-index"));
      history.splice(idx, 1);
    });

    sessionStorage.setItem("history", JSON.stringify(history));
    location.reload();
  });

  // Delete all
  document.getElementById("delete-all").addEventListener("click", () => {
    sessionStorage.removeItem("history");
    container.innerHTML = "<p>History cleared.</p>";
  });
});
