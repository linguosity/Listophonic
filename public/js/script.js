

// display hidden loading spinner as progress visual for api call on New Student modal
const loadSpinner = () => {
    const spinner = document.getElementById("uk-spinner");
    spinner.style.visibility = "visible";
}


// display hidden loading spinner as progress visual for api call on Generate phrases modal
const loadSpinnerGenerate = () => {
    const spinner2 = document.getElementById("uk-spinner-generate");
    console.log(spinner2);
    spinner2.style.visibility = "visible";

}