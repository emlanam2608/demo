import { vietnameseToSlug } from "./utils.js";

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
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html" ||
    window.location.pathname.endsWith("/index.html")
  ) {
    if (window.scrollY > 700) {
      navBar.style.backgroundColor = "white";
      navBar.style.boxShadow = "0 4px 4px rgba(0, 0, 0, 0.1)";
      navBar.style.color = "black";
      navBar.style.transition = "0.3s";
    } else {
      navBar.style.backgroundColor = "transparent";
      navBar.style.boxShadow = "none";
      navBar.style.color = "white";
    }
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("JSON/infor_save.json");
  const data = await response.json();

  // dropdown menu in the navbar
  const dropdown = document
    .getElementById("nav-bar")
    .querySelector(".dropdown-content");
  const dropdownMobile = document
    .getElementById("m-menu")
    .querySelector(".dropdown-content");

  Object.keys(data).forEach((key) => {
    const link = document.createElement("a");
    link.textContent = key;
    link.href = "lang-nghe.html?q=" + vietnameseToSlug(key);
    dropdown.appendChild(link);
    dropdownMobile.appendChild(link.cloneNode(true));
  });

  const dropbtnMobile = document
    .getElementById("m-menu")
    .querySelector(".dropbtn");
  dropbtnMobile.addEventListener("click", function () {
    const dropdownContent = document
      .getElementById("m-menu")
      .querySelector(".dropdown-content");
    const postfix = dropbtnMobile.querySelector("p");

    if (dropdownContent.classList.contains("expanded")) {
      dropdownContent.classList.remove("expanded");
      postfix.style.rotate = "0deg";
    } else {
      dropdownContent.classList.add("expanded");
      postfix.style.rotate = "-180deg";
    }
  });

  // if homepage
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html" ||
    window.location.pathname.endsWith("/index.html")
  ) {
    const generatePreviewBlock = (imageSrc, desc, key) => {
      const previewBlock = document.createElement("div");
      previewBlock.classList.add("preview-block");

      const link = document.createElement("a");
      link.href = "lang-nghe.html?q=" + vietnameseToSlug(key);
      link.classList.add("preview-image");
      const image = document.createElement("img");
      image.src = imageSrc;
      link.appendChild(image);
      previewBlock.appendChild(link);

      const descDiv = document.createElement("div");
      previewBlock.appendChild(descDiv);

      const description = document.createElement("p");
      description.textContent = desc;
      descDiv.appendChild(description);

      const viewMore = document.createElement("a");
      viewMore.textContent = "Tìm hiểu thêm";
      viewMore.href = "lang-nghe.html?q=" + vietnameseToSlug(key);
      viewMore.classList.add("view-more");
      descDiv.appendChild(viewMore);

      return previewBlock;
    };

    const previewContainer = document.getElementById("preview-container");
    const previewBlocks = Object.entries(data).map(([key, value]) =>
      generatePreviewBlock(value.poster_link, value.briefDesc, key)
    );
    previewBlocks.forEach((block) => previewContainer.appendChild(block));
  }
});
