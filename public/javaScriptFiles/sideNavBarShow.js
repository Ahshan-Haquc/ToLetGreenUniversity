// //eita ami nije korcilam logic baniye
// let flag = 0; // Declare `flag` outside the function
// function showNavBar() {
//     console.log("working");
//     const sideNavBar = document.querySelector("#sideNavBar");
//     console.log(sideNavBar);
//     if (flag === 0) {
//         sideNavBar.classList.add("sideNavVisible");
//         flag = 1; // Update the flag to 1
//     } else {
//         sideNavBar.classList.remove("sideNavVisible");
//         flag = 0; // Reset the flag to 0
//     }
// }


    function showNavBar() {
        const menuButton = document.querySelector("#menuButton")
        const sideNavBar = document.querySelector("#sideNavBar");
        const overlay = document.querySelector("#overlaySideNav");

        menuButton.classList.toggle("rotate");
        console.log(menuButton);
        
        sideNavBar.classList.toggle("sideNavVisible"); // Toggles the class on/off

        overlay.classList.toggle("overlaySideNavVisible");
    }

