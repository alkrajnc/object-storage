const input = document.querySelector('input[type="file"]');
const file = input.files[0];

file instanceof File; // true
file instanceof Blob; // true

const formData = new FormData();
formData.append("myimage.png", file);
