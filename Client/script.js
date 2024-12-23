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

    // Assuming you have selectedDestinations array populated with the necessary destination data
    console.log(selectedDestinations);

    // Assuming selectedDestinations is an array of IDs like [1, 2]
// Fetch the destinations data from the JSON file
  for (let destinationId of selectedDestinations) {
    fetch(`http://localhost:3000/api/destinations?ids=${destinationId}`)
     .then(response => response.json())
     .then(data => {
        console.log(data)
        displayDestinations(data); // Function to display the fetched data
      })
     .catch(error => console.error('Error:', error));
  }

  

  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to the "Apply Filters" button
  document.getElementById("apply-filters").addEventListener("click", () => {
    // Collect filter values from the DOM
    const filters = {
      continent: document.getElementById("continent").value,
      budget: document.getElementById("budget").value,
      duration: document.getElementById("duration").value,
      popularity: document.getElementById("popularity").value,
    };
    const resultDiv = document.getElementById('resultDiv'); // Fetch the existing div
    // Clear the body content before displaying filtered results

    // Pass filters to the filtering function
    applyFilters(filters, resultDiv);
  });

  // Function to apply filters
  async function applyFilters(filters, resultDiv) {
    console.log("Filters applied:", filters);

    isFiltered = false;


    // Check if filters are empty or null
    const noFiltersSelected = !filters.continent && !filters.budget && !filters.duration && !filters.popularity;
    if (noFiltersSelected) {
      alert("Please select at least one filter.");
      return; // Exit if no filters are selected
    }

    console.log("Selected Destinations:", selectedDestinations);
     // Clear the resultDiv to remove previous destinations
  resultDiv.innerHTML = '';

    // Shortlist destinations based on filters
    var filteredDestinations = await shortlistDestinations(selectedDestinations, filters);
    console.log("Filtered Destinations:", filteredDestinations);
    // Display the filtered destinations
    displayDestinationsInteractive(filteredDestinations, resultDiv);
    // Remove the search bar from the DOM
    const searchBar = document.getElementById('searchBar'); // Assuming the search bar has an ID 'searchBar'
    if (searchBar) {
    searchBar.style.display = 'none'; // Hide the search bar
  }
  }

  async function shortlistDestinations(destinations, filters) {
    const { continent, budget, duration, popularity } = filters;

    const ids = destinations.join(',');
    const response = await fetch(`http://localhost:3000/api/destinations?ids=${ids}`);
    const data = await response.json();

    // Filter destinations and keep the full object for matched items
    const filteredDestinations = data.filter(destination => {
      if (continent && destination.continent !== continent) {
        return false; 
      }
      if (budget && destination.budget < budget) {
        return false; 
      }
      if (duration && destination.duration < duration) {
        return false; 
      }
      if (popularity && destination.popularity < popularity) {
        return false; 
      }
      return true; 
    });

    return filteredDestinations; // Return the filtered destinations
  }

  function displayDestinationsInteractive(data, resultDiv) {
    console.log(data, "filtered destination 2");

    if (!resultDiv) {
      console.error('Result container (resultDiv) not found in the DOM.');
      return;
    }
    resultDiv.innerHTML = ''; // Clear the existing content

    data.forEach(item => {
      if (!item.name || !item.image || !item.description) {
        console.warn('Invalid destination data:', item);
        return;
      }
      console.log("This has gotten to this point")
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('destination-box');

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.classList.add('destination-image');

      const detailsDiv = document.createElement('div');
      detailsDiv.classList.add('destination-details');

      const name = document.createElement('h3');
      name.textContent = item.name;
      name.classList.add('destination-name');

      const description = document.createElement('p');
      description.textContent = item.description;
      description.classList.add('destination-description');

      const rating = document.createElement('span');
      rating.textContent = `Rating: ${item.rating}`;
      rating.classList.add('destination-rating');

      detailsDiv.appendChild(name);
      detailsDiv.appendChild(description);
      detailsDiv.appendChild(rating);

      itemDiv.appendChild(img);
      itemDiv.appendChild(detailsDiv);
      // Add click event listener for interaction
      itemDiv.addEventListener('click', () => {
        handleDestinationClick(item, rating);
    });

      resultDiv.appendChild(itemDiv);
    });
  }
  
  // Function to handle destination interaction
