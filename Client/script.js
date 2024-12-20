// Function to fetch destinations by IDs
document.querySelectorAll('.option-img').forEach(image => {
  image.addEventListener('click', () => {
    // Ensure you're not calling blur() here, which would remove focus
  });
});
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
  const resultDiv = document.getElementById('result');  // Fixed typo here

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

// Event listeners for image clicks
const planeImage = document.getElementById('plane');  // Image for Plane
const trainImage = document.getElementById('train');  // Image for Train
const friendsImage = document.getElementById('friends');  // Image for Friends
const familyImage = document.getElementById('family');  // Image for Family

// Add event listeners to images
planeImage.addEventListener('click', () => fetchDestinationsByIds([1, 2, 3]));
trainImage.addEventListener('click', () => fetchDestinationsByIds([1, 2, 3]));
friendsImage.addEventListener('click', () => fetchDestinationsByIds([1, 2, 3]));
familyImage.addEventListener('click', () => fetchDestinationsByIds([1, 2, 3]));
