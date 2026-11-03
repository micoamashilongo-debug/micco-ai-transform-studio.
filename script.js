
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const instructions = document.getElementById("instructions");
const charCount = document.getElementById("charCount");
const styleSelect = document.getElementById("style");
const generateBtn = document.getElementById("generateBtn");
const statusMessage = document.getElementById("status");
const results = document.getElementById("results");

let selectedImages = [];

imageUpload.addEventListener("change", function () {
  const files = Array.from(this.files);

  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;

    if (selectedImages.some(item => item.name === file.name && item.size === file.size)) {
      return;
    }

    selectedImages.push(file);
  });

  renderImages();
  imageUpload.value = "";
});

function renderImages() {
  imagePreview.innerHTML = "";

  selectedImages.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "preview-item";

    const image = document.createElement("img");
    const imageUrl = URL.createObjectURL(file);
    image.src = imageUrl;
    image.alt = file.name;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", "Remove " + file.name);

    removeButton.addEventListener("click", function () {
      URL.revokeObjectURL(imageUrl);
      selectedImages.splice(index, 1);
      renderImages();
    });

    item.appendChild(image);
    item.appendChild(removeButton);
    imagePreview.appendChild(item);
  });
}

instructions.addEventListener("input", function () {
  charCount.textContent = instructions.value.length;
});

generateBtn.addEventListener("click", async function () {
  const prompt = instructions.value.trim();

  if (selectedImages.length === 0) {
    statusMessage.textContent = "Please upload at least one image.";
    return;
  }

  if (!prompt) {
    statusMessage.textContent = "Please describe how you want your image transformed.";
    instructions.focus();
    return;
  }

  const project = {
    projectName: "MICCO AI Transform Studio",
    createdAt: new Date().toISOString(),
    imageCount: selectedImages.length,
    images: selectedImages.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    })),
    instructions: prompt,
    style: styleSelect.value
  };

  const file = new Blob(
    [JSON.stringify(project, null, 2)],
    { type: "application/json" }
  );

  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = "micco-image-project.json";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);

  results.innerHTML = `
    <h2>Project Prepared Successfully</h2>
    <p>Your image project details have been downloaded.</p>
    <p>Images selected: ${selectedImages.length}</p>
    <p>Selected style: ${escapeHTML(styleSelect.value)}</p>
    <p>AI image generation has not yet been connected.</p>
  `;

  statusMessage.textContent = "Your project details are ready!";
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}
