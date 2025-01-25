// My two entities are the destinations and the questions. There is a many to many relationship here
// This is because many destinations match to many questions, linked by the two JSON files

// This would understand of the nature of imperative programming in an OOP style
// Throughout this code there is exception and exception handling through the try and catch statements
// There is also promises being made
//--------------------------------------------------------------------------------------------------------------------------------
//This is all to check the server connection
// This would gracefully handle server disconnection, send useful error messages and recommend on server restart
function checkServerConnection() {
  fetch('/api/destinations')
    .then(response => {
      if (response.ok) {
        console.log("Server connected");
      } else {
        showConnectionError();
      }
    })
    .catch(err => {
      console.log(err)
      showConnectionError();
    });
}
//Function to handle connection
function showConnectionError() {
  const message = "We are currently disconnected from the server. Please run 'npm start' or try again later. Thank you for your co-operation!.";
  alert(message); 
}

setInterval(checkServerConnection, 5000);
//Function to handle connection
function restoreUserState() {
  const userState = localStorage.getItem('userState');
  if (userState) {
    const state = JSON.parse(userState);
    console.log(state); 
  }
}

window.addEventListener('beforeunload', function() {
  const userState = {
    selectedDestination: document.querySelector('.destination-name').innerText, // Example field to save
  };
  localStorage.setItem('userState', JSON.stringify(userState));
});

window.addEventListener('load', restoreUserState);
//--------------------------------------------------------------------------------------------------------------------------------










//--------------------------------------------------------------------------------------------------------------------------------
//This for the undoing
let actionStack = [];
let redoStack = [];

//Function to undo
function undo() {
  if (actionStack.length > 0) {
    const undoAction = actionStack.pop();
    undoAction();
    redoStack.push(undoAction);
  }
}

//Function to redo
function redo() {
  if (redoStack.length > 0) {
    const redoAction = redoStack.pop();
    redoAction();
    actionStack.push(redoAction);
  }
}

//Function to toggle
window.addEventListener('keydown', (e) => {
  const isUndo = (e.ctrlKey || e.metaKey) && e.key === 'z';
  const isRedo = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z';
  if (isUndo || isRedo) {
    e.preventDefault(); 

    if (isUndo) {
      undo();
    } else if (isRedo) {
      redo();
    }
  }
  if (e.key === 'Backspace' && !document.activeElement.isContentEditable && 
    !(document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT')) {
  e.preventDefault(); // Prevent going back when Backspace is pressed
}
});
//--------------------------------------------------------------------------------------------------------------------










// --------------------------------------------------------------------------------------------------------------------
// Here the images are loaded and if they are clicked destinations are added to selected destination
document.addEventListener("DOMContentLoaded", () => {
    const optionImages = document.querySelectorAll(".option-img");
    if (!optionImages.length) {
      throw new Error("No option images found!");
    }
//Here I have used control statements to loop and make a decision
  optionImages.forEach((image) => {
    image.addEventListener("click", (event) => {
      const clickedImage = event.target;
      const questionContainer = clickedImage.closest(".question");
      if (!questionContainer) {
        throw new Error("Question container not found.");
      }
      const selectedImages = questionContainer.querySelectorAll(".selected");
      selectedImages.forEach((selected) => {
        selected.classList.remove("selected");
      });
      clickedImage.classList.add("selected");
    });
  });
  // Form submission handler
  const form = document.getElementById("quizForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    if (!name) {
      alert("Please enter your name.");
      return;
    }
    const questions = document.querySelectorAll(".question");
    const answers = [];
    questions.forEach((question) => {
      const selected = question.querySelector(".selected");
      if (selected) {
        answers.push(selected.dataset.answer);
      }
    });
    if (answers.length < questions.length) {
      alert("Please answer all the questions!");
      return;
    }
    //console.log(selectedDestinations);
    document.getElementById('resultDiv').innerHTML='';
  for (let destinationId of selectedDestinations) {
    fetch(`/api/destinations?ids=${destinationId}`)
     .then(response => {
      if (response.status === 200) {
        return response.json(); // Successful response
        //This uses authentication in the form of numbers
      } else if (response.status === 404) {
        showConnectionError();
      } else if (response.status === 500) {
        showConnectionError();
      } else {
        showConnectionError();
      }
    })
     .then(data => {
        //console.log(data)
        
        displayDestinations(data); // Function to display the fetched data
      })
     .catch(error => console.error('Error:', error));
  }
  });
});
//--------------------------------------------------------------------------------------------------------------------










