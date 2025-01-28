 // Array of image URLs
 // roomImage[] ei array ta er ejs file theke JSON.stringify kore rakhci ejs file a e. r oi arraytai ekhane dirrect use kora jabe akn
let currentIndex = 0; // Current index of the image
console.log("working here");

// Function to change the image
function changeImage(direction) {
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % roomImages.length; // Increment index and loop
  } else if (direction === "back") {
    currentIndex = (currentIndex - 1 + roomImages.length) % roomImages.length; // Decrement index and loop
  }

  // Update the displayed image and index count
  document.getElementById("displayImage").src = `/${roomImages[currentIndex]}`;

  document.getElementById("currentImageIndex").innerText = `${currentIndex + 1}/${roomImages.length}`;
}


// -----------------------
// doing full screen and cancelling full screen of showing picture 
// this is for full screen picture showing
function fullScreen(){
    const fullScreen = document.getElementById("fullScreen");
    document.getElementById("displayFullScreenImage").src = `/${roomImages[currentIndex]}`;

    fullScreen.classList.remove("makeUnvisible");
    fullScreen.classList.add("makeVisible");
}

// this is for cancelling full screen picture showing
function cancelFullScreen(){
  const fullScreen = document.getElementById("fullScreen");

  fullScreen.classList.remove("makeVisible");
  fullScreen.classList.add("makeUnvisible");
}


// --------------------- copy text
function copyText(text){
  const googleMapLocation = document.getElementById('copyGoogleMapLink');
  const emailId = document.getElementById('copyEmailId');
  const phoneNumber = document.getElementById('copyPhoneNumber');

  //creating temporary text area
  const tempTextarea = document.createElement('input');

  //checking where click occured
  if(text==="googleMapLink"){
    tempTextarea.value = googleMapLocation.textContent;
  }else if(text==="emailId"){
    tempTextarea.value = emailId.textContent;
  }else if(text==="phoneNumber"){
    tempTextarea.value = phoneNumber.textContent;
  }

  
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand('copy');

  // Remove the temporary textarea
  document.body.removeChild(tempTextarea);

  alert("Copied");
}