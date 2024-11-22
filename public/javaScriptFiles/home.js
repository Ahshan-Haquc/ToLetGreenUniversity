function setVisibility(boxId, styleId, styleIdOfText) {
    const node0 = document.querySelector(`#${boxId}`);
    node0.classList.add("box");

    const node1 = document.querySelector(`#${styleId}`);
    node1.classList.add("show"); // Add 'show' class for smooth fade-in

    const nodeText = document.querySelector(`#${styleIdOfText}`);
    nodeText.classList.remove("changeTextPosition");
}

function unsetVisibility(boxId, styleId, styleIdOfText) {
    const node0 = document.querySelector(`#${boxId}`);
    node0.classList.remove("box");

    const node1 = document.querySelector(`#${styleId}`);
    node1.classList.remove("show"); // Remove 'show' class for smooth fade-out

    const nodeText = document.querySelector(`#${styleIdOfText}`);
    nodeText.classList.add("changeTextPosition");
}


//this is for sending email
document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const userEmail = e.target.userEmail.value;
    const userMessage = e.target.userMessage.value;

    try {
        const response = await fetch("/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail, userMessage }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Email sent successfull");
            document.getElementById("form-response").textContent = "Your message has been sent!";
        } else {
            console.log("Email sent unsuccessfull");
            document.getElementById("form-response").textContent = "Failed to send message. Please try again.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("form-response").textContent = "An error occurred. Please try again.";
    }
});
