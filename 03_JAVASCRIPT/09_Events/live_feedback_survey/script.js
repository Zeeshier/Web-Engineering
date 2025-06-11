const form = document.getElementById("survey-form");
const rating = document.getElementById("rating");
const feedback = document.getElementById("feedback");
const response = document.getElementById("response");
const resetBtn = document.getElementById("reset-btn");
const charCount = document.getElementById("char-count");

// Mouseover: highlight labels
document.getElementById("rating-label").addEventListener("mouseover", () => {
  document.getElementById("rating-label").classList.add("highlight");
});

document.getElementById("feedback-label").addEventListener("mouseover", () => {
  document.getElementById("feedback-label").classList.add("highlight");
});

// Keydown: character count update
feedback.addEventListener("keydown", () => {
  charCount.textContent = `Characters: ${feedback.value.length + 1}`;
});

// Change: live rating update
rating.addEventListener("change", () => {
  response.textContent = `You rated us: ${rating.value}/5`;
});

// Submit: prevent reload + show result
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userFeedback = feedback.value.trim();

  if (userFeedback) {
    response.innerHTML = `<strong>Thanks for your feedback!</strong><br>Your rating: ${rating.value}/5<br>Message: ${userFeedback}`;
  } else {
    response.textContent = "⚠️ Please write some feedback before submitting.";
  }
});

// Click: reset form
resetBtn.addEventListener("click", () => {
  form.reset();
  response.textContent = "";
  charCount.textContent = "Characters: 0";
});
