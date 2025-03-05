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