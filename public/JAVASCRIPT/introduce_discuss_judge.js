import { vietnameseToSlug, convertTimeToDuration } from "./utils.js";
import SupabaseClient from "./supabase.js";

const supabaseClient = new SupabaseClient();

let displayData = document.getElementById("display-data");
let posterSection = document.getElementById("poster");
let contentMenuLinks = document.querySelector(".content-menu-links");

let commentsSection = document.getElementById("comments");

const q = new URLSearchParams(window.location.search).get("q");

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
  commentTime.textContent = convertTimeToDuration(timeCreated);
  div.appendChild(commentTime);

  return div;
}

async function initialize() {
  try {
    // Fetch the data
    const response = await fetch("JSON/infor_save.json");
    const data = await response.json();

    let temporaryContainer = document.createElement("div");
    contentMenuLinks.innerHTML = "";
    for (const [key, value] of Object.entries(data)) {
      if (q === vietnameseToSlug(key)) {
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

const submitComment = document.getElementById("submit-comment");
submitComment.addEventListener("click", async function () {
  let inputComment = document.getElementById("input-comment");
  if (inputComment.value != "") {
    try {
      const res = await supabaseClient.postComment({
        comment: inputComment.value,
        blog_name: q,
      });

      if (res.status === 201) {
        const date = new Date().toISOString();
        commentsList.unshift({
          comment: inputComment.value,
          created_at: date,
          blog_name: q,
        });
        const newComment = generateComment(inputComment.value, date);
        commentsSection.prepend(newComment);

        inputComment.value = "";

        const noComment = document.getElementById("no-comment");
        if (noComment) {
          noComment.remove();
        }
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }
});

const commentsList = [];
async function loadComments() {
  try {
    console.log(commentsList.length);
    let temporaryContainer = document.createElement("div");
    const res = await supabaseClient.getComments({
      limit: 10,
      offset: commentsList.length,
      blog_name: q,
    });
    const comments = await res.json();

    commentsList.push(...comments);

    commentsList.forEach((comment) => {
      const commentElement = generateComment(
        comment.comment,
        comment.created_at
      );
      temporaryContainer.appendChild(commentElement);
    });

    commentsSection.innerHTML = temporaryContainer.innerHTML;

    if (comments.length === 0) {
      const noComment = document.createElement("p");
      noComment.setAttribute("id", "no-comment");
      noComment.textContent = "Không có bình luận nào";
      commentsSection.appendChild(noComment);
      loadMoreCommentsBtn.style.display = "none";
    } else if (comments.length < 10) {
      loadMoreCommentsBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error listing items:", error);
  }
}

const loadMoreCommentsBtn = document.getElementById("load-more-comments");
loadMoreCommentsBtn.addEventListener("click", async function () {
  this.setAttribute("disabled", true);
  this.classList.add("loading");
  await loadComments();
  this.removeAttribute("disabled");
  this.classList.remove("loading");
});

const overlay = document.getElementById("overlay");
overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
});

async function showImage() {
  setTimeout(() => {
    let list_img_can_be_shown = document.querySelectorAll(".content-image");
    list_img_can_be_shown.forEach((img) => {
      img.addEventListener("click", function () {
        let overlayImage = document.getElementById("overlayImage");
        overlay.classList.add("active");
        overlayImage.src = img.src;
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
  const element = document.getElementById(id);
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

// Call the initialize function
await initialize();
loadComments();
