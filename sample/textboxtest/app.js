window.addEventListener("load", function() {
  window.addEventListener("keydown", function(event){
    console.log(event.keyCode);
    switch(event.keyCode){
      case 50:
        document.getElementById("text1").focus();
        break;
      case 51:
        document.getElementById("text2").focus();
        break;
    }
  });
});
