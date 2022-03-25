let cssLink = document.querySelector("#theme-class");

document.querySelector('.theme-toggle-button').addEventListener('click', () => {
    let theme = localStorage.getItem("theme");
    console.log(theme);
    if(theme == "light") {
    document.body.classList.toggle('dark');
    cssLink.href = `css/${theme}.css`;
    localStorage.setItem("theme", "dark");
    console.log(cssLink.href);
    } else if(theme == "dark"){
      document.body.classList.toggle('light')
      cssLink.href = `css/${theme}.css`;
      localStorage.setItem("theme", "light");
      console.log(cssLink.href);
    }
   
}); 

function setTheme(){
    let theme = localStorage.getItem("theme");
    console.log(theme);
    cssLink.href = `css/${theme}.css`;
}

setTheme();
  



  