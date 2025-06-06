
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
  


// this event is for showing pupup and hinding pupup 
// for showing pupup 
function openPopup(divBoxId){
  const item = document.getElementById(divBoxId);
  item.classList.remove("hidden");
  item.classList.add("flex");
}
function closePopup(divBoxId){
  const item = document.getElementById(divBoxId);
  item.classList.remove("flex");
  item.classList.add("hidden");
}


//---------------profile page------------
// this is for clicking button to see user info 
function viewYourInfoByClicking(){
  const profileInfo = document.getElementById("viewYourInfo");
  profileInfo.classList.toggle("hidden");

  const button = document.getElementById("myInfoText");
  if(profileInfo.classList.contains("hidden")){
    const content = `<i class="fa-solid fa-eye"></i> View Info`;
    button.innerHTML= content;
  }else{
    const content = `<i class="fa-solid fa-eye-slash"></i> Hide Info`;
    button.innerHTML= content;
  }
  alert(text);

  //this innerText is not working
  // document.getElementById("myInfoText").innerText("Hide Your Info");
}

// this is for clicking button to see form of update user info
function toggleUpdateForm() {
  const formDiv = document.getElementById("updateInfoForm");
  formDiv.classList.toggle("hidden");
}

// this is for showing posts in profile
document.addEventListener("DOMContentLoaded", fetchSeats("savedPostsBtn"));
let btn1 = "";
let btn2 = "";
const a = document.getElementById("savedPostsBtn");
const b = document.getElementById("myPostBtn");
const c = document.getElementById("myAchievementBtn");
const x = document.getElementById("toletBtn");
const y = document.getElementById("lostFoundBtn");
const z = document.getElementById("buySellBtn");
const x1 = document.getElementById("bloodHelpBtn"); 

