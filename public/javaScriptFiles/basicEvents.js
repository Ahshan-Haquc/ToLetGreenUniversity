
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



// this is for showing posts in profile
// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("myPostBtn").classList.add("btn-success");
//   document.getElementById("lostFoundBtn").classList.add("btn-success");
// });
let btn1 = "savedPostsBtn";
let btn2 = "toletBtn";
const a = document.getElementById("savedPostsBtn");
const b = document.getElementById("myPostBtn");
const c = document.getElementById("myAchievementBtn");
const x = document.getElementById("toletBtn");
const y = document.getElementById("lostFoundBtn");
const z = document.getElementById("buySellBtn");

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
      }
      btn2 = "lostFoundBtn";
    }else{
      if(!z.classList.contains('btn-success')){
        z.classList.add("btn-success");
        if(x.classList.contains('btn-success')){
          x.classList.remove("btn-success");
        }
        if(y.classList.contains('btn-success')){
          y.classList.remove("btn-success");
        }
      }
      btn2 = "buySellBtn";
    }
  }

  // ekhon eitar vitor theke api call korbo
  if(btn1 && btn2){
    // Replace your .then() block like this:
const response = await fetch("/fetchPostAndShowInProfile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ aboveButton: btn1, belowButton: btn2 })
});

const data = await response.json();
console.log(data);
const postsContainer = document.getElementById("postsContainer"); // Add this ID to your container in EJS
postsContainer.innerHTML = ""; // Clear old posts

if (data.fetchedPosts.length === 0) {
  postsContainer.innerHTML = "<h2>No posts found.</h2>";
} else {
  data.fetchedPosts.forEach(post => {
    const html = `
      <div class="h-[470px] w-[400px] p-5 bg-white rounded-2xl shadow-lg flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-center">
            <div class="text-gray-400">Date : ${new Date(post.postDate).toDateString()}</div>
            <div class="flex gap-2">
              <div class="btn btn-info">View</div>
              <div class="btn btn-danger">Delete</div>
            </div>
          </div>
          <div class="py-3 text-4xl min-h-fit max-h-[120px]">
            <span class="text-gray-500">Title : </span>${post.postTitle}
          </div>
          <div class="flex">
            <div class="h-fit w-fit mr-6 mt-1"><i class="fa-solid fa-user"></i> 5</div>
            <div class="h-fit w-fit mr-6 mt-1"><i class="fa-solid fa-thumbs-up"></i> 23</div>
            <div class="h-fit w-fit mr-6 mt-1"><i class="fa-solid fa-thumbs-down"></i> 4</div>
          </div>
        </div>
        <div class="w-full h-[260px] bg-gray-300 rounded-2xl">
          <!-- If you want to show image: -->
          <!-- <img src="${post.postImage}" class="w-full h-full object-cover rounded-2xl" /> -->
        </div>
      </div>
    `;
    postsContainer.innerHTML += html;
  });
}

  }
}
// document.addEventListener("DOMContentLoaded", function () {
//   function fetchSeats(btnName) {
//     let btn1 = document.getElementById("savedPostsBtn").textContent;
//     let btn2 = document.getElementById("myPostBtn").textContent;
//     let btn3 = document.getElementById("myAchievementBtn").textContent;
//     let btn4 = document.getElementById("toletBtn").textContent;
//     let btn5 = document.getElementById("lostFoundBtn").textContent;
//     let btn6 = document.getElementById("buySellBtn").textContent;
//     console.log("peremeter name : ",btnName);

//     let btnClickedNamge = "";
//     let belowBtnClickedNamge = "";
//     console.log("initially buttons are : 1 -",btnClickedNamge,"and 2 -",belowBtnClickedNamge);

//     if(btn1===btnName){
//       btnClickedNamge = btn1;
//     }else if(btn2===btnName){
//       btnClickedNamge = btn2;
//     }else if(btn3===btnName){
//       btnClickedNamge = btn3;
//     }else if(btn4===btnName){
//       belowBtnClickedNamge = btn4;
//     }else if(btn5===btnName){
//       belowBtnClickedNamge = btn5;
//     }else if(btn6===btnName){
//       belowBtnClickedNamge = btn6;
//     }

//     console.log("After Buttons name are: ",btnClickedNamge,belowBtnClickedNamge)
//     // Ensure all fields have values before sending request
//     if (btnClickedNamge && belowBtnClickedNamge) {
//       alert("worked");
//       console.log("After Buttons name are: ",btnClickedNamge,belowBtnClickedNamge)
//     }
//   }

//   // Add event listeners to inputs to trigger fetchSeats when values change
//   document.getElementById("savedPostsBtn").addEventListener("click", fetchSeats("Saved Posts"));
//   document.getElementById("myPostBtn").addEventListener("click", fetchSeats("My Post"));
//   document.getElementById("myAchievementBtn").addEventListener("click", fetchSeats("My Acheivement"));
//   document.getElementById("toletBtn").addEventListener("click", fetchSeats("To-let"));
//   document.getElementById("lostFoundBtn").addEventListener("click", fetchSeats("Lost & Found"));
//   document.getElementById("buySellBtn").addEventListener("click", fetchSeats("Buy & Sell"));
  
// });
