var circle = document.getElementById("circle")
var text = document.getElementById("text")
var textDisplay = true
var inhale = true


function breathe() {

      if (inhale){
        circle.style.transform = "scale(1)"
        text.textContent = "inhale"
        window.setTimeout(function() {
          text.textContent = "stay"
        }, 4000)
        inhale = false
      }
      else if (!inhale){
        circle.style.transform = "scale(0.25)"
        text.textContent = "exhale"
        window.setTimeout(function() {
          text.textContent = "stay"
        }, 4000)
        inhale = true
      }
}

function toggleText() {
  if (textDisplay){
    text.style.color = "transparent"
    textDisplay = false
  }
  else if (!textDisplay){
    text.style.color = "white"
    textDisplay = true
  }
}

text.onclick = toggleText
setInterval(breathe, 8000)