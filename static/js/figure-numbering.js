window.onload = function() {
    var figures = document.getElementsByClassName('figure');
    for (var i = 0; i < figures.length; i++) {
      var caption = figures[i].getElementsByClassName('caption')[0];
      caption.innerHTML = '<strong>Figure ' + (i + 1) + '.</strong> ' + caption.innerHTML;
    }
  };