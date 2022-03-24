const sunMoonContainer = document.querySelector('.sun-moon-container')

document.querySelector('.theme-toggle-button').addEventListener('click', () => {
    document.body.classList.toggle('dark')
  })
  let selector = document.querySelector("#theme-toggle-button");
  let cssLink = document.querySelector("theme.css");

selector.addEventListener("change", changeTheme);

function changeTheme(){
    cssLink.href= "theme.css";
    localStorage.setItem("theme", selector.value);
}

function setTheme(){
    let theme = localStorage.getItem("theme");
    console.log(theme);
    cssLink.href = `${theme}.css`;
}

setTheme();