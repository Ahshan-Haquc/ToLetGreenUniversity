// functions for showing quick find box on click 
function showQuickFindBox(){
    const item = document.getElementById("quickFindBox");
    item.classList.remove("hidden");
}
function hideQuickFindBox(){
    const item = document.getElementById("quickFindBox");
    item.classList.add("hidden");
}

// this is for showing filter result assynchronusly in the filter box 

document.addEventListener("DOMContentLoaded", function () {
    function fetchSeats() {
      let renge1 = document.getElementById("x1").value;
      let renge2 = document.getElementById("x2").value;
      let category = document.getElementById("x3").value;
      let condition = document.getElementById("x4").value;
  
      // Ensure all fields have values before sending request
      if (renge1 && renge2 && location && condition) {
        fetch('/filterFetchResultAssynchronouslyInBuySell', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renge1: renge1, renge2: renge2, category: category, condition: condition }),
        })
          .then((response) => response.json()) // Convert response to JSON
          .then((data) => {
            // Display result dynamically
            const text = document.getElementById("resultText");
            text.innerHTML =`Total ${data.availableSeats} posts available in this range.`;
          })
          .catch((error) => console.error("Error:", error));
      }
    }
  
    // Add event listeners to inputs to trigger fetchSeats when values change
    document.getElementById("x1").addEventListener("input", fetchSeats);
    document.getElementById("x2").addEventListener("input", fetchSeats);
    document.getElementById("x3").addEventListener("change", fetchSeats);
    document.getElementById("x4").addEventListener("change", fetchSeats);
  });
  