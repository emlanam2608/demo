import { app } from "./firebase_config.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadString,
  getMetadata,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { vietnameseToSlug } from "./utils.js";
let choose_data = document.getElementById("choose-data");
let display_data = document.getElementById("display-data");
let poster_section = document.getElementById("poster");
let contentMenu = document.querySelector(".content-menu");
let contentMenuLinks = document.querySelector(".content-menu-links");
let state = undefined;
let commentArea = document.getElementById("comment-area");
let feature_image = document.getElementById("feature-image");
let submit_comment = document.getElementById("submit_comment");
//firebase setup
const storage = getStorage(app);
const storage_ref = ref(storage);
let folder_ref;
//choose-langue
// cors
const url = "https://cors-anywhere.herokuapp.com/https://example.com/api";
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

//app.options('*', cors());
// Function to handle the data and set up event listeners

// setup check for eventListener
async function waitForEvent(element, event) {
  return new Promise((resolve) => {
    element.addEventListener(event, resolve, { once: true });
  });
}

function generateInfoHeader(key, value) {
  const h2Element = document.createElement("h2");
  const resultElement = document.createElement("div");

  h2Element.classList.add("info_header");
  h2Element.id = vietnameseToSlug(key);
  h2Element.textContent = key;

  let contentElement;
  if (typeof value == "string") {
    contentElement = document.createElement("p");
    contentElement.textContent = value;
    contentElement.id = vietnameseToSlug(key) + "-content";
    contentElement.classList.add("details-section");
  } else {
    contentElement = document.createElement("div");
    contentElement.id = vietnameseToSlug(key) + "-content";
  }

  resultElement.classList.add("info_section");
  resultElement.appendChild(h2Element);
  resultElement.appendChild(contentElement);

  return resultElement;
}

function generateInfoContent(key, value) {
  const div = document.createElement("div");
  if (key != "image_link") {
    const h3 = document.createElement("h3");
    h3.textContent = key;
    div.appendChild(h3);
    const p = document.createElement("p");
    p.textContent = value;
    div.appendChild(p);
    div.classList.add("details-section");
  } else {
    const img = document.createElement("img");
    img.src = value;
    img.classList.add("content-image");
    div.appendChild(img);
    div.classList.add("image-section");
  }

  return div;
}

function generateContentMenu(key) {
  const link = document.createElement("a");
  link.textContent = key;
  link.href = "#" + vietnameseToSlug(key);
  contentMenuLinks.appendChild(link);
}

async function initialize() {
  try {
    // Fetch the data
    const response = await fetch("JSON/infor_save.json");
    const data = await response.json();

    const q = new URLSearchParams(window.location.search).get("q");

    // folder_ref = ref(storage_ref, `${choose_data.value}`);

    let temporary_container = document.createElement("div");
    contentMenuLinks.innerHTML = "";
    Object.entries(data).forEach(([key, value]) => {
      if (q === vietnameseToSlug(key)) {
        const title = document.getElementById("title");
        title.textContent = key;

        Object.entries(value).forEach(([key1, value1]) => {
          if (key1 === "briefDesc") return;

          if (key1 === "poster_link") {
            poster_section.src = value1;
            return;
          }

          if (key1 !== "Lời kết") {
            let div = generateInfoHeader(key1, value1);
            temporary_container.appendChild(div);
            generateContentMenu(key1);
          }

          if (typeof value1 == "object") {
            setTimeout(() => {
              let contentElement = document.getElementById(
                `${vietnameseToSlug(key1)}-content`
              );

              Object.entries(value1).forEach(([key2, value2]) => {
                let div = generateInfoContent(key2, value2);
                contentElement.appendChild(div);
              });
            }, 0);
          }
        });
      }
    });

    display_data.innerHTML = temporary_container.innerHTML;
    showImage();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

// Call the initialize function
await initialize();

//comment feature
function observeElement(element) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "style" &&
          element.style.display === "block"
        ) {
          observer.disconnect();
          resolve();
        }
      });
    });

    observer.observe(element, { attributes: true });
  });
}

async function comment() {
  await observeElement(commentArea);
  submit_comment.addEventListener("click", function () {
    async function upload_comment() {
      const res = await listAll(folder_ref);
      let input_comment = document.getElementById("input_comment");
      let file_ref = ref(folder_ref, `comment(${res.items.length})`);
      if (input_comment.value != "") {
        await uploadString(file_ref, input_comment.value).then((snapshot) => {
          $("#comment").append("<p>" + input_comment.value + "</p>");
        });
      }
    }

    upload_comment();
  });
}

comment();
let comment_section = document.getElementById("comment");
async function reload_comment_section() {
  try {
    await initialize();
    choose_data.addEventListener("change", async function () {
      const res = await listAll(folder_ref);

      let temporary_container = document.createElement("div");
      async function load_comment() {
        for (const data_package of res.items) {
          let temporary_element = document.createElement("div");

          try {
            const url = await getDownloadURL(data_package);
            const data = await fetch(url);
            const response = await data.blob();
            const content = await response.text();

            temporary_element.innerHTML = `<p>${content}</p>`;
            temporary_container.appendChild(temporary_element);
          } catch (error) {
            console.error("Error loading comment:", error);
          }
        }
      }

      await load_comment();

      comment_section.innerHTML = temporary_container.innerHTML;
    });
  } catch (error) {
    console.error("Error listing items:", error);
  }
}
reload_comment_section();
let myVideo = document.getElementById("myVideo");
let overlay_video = document.getElementById("overlay_video");
const overlay = document.getElementById("overlay");
myVideo.addEventListener("click", function () {
  overlay.classList.add("active");
});
overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
});

async function showImage() {
  setTimeout(() => {
    let list_img_can_be_shown = document.querySelectorAll(".content-image");
    list_img_can_be_shown.forEach((img) => {
      img.addEventListener("click", function () {
        overlay.classList.add("active");
        overlay_video.src = img.src;
      });
    });
  }, 10); // Delay 10ms
}

// scroll to section when click on content menu with smooth behavior and offset top
contentMenuLinks.addEventListener("click", function (e) {
  e.preventDefault();

  document.querySelectorAll(".navbar li a").forEach((item) => {
    item.classList.remove("active");
  });

  const target = e.target;

  target.classList.add("active");

  const id = target.getAttribute("href").substring(1);
  console.log(id);
  const element = document.getElementById(id);
  console.log(element);
  const offsetTop = 100;
  window.scrollTo({
    behavior: "smooth",
    top: element.offsetTop - offsetTop,
  });
});

window.addEventListener("scroll", function () {
  const headers = document.querySelectorAll(".info_header");
  const contentMenuLinks = document.querySelectorAll(".content-menu-links a");

  headers.forEach((header, index) => {
    const rect = header.getBoundingClientRect();

    if (rect.top >= 0 && rect.top < this.window.innerHeight / 2) {
      const id = header.getAttribute("id");
      contentMenuLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
});
