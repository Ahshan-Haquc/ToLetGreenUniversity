
//function for changing like and dislike button properties
// for updating dislike 
async function toggleDisLike(dislikeFrom, postId, userId) {
    try {
      const response = await fetch("/toggle-dislike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dislikeFrom, postId, userId }),
      });
  
      //for converting json response to js object
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

//   for updating like 
  async function toggleLike(likeFrom, postId, userId) {
    try {
      const response = await fetch("/toggle-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likeFrom, postId, userId }),
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
  