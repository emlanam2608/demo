const hamburger = document.getElementById("hamburger");
hamburger.addEventListener("click", function () {
  const menu = document.getElementById("m-menu");
  menu.style.left = "0";
});

const closeMenu = document.getElementById("m-menu-close");
closeMenu.addEventListener("click", function () {
  const menu = document.getElementById("m-menu");
  menu.style.left = "-100%";
});

const navBar = document.getElementById("nav-bar");
// change the background color of the navbar when the user scrolls
window.addEventListener("scroll", function () {
  console.log(window.scrollY);
  if (window.scrollY > 800) {
    navBar.style.backgroundColor = "white";
    navBar.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    navBar.style.color = "black";
    navBar.style.transition = "0.2s";
  } else {
    navBar.style.backgroundColor = "transparent";
    navBar.style.boxShadow = "none";
    navBar.style.color = "white";
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("JSON/infor_save.json");
  const data = await response.json();

  const generatePreviewBlock = (imageSrc, desc) => {
    const previewBlock = document.createElement("div");
    previewBlock.classList.add("preview-block");

    const image = document.createElement("img");
    image.src = imageSrc;
    image.classList.add("preview-image");
    previewBlock.appendChild(image);

    const description = document.createElement("p");
    description.textContent = desc;
    description.classList.add("preview-description");
    previewBlock.appendChild(description);

    return previewBlock;
  };

  const previewContainer = document.getElementById("preview-container");
  const previewBlocks = Object.entries(data).map(([key, value]) =>
    generatePreviewBlock(value.poster_link, value.briefDesc)
  );
  previewBlocks.forEach((block) => previewContainer.appendChild(block));
});
