const dropdown = document.querySelector(".user-dropdown");
const dropdownContent = document.querySelector(".dropdown-content");

dropdown.addEventListener("click", e => {
    console.log(e.target);

    handler(e);
});

const handler = e => {
    const isOpen = dropdown.dataset.open;
    console.log(isOpen);
    if (isOpen !== "true") {
        dropdown.dataset.open = true;
        dropdownContent.style.display = "block";
        dropdownContent.classList.add("fadeIn");
    } else {
        dropdown.dataset.open = false;
        dropdownContent.classList.remove("fadeIn");
        dropdownContent.style.display = "none";
    }
};
