
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
    const response = await fetch("/notification",{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({requestType,pageName,userId,postBy,postId})
    });
  
    const data =await response.json();
  
    if(data.requestSent==="yes"){
      if(pageName==="Blood-Help"){
        document.getElementById(`confirmRequestSeatButton${postId}`).innerText="Responsed";
        return;
      }
      document.getElementById(`confirmRequestSeatButton${postId}`).innerText="Request sented";
    }else if(data.requestSent==="no"){
      if(pageName==="Blood-Help"){
        document.getElementById(`confirmRequestSeatButton${postId}`).innerText="Response for Donation";
        return;
      }
      document.getElementById(`confirmRequestSeatButton${postId}`).innerText="Request for Confirm";
    }else{
        alert("Request Error");
  }
  
  }