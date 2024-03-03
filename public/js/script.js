const sliderFunction = (slider) => {

  // Grab the div that displays the value text
  let output = document.getElementById(slider.name);
  output.innerHTML = slider.value;

  // Find the element with the tooltip and update its title attribute
  let tooltipElement = document.querySelector('[uk-tooltip]');
  console.log(tooltipElement);
  tooltipElement.setAttribute('title', 'hellooooo');
  UIkit.tooltip(tooltipElement).show(); // Refresh the tooltip to show the updated text

  }
