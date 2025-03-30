// this is for showing how many total seat availabe 
let counter = 1;
let interval = 100; // 0.1 seconds

// Store the interval so we can stop it later
const intervalId = setInterval(updateSeatCounter, interval);

// Function to update the seat counter
function updateSeatCounter() {
  const seatCounterDiv = document.getElementById("seatCounter");

  // Update the displayed number
  seatCounterDiv.innerText = counter;

  // Increment the counter
  counter++;

  // Stop the interval if counter exceeds maxSeats
  if (counter > maxSeats) {
    clearInterval(intervalId);  // Stop the interval
  }
}



// this is for fetching filter result assynchronusly display in the page 

document.addEventListener("DOMContentLoaded", function () {
  function fetchSeats() {
    let range1 = document.getElementById("x1").value;
    let range2 = document.getElementById("x2").value;
    let location = document.getElementById("x3").value;

    // Ensure all fields have values before sending request
    if (range1 && range2 && location) {
      fetch("/findJustNumberOfSeatsUsingFiltering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renge1: range1, renge2: range2, location: location }),
      })
        .then((response) => response.json()) // Convert response to JSON
        .then((data) => {
          // Display result dynamically
          const text = document.getElementById("seePostByFiltering5");
          text.innerHTML =`Total ${data.availableSeats} seats available in this range.`;
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  // Add event listeners to inputs to trigger fetchSeats when values change
  document.getElementById("x1").addEventListener("input", fetchSeats);
  document.getElementById("x2").addEventListener("input", fetchSeats);
  document.getElementById("x3").addEventListener("change", fetchSeats);
});

