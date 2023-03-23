// articles filter
const filterSelection = (c) => {
  const filterElement = document.getElementsByClassName("filterDiv");
  if (c === "all") c = "";
  for (let i = 0; i < filterElement.length; i++) {
    removeClass(filterElement[i], "show");
    if (filterElement[i].className.indexOf(c) > -1) addClass(filterElement[i], "show");
  }
}

const addClass = (element, name) => {
  const arr1 = element.className.split(" ");
  const arr2 = name.split(" ");
  for (let i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

const removeClass = (element, name) => {
  const arr1 = element.className.split(" ");
  const arr2 = name.split(" ");
  for (let i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

filterSelection("all");

const btnContainer = document.getElementById("filter-container");
const btns = btnContainer.getElementsByClassName("filter-btn");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    const current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}