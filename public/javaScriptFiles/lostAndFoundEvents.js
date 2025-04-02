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
    function fetchFilteredResults() {
        let itemName = document.getElementById("itemName").value;
        let category = document.getElementById("category").value;
        let dateLost = document.querySelector("[name='dateLost']").value;
        let location = document.getElementById("location").value;

        console.log(itemName, category, dateLost, location, status);

        // Ensure at least one field has a value before sending request
        if (itemName && category && dateLost && location ) {
            fetch('/filterFetchResultAssynchronouslyInLostFound', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    itemName: itemName, 
                    category: category, 
                    dateLost: dateLost, 
                    location: location
                }),
            })
            .then((response) => response.json()) // Convert response to JSON
            .then((data) => {
                // Display result dynamically
                const resultText = document.getElementById("resultText");
                resultText.innerHTML = `Total ${data.totalPosts} matching posts found.`;
            })
            .catch((error) => console.error("Error:", error));
        }
    }

    // Add event listeners to inputs to trigger fetchFilteredResults when values change
    document.getElementById("itemName").addEventListener("input", fetchFilteredResults);
    document.getElementById("category").addEventListener("change", fetchFilteredResults);
    document.querySelector("[name='dateLost']").addEventListener("change", fetchFilteredResults);
    document.getElementById("location").addEventListener("input", fetchFilteredResults);
});
