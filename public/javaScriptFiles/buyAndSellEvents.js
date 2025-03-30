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
      let range1 = document.getElementById("x1").value;
      let range2 = document.getElementById("x2").value;
      let category = document.getElementById("x3").value;
      console.log(range1,range2,category);
  
      // Ensure all fields have values before sending request
      if (range1 && range2 && location) {
        fetch('/filterFetchResultAssynchronously', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renge1: range1, renge2: range2, category: category }),
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
  });
  