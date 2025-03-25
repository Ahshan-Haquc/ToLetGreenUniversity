// functions for showing quick find box on click 
function showQuickFindBox(){
    const item = document.getElementById("quickFindBox");
    item.classList.remove("hidden");
}
function hideQuickFindBox(){
    const item = document.getElementById("quickFindBox");
    item.classList.add("hidden");
}