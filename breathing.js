var circle = document.getElementById("circle")
var text = document.getElementById("text")
var main = document.getElementById("main")
var mainView = document.getElementById("main-view")
var sidebarToggle = document.getElementById("sidebar-toggle")
var time = [4, 4, 4, 4]
var words = ["inhale", "hold", "exhale", "pause"]
var sidebarOpen = false
var textDisplay = true


function breathe() {

  text.textContent = words[0]
  circle.style.transition = `all ${time[0]}s ease-in-out`
  circle.style.webkitTransition = `all ${time[0]}s ease-in-out`
  circle.style.transform = "scale(1)"

  window.setTimeout(function() {
    if (time[1] > 0)
      text.textContent = words[1]

    window.setTimeout(function() {
      text.textContent = words[2]
      circle.style.transition = `all ${time[2]}s ease-in-out`
      circle.style.webkitTransition = `all ${time[2]}s ease-in-out`
      circle.style.transform = "scale(0.25)"

      window.setTimeout(function() {
        if (time[3] > 0)
          text.textContent = words[3]

        window.setTimeout(breathe, time[3] * 1000)
      }, time[2] * 1000)
    }, time[1] * 1000)
  }, time[0] * 1000)
}

function toggleText(event) {
  if (textDisplay) {
    text.style.color = "transparent"
    textDisplay = false
    event.cancelBubble = true
    document.onclick = toggleText
  }
  else {
    text.style.color = "white"
    textDisplay = true
    document.onclick = null
  }
}

function openSidebar() {
  main.style.transform = "translateX(-15em)"
  sidebarOpen = true
  sidebarToggle.className = "open"
}

function closeSidebar() {
  window.scrollTo(0, 0)
  main.style.transform = "translateX(0)"
  sidebarOpen = false
  sidebarToggle.className = ""
}

function toggleSidebar() {
  (sidebarOpen) ? closeSidebar(): openSidebar()
}

function handleKeypress(e) {
  var key = e.keyCode || e.which
  if (key == 13) {
    if (["time", "word", "save"].indexOf(e.target.name) > -1)
      saveSettings()
    else if (e.target.name == "reset")
      resetSettings()
    else if (e.target.id == "noSleepToggle")
      toggleNoSleep()
    else
      toggleSidebar()
    sidebarToggle.focus()
  }
}

function saveSettings() {

  let settings = []
  let textNodes = document.querySelectorAll("input[type='text']")
  let numberNodes = document.querySelectorAll("input[type='number']")


  for (let i = 0; i < 4; i++) {
    if (numberNodes[i].value <= 0 && i % 2 == 1) {
      numberNodes[i].value = 0
      textNodes[i].value = ""
    }
    if (numberNodes[i].value < 2 && i % 2 == 0)
      numberNodes[i].value = 2
    if (numberNodes[i].value > 10)
      numberNodes[i].value = 10
  }

  for (let i = 0; i < 4; i++) {
    words[i] = textNodes[i].value
    time[i] = numberNodes[i].value
    settings[i] = [words[i], time[i]]
  }
  window.localStorage.setItem("settings", JSON.stringify(settings))
  toggleSidebar()
}

function resetSettings() {
  time = [4, 4, 4, 4]
  words = ["inhale", "hold", "exhale", "pause"]
  let settings = []
  let textNodes = document.querySelectorAll("input[type='text']")
  let numberNodes = document.querySelectorAll("input[type='number']")

  for (let i = 0; i < 4; i++) {
    textNodes[i].value = words[i]
    numberNodes[i].value = time[i]
    settings[i] = [words[i], time[i]]
  }
  window.localStorage.setItem("settings", JSON.stringify(settings))
  toggleSidebar()
}

function loadSettings() {
  let settings = window.localStorage.getItem("settings")
  if (settings !== null) {
    settings = JSON.parse(settings)
    let textNodes = document.querySelectorAll("input[type='text']")
    let numberNodes = document.querySelectorAll("input[type='number']")

    for (let i = 0; i < 4; i++) {
      textNodes[i].value = words[i] = settings[i][0]
      numberNodes[i].value = time[i] = settings[i][1]
    }
  }
}

document.onkeypress = handleKeypress
text.onclick = toggleText
sidebarToggle.onclick = toggleSidebar
mainView.ontouchmove = function(e) { e.preventDefault() } //prevent mobile scroll
loadSettings()
window.setTimeout(breathe, 4000)