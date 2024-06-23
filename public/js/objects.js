const viewButtons = document.querySelectorAll(".view-object");
const overlay = document.querySelector("#overlay");
const overlayContent = document.querySelector("#overlay-content");
const overlayBackdrop = document.querySelector("#overlay-backdrop");
const overlayClose = document.querySelector("#overlay-close");
viewButtons.forEach(button => {
    button.addEventListener("click", e => {
        const url = e.target.dataset.url;
        overlay.style.display = "flex";
        overlayBackdrop.style.display = "block";
        overlayContent.innerHTML = `<img src=${url}/>`;
    });
});

overlayClose.addEventListener("click", () => {
    overlay.style.display = "none";
    overlayBackdrop.style.display = "none";
    overlayContent.innerHTML = "";
});
