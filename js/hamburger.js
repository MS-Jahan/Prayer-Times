document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");
    const searchBar = document.getElementById("searchBar");

    let sidebarOpen = false;

    hamburgerBtn.addEventListener("click", function () {
        sidebar.classList.toggle("-translate-x-full");
        sidebarOpen = !sidebarOpen;

        if (sidebarOpen) {
            searchBar.style.left = "17rem"; // 16rem (sidebar width) + 1rem padding
        } else {
            searchBar.style.left = "5rem"; // Reset to original position
        }
    });
});