// Undo/Redo Stacks
let actionStack = [];
let redoStack = [];

// Function to perform an action and track it
function performAction(action, undoAction) {
  action();
  actionStack.push(undoAction);
  redoStack = []; // Clear redo stack on new action
}

// Function to undo the last action
function undo() {
  if (actionStack.length > 0) {
    const undoAction = actionStack.pop();
    undoAction();
    redoStack.push(undoAction);
  }
}

// Function to redo the last undone action
function redo() {
  if (redoStack.length > 0) {
    const redoAction = redoStack.pop();
    redoAction();
    actionStack.push(redoAction);
  }
}

// Prevent the browser's default undo action (Back Navigation, etc.)
window.addEventListener('keydown', (e) => {
  const isUndo = (e.ctrlKey || e.metaKey) && e.key === 'z';
  const isRedo = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z';

  // If it's the undo/redo combo, prevent default behavior
  if (isUndo || isRedo) {
    e.preventDefault(); // Prevent the browser's default behavior

    if (isUndo) {
      undo();
    } else if (isRedo) {
      redo();
    }
  }

  // Prevent Backspace from navigating back (only if not focused on an input or textarea)
  if (e.key === 'Backspace' && !document.activeElement.isContentEditable && 
    !(document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
  e.preventDefault(); // Prevent going back when Backspace is pressed
}
});




// DOMContentLoaded Logic
document.addEventListener("DOMContentLoaded", () => {
  // Select all option images
  const optionImages = document.querySelectorAll(".option-img");

  if (!optionImages.length) {
    console.error("No option images found!");
    return;
  }

  // Add click event listeners to each image
  optionImages.forEach((image) => {
    image.addEventListener("click", (event) => {
      const clickedImage = event.target;

      // Get the parent question container
      const questionContainer = clickedImage.closest(".question");

      if (!questionContainer) {
        console.error("Question container not found.");
        return;
      }

      // Highlight the selected option
      questionContainer.querySelectorAll(".option-img").forEach((img) => {
        img.classList.remove("selected");
      });
      clickedImage.classList.add("selected");

      // Perform action for undo/redo
      performAction(
        () => clickedImage.classList.add("selected"),
        () => clickedImage.classList.remove("selected")
      );
    });
  });
});




document.addEventListener("DOMContentLoaded", () => {
    // Select all option images
    const optionImages = document.querySelectorAll(".option-img");

    if (!optionImages.length) {
      throw new Error("No option images found!");
    }


  // Add click event listeners to each image
  optionImages.forEach((image) => {
    image.addEventListener("click", (event) => {
      const clickedImage = event.target;

      // Get the parent question container
      const questionContainer = clickedImage.closest(".question");
      
      if (!questionContainer) {
        throw new Error("Question container not found.");
      }

      
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
    if (!name) {
      alert("Please enter your name.");
      return;
    }
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
    document.getElementById('resultDiv').innerHTML='';
    // Assuming selectedDestinations is an array of IDs like [1, 2]
// Fetch the destinations data from the JSON file
  for (let destinationId of selectedDestinations) {
    fetch(`http://192.168.1.246:3000/api/destinations?ids=${destinationId}`)
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
  document.getElementById("apply-filters").addEventListener("click", async () => {
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
    await applyFilters(filters, resultDiv);
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
    try {
      const { continent, budget, duration, popularity } = filters;

      const ids = destinations.join(',');
      const response = await fetch(`http://192.168.1.246:3000/api/destinations?ids=${ids}`);
      // Check if the response is successful (HTTP 200 OK)
    if (!response.ok) {
      throw new Error(`Failed to fetch destinations. Status: ${response.status}`);
    }
      const data = await response.json();

      // Ensure the response contains valid data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format. Expected an array of destinations.');
    }

      // Filter destinations and keep the full object for matched items
      const filteredDestinations = data.filter(destination => {
        // Validate destination properties
      if (!destination || typeof destination !== 'object') {
        console.warn('Invalid destination data:', destination);
        return false; // Skip invalid data
      }
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
    } catch (error) {
      console.error('Error while shortlisting destinations:', error);
      throw error; // Re-throw to be handled by the caller
    }
  }

  function displayDestinationsInteractive(data, resultDiv) {
    try {
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
    }catch (error) {
      console.error('Error while applying filters:', error);
      alert("There was an error while applying the filters.");
    }
  }
  
  // Function to handle destination interaction
  function handleDestinationClick(destination, ratingElement) {
    const modal = document.getElementById('ratingModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrompt = document.getElementById('modalPrompt');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const ratingInputContainer = document.getElementById('ratingInputContainer');
    const ratingInput = document.getElementById('ratingInput');
    const submitRatingButton = document.getElementById('submitRatingButton');
    const closeButton = document.querySelector('.close-button');
  
    // Reset modal state
    modal.style.display = 'block';
    modalTitle.textContent = `Rate ${destination.name}`;
    modalPrompt.textContent = 'Have you been to this destination?';
    ratingInputContainer.style.display = 'none';
    ratingInput.value = '';
  
    // Close button logic
    closeButton.onclick = () => {
      modal.style.display = 'none';
    };
  
    // Handle "Yes" button click
    yesButton.onclick = () => {
      modalPrompt.textContent = 'Please rate this destination (1-5):';
      ratingInputContainer.style.display = 'block';
    };
  
    // Handle "No" button click
    noButton.onclick = () => {
      modalPrompt.textContent = 'Have a pleasant trip!';
      ratingInputContainer.style.display = 'none';
  
      setTimeout(() => {
        modal.style.display = 'none';
      }, 2000); // Close modal after a short delay
    };
  
    // Submit rating
    submitRatingButton.onclick = () => {
      const userRating = parseInt(ratingInput.value);
  
      if (!isNaN(userRating) && userRating >= 1 && userRating <= 5) {
        // Make POST request to update rating
        fetch('http://192.168.1.246:3000/update-rating', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destinationName: destination.name,
            userRating: userRating,
          }),
        })
        .then((response) => {
          if (!response.ok) {
            // If HTTP status code is not in the 200-299 range, handle the error
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })

          .then((data) => {
            if (data.error) {
              console.error('Error updating rating:', data.error);
            } else {
              console.log('Rating updated successfully:', data);
  
              // Update destination rating locally
              destination.rating = data.destination.rating;
              ratingElement.textContent = `Rating: ${destination.rating.toFixed(2)}`;
            }
            modal.style.display = 'none';
          })
          .catch((err) => console.error('Request failed:', err));
      } else {
        alert('Please enter a valid rating between 1 and 5.');
      }
    };
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

  return fetch(`http://192.168.1.246:3000/api/destinations?ids=${newIds.join(',')}`)
  .then(response => {
    // Check if the response status is ok (200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch destinations. Status: ${response.status}`);
    }
    return response.json(); // Parse the JSON if the response is valid
  })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format. Expected an array of destinations.');
      }

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

