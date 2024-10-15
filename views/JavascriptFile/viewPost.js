// <!-- ***************************Nadib Rana************************* --> 
        const faBars = document.querySelector('.fa-bars');
        const navStacked = document.querySelector('.nav-stacked');

        // Function to toggle the nav menu
        function toggleNav() {
            navStacked.classList.toggle('show');
        }

        // Click event for fa-bars
        faBars.addEventListener('click', toggleNav);

        // Keeping nav-stacked visible while hovering over it
        navStacked.addEventListener('mouseenter', () => {
            navStacked.classList.add('show');
        });

        navStacked.addEventListener('mouseleave', () => {
            navStacked.classList.remove('show');
        });
    
