document.addEventListener("keydown", function(event) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += `<p>Key pressed: ${event.key}</p>`;
});