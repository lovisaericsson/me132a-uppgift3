let cssLink = document.querySelector('#theme-class')

document.querySelector('.theme-toggle-button').addEventListener('click', () => {
  let theme = localStorage.getItem('theme')
  if (theme == 'light') {
    cssLink.href = 'css/dark.css'
    localStorage.setItem('theme', 'dark')
    console.log(cssLink.href)
  } else {
    cssLink.href = 'css/light.css'
    localStorage.setItem('theme', 'light')
    console.log(cssLink.href)
  }
})

function setTheme () {
  let theme = localStorage.getItem('theme')
  console.log(theme)
  cssLink.href = `css/${theme}.css`
}

setTheme()
