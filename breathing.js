var circle = document.getElementById("circle")
var text = document.getElementById("text")
var license = document.querySelector("p")
var hideLicenseButton = document.querySelector("p span")
var textDisplay = true
var inhale = true


function breathe() {

      if (inhale){
        circle.style.transform = "scale(1)"
        text.textContent = "inhale"
        window.setTimeout(function() {
          text.textContent = "hold"
        }, 4000)
        inhale = false
      }
      else {
        circle.style.transform = "scale(0.25)"
        text.textContent = "exhale"
        window.setTimeout(function() {
          text.textContent = "pause"
        }, 4000)
        inhale = true
      }
}

function toggleText(event) {
  if (textDisplay){
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

function hideLicense(event) {
  license.style.display = "none"
}

text.onclick = toggleText
hideLicenseButton.onclick = hideLicense
setInterval(breathe, 8000)