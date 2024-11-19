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
