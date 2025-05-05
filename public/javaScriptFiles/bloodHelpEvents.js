//when the blood page is loaded then this function will be called so that the page do not look empty
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
        if(response.ok){  
          if(data.length === 0){
            donorListContainer.innerHTML = `<div class="w-full text-3xl flex justify-center text-red-700 font-bold">No post available !</div>`;
            return;
          }       
            data.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                const formattedDate = new Date(post.dateNeeded).toISOString().split('T')[0];
                postDiv.innerHTML = `
                    <!-- post box -->
          <div class="h-fit w-full p-4 border-2 border-red-700 rounded-xl flex">
            <div class="h-fit w-4/5">
              <div class="text-3xl text-red-700 font-bold">
                ${post.title}
              </div>
              <div class="mt-2 text-3xl">
                ${post.bloodGroup} blood need on ${formattedDate} at ${post.location}.
                Contact : ${post.contact}
              </div>
              <div class="">
                <span
                  class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer"
                  >Additional Note</span
                >
                |
                <span
                  class="text-xl hover:text-blue-800 hover:underline hover:cursor-pointer"
                  >User Information</span
                >
              </div>
            </div>
            <!-- buttons  -->
            <div class="h-fit w-1/5 flex flex-col items-end gap-3">
              <div
                class=" btn btn-info"
                onclick="window.location.href='/router'"
              >
                Sent Response
              </div>
              <div
                class=" btn btn-default"
                onclick="window.location.href='/router'"
              >
                Save it
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
            class="h-[250px] w-[200px] p-3 rounded-lg shadow-xl flex flex-col items-center justify-between"
          >
            <div
              class="h-[100px] w-[100px] bg-red-600 text-white text-7xl font-bold rounded-full flex items-center justify-center"
            >
              ${donor.bloodGroup}
            </div>
            <div>
              <div class="text-4xl font-bold text-center">${donor.firstName} ${donor.lastName}</div>
              <p class="text-center overflow-hidden text-lg">
              From : ${donor.address}
              </p>
              <p class="text-center text-lg overflow-hidden">Email : ${donor.email}</p>
            </div>
            <div class="text-center">
              <button
                class="  hover:bg-black hover:text-white font-regular px-6 py-2 rounded-2xl shadow" style="border:1px solid red;"
              >
                Request for Donate
              </button>
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