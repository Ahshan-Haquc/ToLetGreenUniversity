//when the blood page is loaded then this function will be called so that the page do not look empty


//--------------------------
// ekta problem j jokhon kono blood post thake na tokhon ei ta call korle abnormal behave kore 
// r ekta problem holo blood post create korle auto see posts button active hoyna
// -----------------------------------

document.addEventListener("DOMContentLoaded", function() {
  seeBloodPost();
});

function registerAsDonerShowForm(){
    const buttonName = document.getElementById("donorRegistrationBtn").textContent.trim();
    if(buttonName==="Join Donation"){
      document.getElementById("donerRegisterDiv").classList.remove("hidden");
      document.getElementById("registerBg").classList.remove("hidden");
    }else{
      submitDonorRegistrationForm();
    }

}
function registerAsDonerHideForm(){
    document.getElementById("donerRegisterDiv").classList.add("hidden");
    document.getElementById("registerBg").classList.add("hidden");

    document.getElementById("bloodGroup").innerText="";
    document.getElementById("location").innerText="";
}
function bloodPostShowForm(){
    document.getElementById("createBloodPostForm").classList.remove("hidden");
    document.getElementById("registerBg").classList.remove("hidden");
}
function bloodPostHideForm(){
    document.getElementById("createBloodPostForm").classList.add("hidden");
    document.getElementById("registerBg").classList.add("hidden");
}

//see posts of blood help
async function seeBloodPost(){
  //checking if donor list is showing then it will be hidden , because now see post will be show
  const seeDonorList = document.getElementById("seeDonerList");
  if(!seeDonorList.classList.contains("hidden")){
    seeDonorList.classList.add("hidden");
    document.getElementById("donorListBtn").classList.remove("bloodBtn");
    document.getElementById("donorListBtn").classList.add("border");
  }
  //showing the div area
  const postShowingMainArea = document.getElementById("seeBloodPost");
  postShowingMainArea.classList.remove("hidden");
  //showing this button is active
  document.getElementById("seePostBtn").classList.add("bloodBtn");
  document.getElementById("seePostBtn").classList.remove("border");
  //getting post container to add post boxes
  const postsContainer = document.getElementById("seeBloodPostBoxContainer");
  postsContainer.innerHTML = ""; // Clear previous posts

    try {
        const response = await fetch("/seeBloodPost");
        const data = await response.json();
        if(data.posts===0){
          donorListContainer.innerHTML = `<div class="w-full text-3xl flex justify-center text-red-700 font-bold">No post available !</div>`;
          return;
        }
        if(response.ok){  
          // Check if bolow each post id has saved posts and requested in posts in the student schema
          // Converting ObjectId to string for comparison
          const savedPostIds = data.student.savedPosts.map(id => id.toString()); 
          const studentRequested = data.student.requestedInPost.map(id => id.toString()); 
          
          data.posts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";
            const formattedDate = new Date(post.dateNeeded).toISOString().split('T')[0];
          
            // Check if the post is already saved by the student then it will show saved button
            const isSaved = savedPostIds.includes(post._id.toString());
            const isRequested = studentRequested.includes(post._id.toString());
          
            postDiv.innerHTML = `
              <div class="h-fit w-full p-4 border-2 border-red-700 rounded-xl flex">
                <div class="h-fit w-4/5">
                  <div class="text-3xl text-red-700 font-bold">${post.title}</div>
                  <div class="mt-2 text-3xl">
                    ${post.bloodGroup} blood need on ${formattedDate} at ${post.location}.
                    Contact : ${post.contact}
                  </div>
                  <div>
                    <span class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer">Additional Note</span> |
                    <span class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer">User Information</span>
                  </div>
                </div>
                <div class="h-fit w-1/5 flex flex-col items-end gap-3">
                  <div
                    class="btn btn-info"
                    id="confirmRequestSeatButton${post._id}"
                    onclick="confirmRequestSent('Request','Blood-Help','${data.student._id}','${post.studentPostedId}','${post._id}')"
                  >
                    ${isRequested ? 'Responsed' : 'Response for Donation'}
                  </div>
                  <div
                    class="btn btn-default"
                    id="saveButton${post._id}"
                    onclick="saveThisPost('Blood-Help','${data.student._id}','${post._id}')"
                  >
                    ${isSaved ? 'Saved' : 'Save it'}
                  </div>
                </div>
              </div>
            `;
            postsContainer.appendChild(postDiv);
          });
          
        }else{
            alert("No blood posts found");
            window.location.href = "/bloodHelpHomePage";
        }

    } catch (error) {
        console.error("Error fetching blood posts:", error);
        window.location.href = "/bloodHelpHomePage";
    }
}

