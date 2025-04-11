
async function saveThisPost(postName,userId,postId){
    const response = await fetch('/savePost',{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({postName,userId,postId})
    })

    const data = await response.json();

    if(data.saved==="yes"){
        document.getElementById(`saveButton${postId}`).innerText="Saved";
    }else{
        document.getElementById(`saveButton${postId}`).innerText="Save it";
    }
}


//this is for sending request for confirm seat for confirm tolet page
async function confirmRequestSent(requestType,pageName,userId,postBy,postId){
    console.log("requestType:", requestType);
console.log("pageName:", pageName);
console.log("userId:", userId);
console.log("postBy:", postBy);
console.log("postId:", postId);
    const response = await fetch("/notification",{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({requestType,pageName,userId,postBy,postId})
    });
  
    const data =await response.json();
  
    if(data.requestSent==="yes"){
      document.getElementById(`confirmRequestSeatButton${postId}`).innerText="Request sented";
  }else if(data.requestSent==="no"){
      // document.getElementById(`confirmRequestSeatButton${postId}`).innerText="Request for Confirm";
      alert("You have already requested for this post.");
  }else{
    alert("Request Error");
  }
  
  }