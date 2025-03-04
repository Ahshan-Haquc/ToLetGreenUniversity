async function saveThisPost(postName,userId,postId){
    const response = await fetch('/savePost',{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({postName,userId,postId})
    })

    const data = await response.json();
    console.log(data);

    alert("saved");
}