// this is for see post by filterring the blood group
async function filterPostByBloodGroup(){
  const filterBloodGroupSelected = document.getElementById("filterBloodGroupSelected").value;

  const response = await fetch("/filterPostByBloodGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filterBloodGroupSelected }),
  });
  if (response.ok) {
    const data = await response.json();
    const postsContainer = document.getElementById("seeBloodPostBoxContainer");
    postsContainer.innerHTML = ""; // Clear previous posts

    if(data.posts.length === 0){
      postsContainer.innerHTML = `<div class="w-full text-3xl flex justify-center text-red-700 font-bold">No post available !</div>`;
      return;
    }
    data.posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      const formattedDate = new Date(post.dateNeeded).toISOString().split('T')[0];
      postDiv.innerHTML = `
        <div class="h-fit w-full p-4 border-2 border-red-700 rounded-xl flex">
          <div class="h-fit w-4/5">
            <div class="text-3xl text-red-700 font-bold">${post.title}</div>
            <div class="mt-2 text-3xl">
              ${post.bloodGroup} blood need on ${formattedDate} at ${post.location}.
              Contact : ${post.contact}
            </div>
            <div>
              <span class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer">Additional Note</span> |
              <span class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer">User Information</span>
            </div>
          </div>
          <div class="h-fit w-1/5 flex flex-col items-end gap-3">
            <div
              class="btn btn-info"
              id="confirmRequestSeatButton${post._id}"
              onclick="confirmRequestSent('Request','Blood-Help','${data.student._id}','${post.studentPostedId}','${post._id}')"
            >
              Response for Donation
            </div>
            <div
              class="btn btn-default"
              id="saveButton${post._id}"
              onclick="saveThisPost('Blood-Help','${data.student._id}','${post._id}')"
            >
              Save it
            </div>
          </div>
        </div>
      `;
      postsContainer.appendChild(postDiv);
    });
  } else {
    alert("Error filtering posts by blood group.");
  }
}

// this is for see post by searching
let searchTimeout;
document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(searchTimeout); // debounce
  searchTimeout = setTimeout(() => {
    searchBloodPosts();
  }, 300); // wait 300ms after last keystroke
});

async function searchBloodPosts() {
  const searchQuery = document.getElementById("searchInput").value.trim();

  const response = await fetch("/searchBloodPosts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ searchQuery }),
  });

  const postsContainer = document.getElementById("seeBloodPostBoxContainer");
  postsContainer.innerHTML = ""; // Clear old posts

  if (response.ok) {
    const data = await response.json();

    if (data.posts.length === 0) {
      postsContainer.innerHTML = `<div class="w-full text-3xl flex justify-center text-red-700 font-bold">No post found!</div>`;
      return;
    }

    data.posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      const formattedDate = new Date(post.dateNeeded).toISOString().split('T')[0];
      postDiv.innerHTML = `
        <div class="h-fit w-full p-4 border-2 border-red-700 rounded-xl flex">
          <div class="h-fit w-4/5">
            <div class="text-3xl text-red-700 font-bold">${post.title}</div>
            <div class="mt-2 text-3xl">
              ${post.bloodGroup} blood need on ${formattedDate} at ${post.location}.
              Contact : ${post.contact}
            </div>
            <div>
              <span class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer">Additional Note</span> |
              <span class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer">User Information</span>
            </div>
          </div>
          <div class="h-fit w-1/5 flex flex-col items-end gap-3">
            <div class="btn btn-info" onclick="confirmRequestSent('Request','Blood-Help','${data.student._id}','${post.studentPostedId}','${post._id}')">
              Response for Donation
            </div>
            <div class="btn btn-default" onclick="saveThisPost('Blood-Help','${data.student._id}','${post._id}')">
              Save it
            </div>
          </div>
        </div>
      `;
      postsContainer.appendChild(postDiv);
    });
  } else {
    alert("Search failed.");
  }
}


