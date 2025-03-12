function deleteThisNotification(notificationId){
    fetch("/deleteNotification",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ notificationId }) // Object shorthand syntax
    })
    .then(response => {
        if(response.ok) {
            location.reload(); // Page reload to update UI
        } else {
            console.error("Failed to delete notification");
        }
    })
    .catch(error => console.error("Error:", error));
}
