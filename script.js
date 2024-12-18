// Handle Image Click for Answer Selection
const images = document.querySelectorAll('.option-img');
images.forEach(image => {
  image.addEventListener('click', () => {
    const selectedAnswer = image.getAttribute('data-answer');
    image.closest('.question').querySelectorAll('.form-check-inline').forEach(option => {
      option.classList.remove('selected');
    });
    image.closest('.form-check-inline').classList.add('selected');
  });
});

// Handle Form Submission
document.getElementById('quizForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Collect form data
  const formData = new FormData(e.target);
  const results = {};
  formData.forEach((value, key) => {
    results[key] = value;
  });
  
  // Log results to console (can be replaced with actual processing logic)
  console.log('Quiz Results:', results);

  // Display result (or redirect, or show message)
  alert("Quiz Submitted! Check the console for results.");
});
