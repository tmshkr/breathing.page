var circle = document.getElementById("circle")
var text = document.getElementById("text")
var main = document.getElementById("main")
var mainView = document.getElementById("main-view")
var sidebarToggle = document.getElementById("sidebar-toggle")
var numbers = [4, 4, 4, 4]
var words = ["inhale", "hold", "exhale", "pause"]
var sidebarOpen = false
var textDisplay = true


function breathe() {

  circle.style.transition = `all ${numbers[0]}s ease-in-out`
  circle.style.webkitTransition = `all ${numbers[0]}s ease-in-out`
  circle.style.transform = "scale(1)"
  text.textContent = words[0]

  window.setTimeout(function() {
    text.textContent = words[1]

    window.setTimeout(function() {
      circle.style.transition = `all ${numbers[2]}s ease-in-out`
      circle.style.webkitTransition = `all ${numbers[2]}s ease-in-out`
      circle.style.transform = "scale(0.25)"
      text.textContent = words[2]

      window.setTimeout(function() {
        text.textContent = words[3]

        window.setTimeout(function() {
          breathe()

        }, numbers[3] * 1000)
      }, numbers[2] * 1000)
    }, numbers[1] * 1000)
  }, numbers[0] * 1000)
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
  window.scrollTo(0,0)
  if (sidebarOpen) {
    main.style.transform = "translateX(0)"
    sidebarOpen = false
    sidebarToggle.className = ""
  }
  else {
    main.style.transform = "translateX(-15em)"
    sidebarOpen = true
    sidebarToggle.className = "open"
  }
}


function saveSettings() {

  let textNodes = document.querySelectorAll("input[type=text]")
  let numberNodes = document.querySelectorAll("input[type=number]")
  
  numberNodes.forEach(function(node) {
    if (node.value < 2)
      node.value = 2
    if (node.value > 10)
      node.value = 10
  })

  for (let i = 0; i < 4; i++) {
    words[i] = textNodes[i].value
    numbers[i] = numberNodes[i].value
  }
}


function resetSettings() {
  numbers = [4, 4, 4, 4]
  words = ["inhale", "hold", "exhale", "pause"]

  let textNodes = document.querySelectorAll("input[type=text]")
  let numberNodes = document.querySelectorAll("input[type=number]")

  for (let i = 0; i < 4; i++) {
    textNodes[i].value = words[i]
    numberNodes[i].value = numbers[i]
  }

}


text.onclick = toggleText
sidebarToggle.onclick = toggleSidebar
mainView.ontouchmove = function(e) { e.preventDefault() } //prevent mobile scroll
window.setTimeout(function() { breathe() }, 4000)