//see all doners who have registered for donation
async function seeDonerList() {
//checking if blood need post are showing then it will be hidden , because now doner list will be show
const seePost = document.getElementById("seeBloodPost");
if(!seePost.classList.contains("hidden")){
  seePost.classList.add("hidden");
  document.getElementById("seePostBtn").classList.remove("bloodBtn");
  document.getElementById("seePostBtn").classList.add("border");
}
//showing the div area
const donerListShowingMainArea = document.getElementById("seeDonerList");
donerListShowingMainArea.classList.remove("hidden");
//making this button is active
document.getElementById("donorListBtn").classList.add("bloodBtn")
document.getElementById("donorListBtn").classList.remove("border")
//getting post container to add donor list boxes
const donorListContainer = document.getElementById("seeDonerListBoxContainer");
donorListContainer.innerHTML = "";

// Fetching the list of registered blood donors
try {
  const response = await fetch("/seeDonorList");
  const data = await response.json();
  if(response.ok){
    if(data.length === 0){
      donorListContainer.innerHTML = `<div class="w-full text-3xl flex justify-center text-red-700 font-bold">No student has registered for donation yet!</div>`;
      return;
    }
    data.forEach(donor =>{
      const donorDiv = document.createElement("div");
      donorDiv.className = "donorListBoxes";
      donorDiv.innerHTML = `
      <!-- donar box -->
          <div
            class="h-[250px] min-w-[200px] max-w-fit p-4 rounded-lg shadow-xl flex flex-col items-center justify-between border-2 border-red-700"
          >
            <div
              class="h-[100px] w-[100px] bg-red-600 text-white text-7xl font-bold rounded-full flex items-center justify-center"
            >
              ${donor.bloodGroup}
            </div>
            <div class="text-4xl font-bold text-center">${donor.firstName} ${donor.lastName}</div>
            <div class="font-bold">
              <p class=" overflow-hidden text-lg">
              From : ${donor.address}
              </p>
              <p class=" text-lg overflow-hidden">Email : ${donor.email}</p>
              <p class=" text-lg overflow-hidden">Phone : ${donor.phone}</p>
            </div>
            </div>
          </div>
      `
      donorListContainer.appendChild(donorDiv);
    })
  }
} catch (error) {
  alert("No blood donors found");
  window.location.href = "/bloodHelpHomePage";
}
}

// register as a blood doner
async function submitDonorRegistrationForm() {
  const bloodGroup = document.getElementById("bloodGroup").value;
  const address = document.getElementById("location").value;
  const buttonNameChanger = document.getElementById("donorRegistrationBtn");

  // if (!bloodGroup || !address) {
  //   alert("Please fill in all fields.");
  //   return;
  // }
  // if (bloodGroup === "Select your blood group") {
  //   alert("Please select a valid blood group.");
  //   return;
  // }
  // sending request from the blood page 
  const response = await fetch("/registerAsBloodDonor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bloodGroup, address }),
  });
  if (response.ok) {
    // alert("Successfully registered as a blood donor");
    // window.location.href = "/bloodHelpHomePage";
    buttonNameChanger.innerText = "Leave from Donation";
    registerAsDonerHideForm();
    seeDonerList();
  } else {
    // alert("You are already registered as a blood donor.");
    buttonNameChanger.innerText = "Join Donation";
  }
}