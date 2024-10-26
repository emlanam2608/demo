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
let choose_data = document.getElementById("choose-data");
let display_data = document.getElementById("display-data");
let poster_section = document.getElementById("poster");
let contentMenu = document.querySelector(".content-menu");
let contentMenuLinks = document.querySelector(".content-menu-links");
let state = undefined;
let comment_area = document.getElementById("comment_area");
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
  h2Element.id = key.replace(/\s+/g, "");
  h2Element.textContent = key;

  let contentElement;
  if (typeof value == "string") {
    contentElement = document.createElement("p");
    contentElement.textContent = value;
    contentElement.id = key.replace(/\s+/g, "");
    contentElement.classList.add("details-section");
  } else {
    contentElement = document.createElement("div");
    contentElement.id = key.replace(/\s+/g, "") + "-content";
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
  }
  if (key == "image_link") {
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
  link.href = "#" + key.replace(/\s+/g, "");
  contentMenuLinks.appendChild(link);
}

async function initialize() {
  try {
    // Fetch the data
    const response = await fetch("JSON/infor_save.json");
    const data = await response.json();

    choose_data.addEventListener("change", async function () {
      comment_area.style.display = "block";
      feature_image.style.display = "block";
      contentMenu.style.display = "block";
      contentMenuLinks.innerHTML = "";

      folder_ref = ref(storage_ref, `${choose_data.value}`);

      let temporary_container = document.createElement("div");
      await Object.entries(data[choose_data.value][0]).forEach(
        ([key, value]) => {
          if (key == "poster_link") {
            poster_section.src = value;
            return;
          }

          if (key != "Lời kết") {
            let div = generateInfoHeader(key, value);
            temporary_container.appendChild(div);

            generateContentMenu(key);
          }

          if (typeof value == "object") {
            setTimeout(() => {
              let contentElement = document.getElementById(
                `${key.replace(/\s+/g, "")}-content`
              );

              Object.entries(value).forEach(([key1, value1]) => {
                let div = generateInfoContent(key1, value1);
                contentElement.appendChild(div);
              });
            }, 0);
          }
        }
      );

      display_data.innerHTML = temporary_container.innerHTML;
      showImage();
    });
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

// Call the initialize function

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
  await observeElement(comment_area);
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
  //await waitForEvent(choose_data, "change");
  console.log("Sự kiện change đã được kích hoạt!");
  setTimeout(() => {
    let list_img_can_be_shown = document.querySelectorAll(".content-image");
    list_img_can_be_shown.forEach((img) => {
      img.addEventListener("click", function () {
        console.log(img.src);
        overlay.classList.add("active");
        overlay_video.src = img.src;
      });
    });
    console.log(list_img_can_be_shown);
  }, 10); // Delay 100ms
  // Thực hiện các hành động khác ở đây...
}
