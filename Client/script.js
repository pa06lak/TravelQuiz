document.addEventListener("DOMContentLoaded", () => {
  // Select all option images
  const optionImages = document.querySelectorAll(".option-img");

  // Add click event listeners to each image
  optionImages.forEach((image) => {
    image.addEventListener("click", (event) => {
      const clickedImage = event.target;

      // Get the parent question container
      const questionContainer = clickedImage.closest(".question");

      // Deselect any previously selected image in this question
      const selectedImages = questionContainer.querySelectorAll(".selected");
      selectedImages.forEach((selected) => {
        selected.classList.remove("selected");
      });

      // Select the clicked image
      clickedImage.classList.add("selected");
    });
  });

  // Form submission handler
  const form = document.getElementById("quizForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    const name = document.getElementById("name").value;
    const questions = document.querySelectorAll(".question");

    // Collect the user's answers
    const answers = [];
    questions.forEach((question) => {
      const selected = question.querySelector(".selected");
      if (selected) {
        answers.push(selected.dataset.answer); // Use the data-answer attribute for the answer
      }
    });

    if (answers.length < questions.length) {
      alert("Please answer all the questions!");
      return;
    }

    // Display the result (or send to the backend via AJAX)
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<h3>Thank you, ${name}!</h3>
                           <p>Your answers: ${answers.join(", ")}</p>`;
  });
});

// Function to fetch destinations by IDs
document.querySelectorAll('.option-img').forEach(image => {
  image.addEventListener('click', () => {
    // Ensure you're not calling blur() here, which would remove focus
  });
});

// Keep track of selected destination IDs globally
let selectedDestinations = [];

function fetchDestinationsByIds(ids) {
  console.log(selectedDestinations)
  // Filter out already selected destinations from the IDs
  const newIds = ids.filter(id => !selectedDestinations.includes(id));

  if (newIds.length === 0) {
    //console.log('All destinations have already been selected.');
    return; // Exit early if no new destinations to fetch
  }

  fetch(`http://localhost:3000/api/destinations?ids=${newIds.join(',')}`)
    .then(response => response.json())
    .then(data => {
      // Update the selectedDestinations list with the newly fetched destinations
      const newDestinations = data.map(destination => destination.id);
      selectedDestinations = [...selectedDestinations, ...newDestinations];

      displayDestinations(data); // Function to display the fetched data
    })
    .catch(error => {
      console.error('Error fetching destination data:', error);
    });
}


function displayDestinations(data) {
  const resultDiv = document.getElementById('result');

  // Clear previous results
  resultDiv.innerHTML = '';

  // Loop through the data and create elements to display it
  data.forEach(item => {
    // Create a container for each destination
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('destination-box');

    // Image element
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.classList.add('destination-image');

    // Details container
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('destination-details');

    // Name element
    const name = document.createElement('h3');
    name.textContent = item.name;
    name.classList.add('destination-name');

    // Description element
    const description = document.createElement('p');
    description.textContent = item.description;
    description.classList.add('destination-description');

    // Rating element (if applicable)
    const rating = document.createElement('span');
    rating.textContent = `Rating: ${item.rating}`;
    rating.classList.add('destination-rating');

    // Append name, description, and rating to the details container
    detailsDiv.appendChild(name);
    detailsDiv.appendChild(description);
    detailsDiv.appendChild(rating);

    // Append image and details to the item container
    itemDiv.appendChild(img);
    itemDiv.appendChild(detailsDiv);

    // Append the item container to the results div
    resultDiv.appendChild(itemDiv);
  });
}

// Event listeners for image clicks
const planeImage = document.getElementById('plane');  
const trainImage = document.getElementById('train');  
const friendsImage = document.getElementById('friends');  
const familyImage = document.getElementById('family');  
const dolphinImage = document.getElementById('dolphins');  
const bungeeImage = document.getElementById('bungee');  
const cityImage = document.getElementById('city');
const countrysideImage = document.getElementById('countryside');  
const cookImage = document.getElementById('cook');  
const eatImage = document.getElementById('eatout');  
const photographerImage = document.getElementById('photographer');
const chefImage = document.getElementById('chef');  
const ancientImage = document.getElementById('ancient');
const modernImage = document.getElementById('modern');
const poolImage = document.getElementById('pool');
const beachImage = document.getElementById('beach');
const nightImage = document.getElementById('night');
const dayImage = document.getElementById('day');  
const tropicalImage = document.getElementById('tropical');
const snowyImage = document.getElementById('snowy');  

// Add event listeners to images
planeImage.addEventListener('click', () => fetchDestinationsByIds([8,11,16]));
trainImage.addEventListener('click', () => fetchDestinationsByIds([1,18,44,37]));
friendsImage.addEventListener('click', () => fetchDestinationsByIds([10,23,29,36]));
familyImage.addEventListener('click', () => fetchDestinationsByIds([21,35,45,49]));
dolphinImage.addEventListener('click', () => fetchDestinationsByIds([14,8,7,9]));
bungeeImage.addEventListener('click', () => fetchDestinationsByIds([6,34]));
cityImage.addEventListener('click', () => fetchDestinationsByIds([2,5,4,22,27]));
countrysideImage.addEventListener('click', () => fetchDestinationsByIds([3,40,45]));
cookImage.addEventListener('click', () => fetchDestinationsByIds([15,39,45]));
eatImage.addEventListener('click', () => fetchDestinationsByIds([5,9,10]));
photographerImage.addEventListener('click', () => fetchDestinationsByIds([13,19,26,41]));
chefImage.addEventListener('click', () => fetchDestinationsByIds([12,14,28]));
ancientImage.addEventListener('click', () => fetchDestinationsByIds([12,17,24,38,46,47]));
modernImage.addEventListener('click', () => fetchDestinationsByIds([20,22,30,32,34]));
poolImage.addEventListener('click', () => fetchDestinationsByIds([15,29]));
beachImage.addEventListener('click', () => fetchDestinationsByIds([15,16,25,26]));
nightImage.addEventListener('click', () => fetchDestinationsByIds([22,25,27,48]));
dayImage.addEventListener('click', () => fetchDestinationsByIds([31,33,42,50]));
tropicalImage.addEventListener('click', () => fetchDestinationsByIds([7,10,15]));
snowyImage.addEventListener('click', () => fetchDestinationsByIds([24,34,41,43]));
