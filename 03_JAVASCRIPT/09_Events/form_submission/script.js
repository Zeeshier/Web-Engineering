document.getElementById("myForm").addEventListener("submit", function(e) {
e.preventDefault();
  const name = document.getElementById("name").value;
  document.getElementById("output").textContent = `Hello, ${name}!`;
});