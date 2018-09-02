const circle = document.getElementById("circle")
const text = document.getElementById("text")
const sidebarToggle = document.getElementById("sidebar-toggle")
let sidebarOpen = false
let textDisplay = true
let inhale = true


function breathe() {

  if (inhale) {
    circle.style.transform = "scale(1)"
    text.textContent = "inhale"
    window.setTimeout(() => {
      text.textContent = "hold"
    }, 4000)
    inhale = false
  }
  else {
    circle.style.transform = "scale(0.25)"
    text.textContent = "exhale"
    window.setTimeout(() => {
      text.textContent = "pause"
    }, 4000)
    inhale = true
  }
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

function toggleSidebar(event) {
  if (sidebarOpen) {
    document.body.style.transform = "translateX(0)"
    sidebarOpen = false
    sidebarToggle.className = ""
  }
  else {
    document.body.style.transform = "translateX(-15em)"
    sidebarOpen = true
    sidebarToggle.className = "open"
  }
}

text.onclick = toggleText
sidebarToggle.onclick = toggleSidebar
document.ontouchmove = (e) => { e.preventDefault() } //prevent mobile scroll
setInterval(breathe, 8000)