// I have created a filter function for this which acts for searching
// This is loading dynamic JSON content from the server via AJAX requests
//--------------------------------------------------------------------------------------------------------------------
//When the apply filters is called then we look through all the destinations and see which ones match
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("apply-filters").addEventListener("click", async () => {
    const filters = {
      continent: document.getElementById("continent").value,
      budget: document.getElementById("budget").value,
      duration: document.getElementById("duration").value,
      popularity: document.getElementById("popularity").value,
    };
    const resultDiv = document.getElementById('resultDiv'); 
    await applyFilters(filters, resultDiv);
  });

  //Function to apply filters
  async function applyFilters(filters, resultDiv) {
    //console.log("Filters applied:", filters);
    isFiltered = false;
    const noFiltersSelected = !filters.continent && !filters.budget && !filters.duration && !filters.popularity;
    if (noFiltersSelected) {
      alert("Please select at least one filter.");
      return; 
    }
    //console.log("Selected Destinations:", selectedDestinations);
  resultDiv.innerHTML = '';
    var filteredDestinations = await shortlistDestinations(selectedDestinations, filters);
    //console.log("Filtered Destinations:", filteredDestinations);
    displayDestinationsInteractive(filteredDestinations, resultDiv);
    const searchBar = document.getElementById('searchBar'); // Assuming the search bar has an ID 'searchBar'
    if (searchBar) {
    searchBar.style.display = 'none'; // Hide the search bar
  }
  }

  //Function to get the search results for a given destination and search criteria
  async function shortlistDestinations(destinations, filters) {
    try {
      const { continent, budget, duration, popularity } = filters;
      const ids = destinations.join(',');
      const response = await fetch(`/api/destinations?ids=${ids}`);
    if (!response.ok) {
      showConnectionError();
    }
      const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format. Expected an array of destinations.');
    }
      const filteredDestinations = data.filter(destination => {
      if (!destination || typeof destination !== 'object') {
        console.warn('Invalid destination data:', destination);
        return false; 
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
      return filteredDestinations; 
    } catch (error) {
      console.error('Error while shortlisting destinations:', error);
      throw error; 
    }
  }

  // Function to display the fetched data
  function displayDestinationsInteractive(data, resultDiv) {
    try {
      //console.log(data, "filtered destination 2");
      if (!resultDiv) {
        console.error('Result container (resultDiv) not found in the DOM.');
        return;
      }
      resultDiv.innerHTML = ''; 
      data.forEach(item => {
        if (!item.name || !item.image || !item.description) {
          console.warn('Invalid destination data:', item);
          return;
        }
        //console.log("This has gotten to this point")
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
  
    modal.style.display = 'block';
    modalTitle.textContent = `Rate ${destination.name}`;
    modalPrompt.textContent = 'Have you been to this destination?';
    ratingInputContainer.style.display = 'none';
    ratingInput.value = '';
  
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
      }, 2000); 
    };
  
    // Submit rating
    submitRatingButton.onclick = () => {
      const userRating = parseInt(ratingInput.value);
      if (!isNaN(userRating) && userRating >= 1 && userRating <= 5) {
        // Make POST request to update rating
        fetch('/update-rating', {
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
            showConnectionError();
          }
          return response.json();
        })
          .then((data) => {
            if (data.error) {
              console.error('Error updating rating:', data.error);
            } else {
              console.log('Rating updated successfully:', data);
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
// --------------------------------------------------------------------------------------------------------------------------------





let isFiltered = true;





// Here the fetch API call and this uses the JSON model
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Fetch all destinations initially
let selectedDestinations = [];

fetch('/api/questions')
  .then(response => response.json())
  .then(questions => {
    // Loop through each image with the "option-img" class
    document.querySelectorAll('.option-img').forEach(image => {
      image.addEventListener('click', () => {
        // Find the question corresponding to the clicked image
        const question = questions.find(q => q.id === image.id);
        if (question && question.destinationIds) {
          // Add the destination IDs to the selectedDestinations array
          selectedDestinations = [...new Set([...selectedDestinations, ...question.destinationIds])];
          //console.log(selectedDestinations); // Log the updated selected destinations
        } else {
          console.error('No destinationIds found for the clicked image');
        }
      });
    });
  })
  .catch(error => {
    console.error('Error fetching questions:', error);
  });


// Create destination selection for the selected destination
function fetchDestinationsByIds(ids) {
  //console.log(ids, "these are the ids")
  //console.log(selectedDestinations);
  const newIds = ids.filter(id => !selectedDestinations.includes(id));
  if (newIds.length === 0) {
    console.log('All destinations have already been selected.');
    return Promise.resolve([]); // Return a resolved Promise with an empty array
  }
  return fetch(`/api/destinations?ids=${newIds.join(',')}`)
  .then(response => {
    // Check if the response status is ok (200-299)
    if (!response.ok) {
      showConnectionError();
    }
    return response.json(); 
  })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format. Expected an array of destinations.');
      }
      const newDestinations = data.map(destination => destination.id);
      selectedDestinations = [...selectedDestinations, ...newDestinations];
      //console.log(data)
      return data; 
    })
    .catch(error => {
      console.error('Error fetching destination data:', error);
      throw error; 
    });
}

// Function to fetch destination data from the server and return it as a string with the destination data
function displayDestinations(data) {
  if (isFiltered) {
  const resultDiv = document.getElementById('resultDiv');
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

      itemDiv.appendChild(img);
      itemDiv.appendChild(detailsDiv);
      resultDiv.appendChild(itemDiv);
    });
  }
}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------










