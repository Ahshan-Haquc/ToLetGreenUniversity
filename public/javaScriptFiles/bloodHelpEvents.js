function registerAsDonerShowForm(){
    document.getElementById("donerRegisterDiv").classList.remove("hidden");
    document.getElementById("registerBg").classList.remove("hidden");
}
function registerAsDonerHideForm(){
    document.getElementById("donerRegisterDiv").classList.add("hidden");
    document.getElementById("registerBg").classList.add("hidden");
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
    try {
        const response = await fetch("/seeBloodPost");
        const data = await response.json();
        if(response.ok){
            const postShowingMainArea = document.getElementById("seeBloodPost");
            postShowingMainArea.classList.remove("hidden");
            const postsContainer = document.getElementById("seeBloodPostBoxContainer");
            postsContainer.innerHTML = ""; // Clear previous posts

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
            <div class="h-fit w-1/5 flex flex-col items-end gap-1">
              <div
                class="w-[150px] btn btn-default"
                onclick="window.location.href='/router'"
              >
                Sent Response
              </div>
              <div
                class="w-[150px] btn btn-default"
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
