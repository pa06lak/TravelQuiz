
const images = document.querySelectorAll('.option-img');
images.forEach(image => {
  image.addEventListener('click', () => {
    const selectedAnswer = image.getAttribute('data-answer');
    
    image.closest('.question').querySelectorAll('.form-check-inline').forEach(option => {
      option.classList.remove('selected');
    });

    image.closest('.form-check-inline').classList.add('selected');

    console.log(`Selected Answer: ${selectedAnswer}`);
  });
});

document.getElementById('quizForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const results = {};
  formData.forEach((value, key) => {
    results[key] = value;
  });
  console.log('Quiz Results:', results);
  alert("Quiz Submitted! Check the console for results.");
});