async function fetchSeats(btnName) {
  // upper button 
  if(btnName==="savedPostsBtn" || btnName==="myPostBtn" || btnName==="myAchievementBtn"){
    if(btnName==="savedPostsBtn"){
      // style part 
      if(!a.classList.contains('btn-success')){
        a.classList.add("btn-success");
        if(b.classList.contains('btn-success')){
          b.classList.remove("btn-success");
        }
        if(c.classList.contains('btn-success')){
          c.classList.remove("btn-success");
        }
      }
      // backend part 
      btn1 = "savedPostsBtn";
    }else if(btnName==="myPostBtn"){
      if(!b.classList.contains('btn-success')){
        b.classList.add("btn-success");
        if(a.classList.contains('btn-success')){
          a.classList.remove("btn-success");
        }
        if(c.classList.contains('btn-success')){
          c.classList.remove("btn-success");
        }
      }

      btn1 = "myPostBtn";
    }else{
      if(!c.classList.contains('btn-success')){
        c.classList.add("btn-success");
        if(b.classList.contains('btn-success')){
          b.classList.remove("btn-success");
        }
        if(a.classList.contains('btn-success')){
          a.classList.remove("btn-success");
        }
      }
      btn1 = "myAchievementBtn";
    }
  }
  // below button part 
  else{
    if(btnName==="toletBtn"){
      if(!x.classList.contains('btn-success')){
        x.classList.add("btn-success");
        if(y.classList.contains('btn-success')){
          y.classList.remove("btn-success");
        }
        if(z.classList.contains('btn-success')){
          z.classList.remove("btn-success");
        }
        if(x1.classList.contains('btn-success')){
          x1.classList.remove("btn-success");
        }
      }
      btn2 = "toletBtn";
    }else if(btnName==="lostFoundBtn"){
      if(!y.classList.contains('btn-success')){
        y.classList.add("btn-success");
        if(x.classList.contains('btn-success')){
          x.classList.remove("btn-success");
        }
        if(z.classList.contains('btn-success')){
          z.classList.remove("btn-success");
        }
        if(x1.classList.contains('btn-success')){
          x1.classList.remove("btn-success");
        }
      }
      btn2 = "lostFoundBtn";
    }else if(btnName==="bloodHelpBtn"){
      if(!x1.classList.contains('btn-success')){
        x1.classList.add("btn-success");
        if(x.classList.contains('btn-success')){
          x.classList.remove("btn-success");
        }
        if(y.classList.contains('btn-success')){
          y.classList.remove("btn-success");
        }
        if(z.classList.contains('btn-success')){
          z.classList.remove("btn-success");
        }
      }
      btn2 = "bloodHelpBtn";
    }else{
      if(!z.classList.contains('btn-success')){
        z.classList.add("btn-success");
        if(x.classList.contains('btn-success')){
          x.classList.remove("btn-success");
        }
        if(y.classList.contains('btn-success')){
          y.classList.remove("btn-success");
        }
        if(x1.classList.contains('btn-success')){
          x1.classList.remove("btn-success");
        }
      }
      btn2 = "buySellBtn";
    }
  }

  // ekhon eitar vitor theke api call korbo
  if(btn1 && btn2){
const response = await fetch("/fetchPostAndShowInProfile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ aboveButton: btn1, belowButton: btn2 })
});

const data = await response.json();
const postsContainer = document.getElementById("postsContainer"); // Add this ID to your container in EJS
postsContainer.innerHTML = ""; // Clear old posts

if (data.fetchedPosts.length === 0) {
  postsContainer.innerHTML = "<h2>No posts found.</h2>";
} else {
  data.fetchedPosts.forEach(post => {
    const html = `
    <div style="padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; justify-content: space-between; height: 470px; width: 400px;">
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: #9ca3af;">Date : ${new Date(post.postDate).toDateString()}</div>
            <div style="display: flex; gap: 8px;">
                <div class="btn btn-info" onclick="viewOnlyOneSpecificPost(${btn1},${btn2},'${post.postId}')">View</div>
                <div class="btn btn-danger" onclick="deletePostFromProfile(${btn1},${btn2},'${post.postId}')">Delete</div>
            </div>
        </div>
        <div style="padding-top: 12px; padding-bottom: 12px; font-size: 24px; min-height: fit-content; max-height: 120px; overflow: auto;">
            <span style="color: #6b7280;">Title : </span>${post.postTitle}
        </div>
        <div style="display: flex;">
            <div style="height: fit-content; width: fit-content; margin-right: 24px; margin-top: 4px;"><i class="fa-solid fa-user"></i> 5</div>
            <div style="height: fit-content; width: fit-content; margin-right: 24px; margin-top: 4px;"><i class="fa-solid fa-thumbs-up"></i> 23</div>
            <div style="height: fit-content; width: fit-content; margin-right: 24px; margin-top: 4px;"><i class="fa-solid fa-thumbs-down"></i> 4</div>
        </div>
    </div>
    <div style="width: 100%; height: 260px; border-radius: 8px; overflow: hidden;">
        <img src="${post.postImage[0]}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
    </div>
</div>
    `;
    postsContainer.innerHTML += html;
  });
}

  }
}
// ----------end-------------
//This is for deleting post from profile page to student schema
async function deletePostFromProfile(clickedButton, belowclickedButton, postId){
  const buttonName = clickedButton.textContent.trim(); // Get the text content and trim whitespace
  const BelowButtonName = belowclickedButton.textContent.trim();

  const response = await fetch("/deletePostFromProfilePage",{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bn: buttonName,bbn:BelowButtonName, pi: postId })
  });

  const data = await response.json();

  if(data.message==="Yes"){
    alert("This post has deleted succesfully.");
    window.location.reload();
  }else{
    alert("Something wrong in deleting this post.");
  }
}
//-------end-------
//This is for seeing specific post from anywhere (specialy from profile and notification page)
function viewOnlyOneSpecificPost(clickedButton, belowclickedButton, postId) {
  const buttonName = clickedButton.textContent.trim();
  const belowButtonName = belowclickedButton.textContent.trim();

  const url = `/viewingOnlyOneSpecificPost?bn=${encodeURIComponent(buttonName)}&bbn=${encodeURIComponent(belowButtonName)}&pi=${postId}`;
  window.location.href = url;
}
