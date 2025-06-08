let count = 0;
document.getElementById("clickBtn").addEventListener("click", function() {
  count++;
  document.getElementById("counter").textContent = count;
});