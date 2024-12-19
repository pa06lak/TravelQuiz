// Function to fetch and display data based on the image clicked
function fetchData(answer) {
  fetch('/api/quiz-data') // Fetch data from the server
    .then(response => response.json())
    .then(data => {
      console.log('Random Data:', data);  // Log the data to the console for now
      // You can display this data on the page or do whatever you want with it
      displayRandomData(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Add event listeners to all images with the class 'option-img'
const images = document.querySelectorAll('.option-img');
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

// Handle form submission
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

// Function to fetch destinations by IDs
function fetchDestinationsByIds(ids) {
  fetch(`http://localhost:3000/api/destinations?ids=${ids.join(',')}`)
    .then(response => response.json())
    .then(data => {
      displayDestinations(data); // Function to display the fetched data
    })
    .catch(error => {
      console.error('Error fetching destination data:', error);
    });
}

// Function to display the fetched destination data
function displayDestinations(data) {
  const resultDiv = document.getElementById('result');  // Ensure this is targeting the correct div

  // Clear previous results
  resultDiv.innerHTML = '';

  // Loop through the data and create elements to display it
  data.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('result-item');
    
    itemDiv.innerHTML = `
      <h4>${item.name}</h4>
      <img src="${item.image}" alt="${item.name}" style="width: 100px;">
      <p>${item.description}</p>
    `;
    
    resultDiv.appendChild(itemDiv);  // Append each item to the result div
  });
}

// Event listeners for image clicks (send specific IDs for each plan)
const planeImage = document.getElementById('plane');  // Image for Plane
const trainImage = document.getElementById('train');  // Image for Train

// Add event listeners to images
planeImage.addEventListener('click', () => fetchDestinationsByIds([1, 2, 3]));  // Fetch destinations 1, 2, 3 for Plane
trainImage.addEventListener('click', () => fetchDestinationsByIds([3, 4, 5]));  // Fetch destinations 3, 4, 5 for Train
