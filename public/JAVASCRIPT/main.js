let choose_langue = document.getElementById("choose-langue");

choose_langue.addEventListener("click", function () {
  function googleTranslateElementInit() {
    new google.translate.TranslateElement(
      {
        pageLanguage: "vi,en", // Ngôn ngữ gốc của trang
        includedLanguages: "vi,en,es,fr,ja,ru,ko,th", // Các ngôn ngữ có thể chuyển đổi (Tiếng Việt và Tiếng Anh)
        layout: google.translate.TranslateElement,
      },
      "google_translate_element"
    );
  }
  googleTranslateElementInit();
});

const hamburger = document.getElementById("hamburger");
hamburger.addEventListener("click", function () {
  const menu = document.getElementById("m-menu");
  menu.style.left = "0";
});

const closeMenu = document.getElementById("m-menu-close");
closeMenu.addEventListener("click", function () {
  console.log("Click");
  const menu = document.getElementById("m-menu");
  menu.style.left = "-100%";
});
