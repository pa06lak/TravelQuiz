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
  const resultDiv = document.getElementById('result'); 

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
