function compareCode() {
  const original = document.getElementById('originalCode').value.trim();
  const user = document.getElementById('userCode').value.trim();
  const result = document.getElementById('result');

  if (original === user) {
    result.innerText = "✅ The code matches!";
    result.style.display = 'block';
    result.style.borderLeft = '4px solid green';
    result.style.backgroundColor = '#d4edda';
  } else {
    result.innerText = "❌ The code does not match. Differences may exist.";
    result.style.display = 'block';
    result.style.borderLeft = '4px solid red';
    result.style.backgroundColor = '#f8d7da';
  }
}
