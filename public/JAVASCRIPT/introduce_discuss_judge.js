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
  list,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { convertUTCTimeVietnamTime, vietnameseToSlug } from "./utils.js";
let displayData = document.getElementById("display-data");
let posterSection = document.getElementById("poster");
let contentMenuLinks = document.querySelector(".content-menu-links");
let commentArea = document.getElementById("comment-area");
let submitComment = document.getElementById("submit-comment");
let commentsSection = document.getElementById("comments");

//firebase setup
const storage = getStorage(app);
const storage_ref = ref(storage);
let folder_ref;

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

function generateComment(comment, timeCreated) {
  const div = document.createElement("div");
  div.classList.add("comment");

  const commentText = document.createElement("p");
  commentText.textContent = comment;
  div.appendChild(commentText);

  const commentTime = document.createElement("p");
  commentTime.textContent = convertUTCTimeVietnamTime(timeCreated);
  div.appendChild(commentTime);

  return div;
}

async function initialize() {
  try {
    // Fetch the data
    const response = await fetch("JSON/infor_save.json");
    const data = await response.json();

    const q = new URLSearchParams(window.location.search).get("q");

    let temporaryContainer = document.createElement("div");
    contentMenuLinks.innerHTML = "";
    for (const [key, value] of Object.entries(data)) {
      if (q === vietnameseToSlug(key)) {
        folder_ref = ref(storage_ref, `${key}`);

        const title = document.getElementById("title");
        title.textContent = key;

        for (const [key1, value1] of Object.entries(value)) {
          if (key1 === "briefDesc") continue;

          if (key1 === "poster_link") {
            posterSection.src = value1;
            continue;
          }

          if (key1 !== "Lời kết") {
            let div = generateInfoHeader(key1, value1);
            temporaryContainer.appendChild(div);
            generateContentMenu(key1);
          }

          if (typeof value1 == "object") {
            setTimeout(() => {
              let contentElement = document.getElementById(
                `${vietnameseToSlug(key1)}-content`
              );

              for (const [key2, value2] of Object.entries(value1)) {
                let div = generateInfoContent(key2, value2);
                contentElement.appendChild(div);
              }
            }, 0);
          }
        }
      }
    }

    displayData.innerHTML = temporaryContainer.innerHTML;
    showImage();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

// Call the initialize function
await initialize();

submitComment.addEventListener("click", async function () {
  console.log("submit comment");
  const res = await listAll(folder_ref);
  let inputComment = document.getElementById("input-comment");
  let file_ref = ref(folder_ref, `comment(${res.items.length})`);
  if (inputComment.value != "") {
    await uploadString(file_ref, inputComment.value).then((snapshot) => {
      const comment = generateComment(
        inputComment.value,
        snapshot.metadata.timeCreated
      );
      commentsSection.appendChild(comment);
    });
  }
});

async function reload_comment_section() {
  try {
    const res = await list(folder_ref, { maxResults: 100 });

    let temporaryContainer = document.createElement("div");
    for (const data_package of res.items) {
      try {
        const url = await getDownloadURL(data_package);
        const data = await fetch(url);
        console.log(data.url.split("%2F").pop().split("?")[0]);
        const response = await data.blob();
        const content = await response.text();

        const metadata = await getMetadata(data_package);

        const comment = generateComment(content, metadata.timeCreated);
        temporaryContainer.appendChild(comment);
      } catch (error) {
        console.error("Error loading comment:", error);
      }
    }

    commentsSection.innerHTML = temporaryContainer.innerHTML;
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
  }, 10); // Delay 10ms to wait for the image to be loaded
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

// highlight the content menu link when scrolling
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
