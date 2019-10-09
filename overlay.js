function off() {
    document.getElementById("overlay").style.display = "none";
  }

  // legend animation

let isLegendShowing = false;
function animation() {
  
  let legend =  document.getElementById('legend');
    if(isLegendShowing){
      hideLegend();
    }
    else {
      showLegend();
    }
  
}


function hideLegend() {
  
  document.getElementById('legend').style.top = '94vh';
  legend.classList.add('legend-animation-hide');
  setTimeout(function() {
    document.getElementById('legend').classList.remove('legend-animation-show');
});
  isLegendShowing = false;
}

function showLegend() {

  document.getElementById('legend').style.top = '0vh';
  legend.classList.add('legend-animation-show');
  setTimeout(function() {
    document.getElementById('legend').classList.remove('legend-animation-hide');
});
  isLegendShowing = true;
}





