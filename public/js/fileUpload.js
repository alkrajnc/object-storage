const input = document.querySelector('input[type="file"]');
const fileList = document.querySelector(".file-list");
const files = input.files;

files instanceof File; // true
files instanceof Blob; // true

const pickFileIcon = mimetype => {
    if (mimetype.includes("image")) {
        return "/assets/icons/image.svg";
    } else if (mimetype.includes("video")) {
        return "/assets/icons/video.svg";
    } else {
        return "/assets/icons/file.svg";
    }
};

input.addEventListener("change", e => {
    Array.from(e.target.files).forEach((object, idx) => {
        const fileElement = document.createElement("div");
        const file = String.raw`
          <div class="file-item">
            <div class="horizontal">
              <img src="${pickFileIcon(object.type)}" class="file-icon" />
              <div style="display:flex; flex-direction: column; gap: 0.75rem;">
                <h4>${object.name}</h4>
                <p>${(object.size / 1000 / 1000).toFixed(3)} MB</p>
              </div>
            </div>
            <div>
              <button onclick="">Remove</button>
            </div>
          </div>
      `;
        fileElement.innerHTML = file;
        fileList.appendChild(fileElement);
    });
});

const removeFile = idx => {
    files.splice(idx, 1);
    console.log(files);
};

console.log(files);
