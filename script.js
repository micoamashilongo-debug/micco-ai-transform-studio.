
const imageInput = document.getElementById("images");
const preview = document.getElementById("preview");
const description = document.getElementById("description");
const counter = document.getElementById("counter");
const message = document.getElementById("message");

let selectedImages = [];

imageInput.addEventListener("change", function() {
  const files = Array.from(this.files);

  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;

    selectedImages.push({
      file: file,
      url: URL.createObjectURL(file)
    });
  });

  renderImages();
  this.value = "";
});

function renderImages() {
  preview.innerHTML = "";

  selectedImages.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "image-card";

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.file.name;

    const remove = document.createElement("button");
    remove.textContent = "×";
    remove.type = "button";
    remove.addEventListener("click", () => {
      URL.revokeObjectURL(item.url);
      selectedImages.splice(index, 1);
      renderImages();
    });

    card.append(img, remove);
    preview.appendChild(card);
  });
}

description.addEventListener("input", function() {
  counter.textContent = this.value.length + " / 2500";
});

document.getElementById("prepare").addEventListener("click", function() {

  if (selectedImages.length === 0) {
    showMessage("Please upload at least one picture.");
    return;
  }

  if (!description.value.trim()) {
    showMessage("Please describe the transformation you want.");
    description.focus();
    return;
  }

  const project = {
    projectName: "MICCO AI Transform Studio",
    dateCreated: new Date().toISOString(),
    pictures: selectedImages.map(item => item.file.name),
    instructions: description.value.trim(),
    style: document.getElementById("style").value,
    duration: document.getElementById("duration").value
  };

  const file = new Blob(
    [JSON.stringify(project, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "micco-video-project.json";
  link.click();

  URL.revokeObjectURL(url);

  showMessage(
    "Your project brief has been prepared and downloaded. Actual AI video generation is not connected yet. We will add the video-generation service separately."
  );
});

function showMessage(text) {
  message.hidden = false;
  message.textContent = text;
}
