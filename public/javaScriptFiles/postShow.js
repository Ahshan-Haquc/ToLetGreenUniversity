const { application, json } = require("express");

// function for showing popup and hiding popup of rating
function showingPopup(postCount) {
  const popup = document.getElementById(`peopleReviewPopUp${postCount}`);
  const background = document.getElementById(
    `peopleReviewPopUpBackground${postCount}`
  );

  // Show popup and background overlay
  popup.classList.add("showPopup");
  background.classList.add("showPopup");
}

function hidePopup(postCount) {
  const popup = document.getElementById(`peopleReviewPopUp${postCount}`);
  const background = document.getElementById(
    `peopleReviewPopUpBackground${postCount}`
  );
  popup.classList.remove("showPopup");
  background.classList.remove("showPopup");
}

// function for showing popup and hiding popup of google map link showing
function showingGoogleMapPopup(postId) {
  const popup = document.querySelector(`#googleMapPopUp${postId}`);
  console.log(popup);
  const background = document.querySelector(
    `#peopleReviewPopUpBackground${postId}`
  );
  // Show popup and background overlay
  popup.classList.add("showPopup");
  background.classList.add("showPopup");
}

function hideGoogleMapPopupBackground(postId) {
  const popup = document.querySelector(`#googleMapPopUp${postId}`);
  console.log(popup);
  const background = document.querySelector(
    `#peopleReviewPopUpBackground${postId}`
  );
  // Show popup and background overlay
  popup.classList.remove("showPopup");
  background.classList.remove("showPopup");
}

// function for showing popup and hiding popup of facilities
async function facilitiesShowInPopup(postId){
  const response = await fetch("/facilitiesShowUsingPopup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId}),
  });

  //for converting json response to js object
  const data = await response.json();

  //  // Get facilities container
  //  const facilitiesListContainer = document.getElementById("facilitiesList");

  //  // Clear previous facilities before adding new ones
  //  facilitiesListContainer.innerHTML = "";
 
  //  if (data.facilities && data.facilities.length > 0) {
  //    // Create an unordered list
  //    const ul = document.createElement("ul");
 
  //    // Loop through facilities and create list items
  //    data.facilities.forEach((facility) => {
  //      const li = document.createElement("li");
  //      li.textContent = facility; // Set text of list item
  //      ul.appendChild(li); // Append list item to the unordered list
  //    });
 
  //    // Append the unordered list to the container
  //    facilitiesListContainer.appendChild(ul);
  //  } else {
  //    facilitiesListContainer.innerHTML = "<p>No facilities available</p>";
  //  }
 

  //showing facilities in page
 
 
  const popup= document.getElementById("facilitiesPopup");
  popup.classList.add("showPopup");
  const facilitiesText = document.getElementById("facilitiesText");
  facilitiesText.textContent=data.facilities;
  const background = document.querySelector(
    `#facilitiesPopupBg`
  );
  background.classList.add("showPopup");
}

function hideFacilitiesShowInPopup(){
  const popup= document.getElementById("facilitiesPopup");
  const background = document.querySelector(
    `#facilitiesPopupBg`
  );
  popup.classList.remove("showPopup");
  background.classList.remove("showPopup");
}




// function for going from seePost to confirm post by clicking view all button 
// and it is get request bcz i am passing postId to access the confirm page
function goConfirmPage(postID) {
  window.location.href = `/confirmToletSeat?postID=${postID}`;
}



// ----------------
// alert will show whenever page will load
// it will only occur when page is render by filter router
function showFilterResultAlert(){
  window.onload = function() {
    alert("Page has loaded successfully!");
};
}