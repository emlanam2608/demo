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

// Utils
// Convert vietnamese to slug
function vietnameseToSlug(str) {
  const vietnameseMap = {
    à: "a",
    á: "a",
    ạ: "a",
    ả: "a",
    ã: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ậ: "a",
    ẩ: "a",
    ẫ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ặ: "a",
    ẳ: "a",
    ẵ: "a",
    è: "e",
    é: "e",
    ẹ: "e",
    ẻ: "e",
    ẽ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ệ: "e",
    ể: "e",
    ễ: "e",
    ì: "i",
    í: "i",
    ị: "i",
    ỉ: "i",
    ĩ: "i",
    ò: "o",
    ó: "o",
    ọ: "o",
    ỏ: "o",
    õ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ộ: "o",
    ổ: "o",
    ỗ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ợ: "o",
    ở: "o",
    ỡ: "o",
    ù: "u",
    ú: "u",
    ụ: "u",
    ủ: "u",
    ũ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ự: "u",
    ử: "u",
    ữ: "u",
    ỳ: "y",
    ý: "y",
    ỵ: "y",
    ỷ: "y",
    ỹ: "y",
    đ: "d",
    À: "A",
    Á: "A",
    Ạ: "A",
    Ả: "A",
    Ã: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ậ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ặ: "A",
    Ẳ: "A",
    Ẵ: "A",
    È: "E",
    É: "E",
    Ẹ: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ệ: "E",
    Ể: "E",
    Ễ: "E",
    Ì: "I",
    Í: "I",
    Ị: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ò: "O",
    Ó: "O",
    Ọ: "O",
    Ỏ: "O",
    Õ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ộ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ợ: "O",
    Ở: "O",
    Ỡ: "O",
    Ù: "U",
    Ú: "U",
    Ụ: "U",
    Ủ: "U",
    Ũ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ự: "U",
    Ử: "U",
    Ữ: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỵ: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Đ: "D",
  };

  // Normalize the string and replace Vietnamese characters
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str
    .split("")
    .map((char) => vietnameseMap[char] || char)
    .join("");

  // Remove non-alphanumeric characters (except for hyphens), convert to lowercase, and replace spaces with hyphens
  str = str
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return str;
}
