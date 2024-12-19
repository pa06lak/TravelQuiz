// Select all images with the class 'option-img'
const images = document.querySelectorAll('.option-img');

// Function to fetch and display data based on the image clicked
function fetchData(answer) {
  fetch('/api/quiz-data') // Fetch data from the server
    .then(response => response.json())
    .then(data => {
      // Find the data that matches the clicked answer (using name)
      const selectedData = data.find(item => item.name === answer);
      console.log(selectedData)
      if (selectedData) {
        // Display the description and image of the selected destination
        alert(`You selected: ${selectedData.name}\nDescription: ${selectedData.description}`);

        // Optionally, display more details dynamically on the page (e.g., in a modal or section)
        const detailsDiv = document.createElement('div');
        detailsDiv.innerHTML = `
          <h3>${selectedData.name}</h3>
          <p>${selectedData.description}</p>
          <img src="${selectedData.image}" alt="${selectedData.name}" class="img-fluid" />
        `;
        document.body.appendChild(detailsDiv); // Append to the body or a designated container
      } else {
        console.log('No data found for this destination');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Add event listeners to all the images
images.forEach(image => {
  image.addEventListener('click', () => {
    const selectedAnswer = image.getAttribute('data-answer');
   
    // Fetch data based on the selected answer
    fetchData(selectedAnswer);

    // Optional: Update the UI to show that the option was selected
    image.closest('.question').querySelectorAll('.form-check-inline').forEach(option => {
      option.classList.remove('selected');
    });
    image.closest('.form-check-inline').classList.add('selected');
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
