// function for showing popup and hiding popup of rating
function showingPopup(postCount) {
  const popup = document.querySelector(`#peopleReviewPopUp${postCount}`);
  const background = document.querySelector(
    `#peopleReviewPopUpBackground${postCount}`
  );
  // Show popup and background overlay
  popup.classList.add("showPopup");
  background.classList.add("showPopup");
}
function hidePopup(postCount) {
  const popup = document.querySelector(`#peopleReviewPopUp${postCount}`);
  const background = document.querySelector(
    `#peopleReviewPopUpBackground${postCount}`
  );
  popup.classList.remove("showPopup");
  background.classList.remove("showPopup");
}




//function for changing like and dislike button properties
async function toggleDisLike(postId, userId) {
  try {
    const response = await fetch("/toggle-dislike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId }),
    });

    const result = await response.json();

    // Use the unique id to select the correct like-count element
    const likeButtonText = document.getElementById(
      `dislike-count-${postId}`
    );
    likeButtonText.textContent = result.disliked
      ? "Dis-liked"
      : "Dis-like";
    likeButtonText.style.color = result.disliked ? "#00630c" : "black";
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}
async function toggleLike(postId, userId) {
  try {
    const response = await fetch("/toggle-like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId }),
    });

    const result = await response.json();

    // Use the unique id to select the correct like-count element
    const likeButtonText = document.getElementById(
      `like-count-${postId}`
    );
    likeButtonText.textContent = result.liked ? "Liked" : "Like";
    likeButtonText.style.color = result.liked ? "#00630c" : "black";
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}


// function for going from seePost to confirm post by clicking view all button 
function goConfirmPage(postID) {
  window.location.href = `/confirmToletSeat?postID=${postID}`;
}
