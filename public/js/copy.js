// pull button element from document
var button = document.querySelector("#copy");

// add event listener
button.addEventListener("click", function(event) {
  // create a new text area with the short url
  var textArea = document.createElement("textArea");
  textArea.value = document.querySelector("#short").innerText;

  // append the textarea to the documnet body
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  // attempt to copy textarea contents
  try {
    var successful = document.execCommand("copy");
    if (successful) {
      document.querySelector("#copy").innerText = "Copied!";
    }
  } catch (err) {
    console.log(err);
  }

  // hide the text area
  textArea.hidden = true;
});
