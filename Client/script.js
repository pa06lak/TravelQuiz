document.querySelectorAll('.option-img').forEach(image => {
  image.addEventListener('click', () => {
    const answer = image.getAttribute('data-answer'); // Get the answer value
    console.log('Selected Answer:', answer);

    // Fetch data based on the answer
    fetch(`/api/locations/${answer}`) // Send the answer to the server
      console.log(answer)
  });
});

function displayLocations(data) {
  const resultDiv = document.getElementById('result'); // Ensure this ID exists in your HTML

  // Clear previous results
  resultDiv.innerHTML = '';

  data.forEach(location => {
    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location-item');
    locationDiv.innerHTML = `
      <h4>${location.name}</h4>
      <img src="${location.image}" alt="${location.name}" style="width: 100px;">
      <p>${location.description}</p>
    `;
    resultDiv.appendChild(locationDiv);
  });
}