function handleDestinationClick(destination, ratingElement) {
  const visited = confirm(`Have you been to ${destination.name}?`);

  if (visited) {
      const userRating = prompt(`Please rate ${destination.name} (1-5):`);
      const ratingValue = parseInt(userRating);

      if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
          // Update the destination's rating
          destination.rating = ratingValue;

          // Update the rating displayed on the page
          ratingElement.textContent = `Rating: ${destination.rating}`;

          alert(`Thank you for rating ${destination.name} with a ${ratingValue}!`);
      } else {
          alert('Invalid rating. Please enter a number between 1 and 5.');
      }
  } else {
      alert('Have a pleasant trip!');
  }
}


});




let isFiltered = true;

// Function to fetch destinations by IDs
document.querySelectorAll('.option-img').forEach(image => {
  image.addEventListener('click', () => {
    // Ensure you're not calling blur() here, which would remove focus
  });
});

// Keep track of selected destination IDs globally
let selectedDestinations = [];

function fetchDestinationsByIds(ids) {
  
  console.log(ids, "these are the ids")
  console.log(selectedDestinations);
  
  // Filter out already selected destinations from the IDs
  const newIds = ids.filter(id => !selectedDestinations.includes(id));

  if (newIds.length === 0) {
    console.log('All destinations have already been selected.');
    return Promise.resolve([]); // Return a resolved Promise with an empty array
  }

  return fetch(`http://localhost:3000/api/destinations?ids=${newIds.join(',')}`)
    .then(response => response.json())
    .then(data => {
      // Update the selectedDestinations list with the newly fetched destinations
      const newDestinations = data.map(destination => destination.id);
      selectedDestinations = [...selectedDestinations, ...newDestinations];
      console.log(data)
      //displayDestinations(data); // Function to display the fetched data
      return data; // Return the fetched data for further chaining
    })
    .catch(error => {
      console.error('Error fetching destination data:', error);
      throw error; // Re-throw the error for handling in the caller
    });
}

function displayDestinations(data) {

  if (isFiltered) {
  const resultDiv = document.getElementById('resultDiv');

  // Loop through the data and create elements to display it
    data.forEach(item => {
      if (!item.name || !item.image || !item.description) {
        console.warn('Invalid destination data:', item);
        return;
      }

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('destination-box');

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.classList.add('destination-image');

      const detailsDiv = document.createElement('div');
      detailsDiv.classList.add('destination-details');

      const name = document.createElement('h3');
      name.textContent = item.name;
      name.classList.add('destination-name');

      const description = document.createElement('p');
      description.textContent = item.description;
      description.classList.add('destination-description');

      const location = document.createElement('p');
      location.textContent = `Location: ${item.continent || 'Unknown'}`;
      location.classList.add('destination-location');

      const budget = document.createElement('p');
      budget.textContent = `Budget: ${item.budget || 'Not specified'}`;
      budget.classList.add('destination-budget');

      const duration = document.createElement('p');
      duration.textContent = `Duration: ${item.duration || 'Not specified'} days`;
      duration.classList.add('destination-duration');

      const popularity = document.createElement('p');
      popularity.textContent = `Popularity: ${item.popularity || 'Not rated'}`;
      popularity.classList.add('destination-popularity');

      const rating = document.createElement('span');
      rating.textContent = `Rating: ${item.rating}`;
      rating.classList.add('destination-rating');

      // Append all details to the detailsDiv
      detailsDiv.appendChild(name);
      detailsDiv.appendChild(description);
      detailsDiv.appendChild(location);
      detailsDiv.appendChild(budget);
      detailsDiv.appendChild(duration);
      detailsDiv.appendChild(popularity);
      detailsDiv.appendChild(rating);

      // Append image and detailsDiv to the itemDiv
      itemDiv.appendChild(img);
      itemDiv.appendChild(detailsDiv);

      // Append itemDiv to the resultDiv
      resultDiv.appendChild(itemDiv);
    });
  }
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

