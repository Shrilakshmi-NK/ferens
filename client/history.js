document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("history-container");

  fetch("http://localhost:3000/load-history")
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("history-item");
        div.innerHTML = `
          <input type="checkbox" class="select-item" data-id="${item._id}">
          <pre><strong>Code 1:</strong>\n${item.code1}</pre>
          <pre><strong>Code 2:</strong>\n${item.code2}</pre>
          <hr>
        `;
        container.appendChild(div);
      });
    });

  // Delete selected
  document.getElementById("delete-selected").addEventListener("click", () => {
    const selected = document.querySelectorAll(".select-item:checked");
    selected.forEach(checkbox => {
      const id = checkbox.getAttribute("data-id");
      fetch(`http://localhost:3000/delete-history/${id}`, {
        method: "DELETE"
      }).then(() => checkbox.parentElement.remove());
    });
  });

  // Delete all
  document.getElementById("delete-all").addEventListener("click", () => {
    fetch("http://localhost:3000/delete-history", {
      method: "DELETE"
    }).then(() => {
      container.innerHTML = "";
    });
  });
});
