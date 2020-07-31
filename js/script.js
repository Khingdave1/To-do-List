// ****** select items **********
const form = document.querySelector(".todo-form");
const alert = document.getElementById("alert");
const todo = document.getElementById("todo");
const submitBtn = document.querySelector(".submit-btn");
const listContainer = document.querySelector(".list-container");
const listArticle = document.querySelector(".list-article");
const clearBtn = document.getElementById("clear-btn");

// edit option 
let editElement;
let editFlag = false;
let editID = "";

// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
    e.preventDefault();
    const value = todo.value;
    const id = new Date().getTime().toString();
  
    if (value !== "" && !editFlag) {
      const element = document.createElement("article");
      let attr = document.createAttribute("data-id");
      attr.value = id;
      element.setAttributeNode(attr);
      element.classList.add("list-item", "d-flex", "justify-content-between", "align-items-center", "mb-4", "px-3", "py-2");
      element.innerHTML = `<p class="list-title m-0 h5">${value}</p>
                <div class="list-btn">
                    <a href="#" class="edit-btn mr-3">
                        <img src="svg/edit.svg" alt="edit" width="20px">
                    </a>
                    <a href="#" class="delete-btn">
                        <img src="svg/remove.svg" alt="delete" width="20px">
                    </a>
                </div>
            `;

      // add event listeners to both buttons;
      const editBtn = element.querySelector(".edit-btn");
      editBtn.addEventListener("click", editItem);
      const deleteBtn = element.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", deleteItem);
      
  
      // append child
      listArticle.appendChild(element);
      // display alert
      displayAlert("item added to the list", "success");
      // show container
      listContainer.classList.add("show-container");
      // set local storage
      addToLocalStorage(id, value);
      // set back to default
      setBackToDefault();
    } else if (value !== "" && editFlag) {
      editElement.innerHTML = value;
      displayAlert("value changed", "success");

      // edit  local storage
      editLocalStorage(editID, value);
      setBackToDefault();
    } else {
      displayAlert("please add something", "danger");
    }
  }
  // display alert
  function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function () {
      alert.textContent = "";
      alert.classList.remove(`alert-${action}`);
    }, 1000);
  }
  
  // clear items
  function clearItems() {
    const items = document.querySelectorAll(".list-item");
    if (items.length > 0) {
      items.forEach(function (item) {
        listArticle.removeChild(item);
      });
    }
    listContainer.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("listArticle");
  }
 
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  todo.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  // set submit button to edit
  submitBtn.textContent = "edit";
}

// delete item  
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  listArticle.removeChild(element);

  if (listArticle.children.length === 0) {
    listContainer.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

// set backt to defaults
function setBackToDefault() {
  todo.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "add";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value) {
  const todo = { id, value };
  let items = getLocalStorage();
  items.push(todo);
  localStorage.setItem("listArticle", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("listArticle")
    ? JSON.parse(localStorage.getItem("listArticle"))
    : [];
}

// function removeFromLocalStorage(id) {
//   let items = getLocalStorage();

//   items = items.filter(function (item) {
//     if (item.id !== id) {
//       return item;
//     }
//   });

//   localStorage.setItem("listArticle", JSON.stringify(items));
// }

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("listArticle", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LISTCONTAINER');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    listContainer.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("list-item", "d-flex", "justify-content-between", "align-items-center", "mb-4", "px-3", "py-2");
  element.innerHTML = `<p class="list-title m-0 h5">${value}</p>
            <div class="list-btn">
                <a href="#" class="edit-btn mr-3">
                    <img src="svg/edit.svg" alt="edit" width="20px">
                </a>
                <a href="#" class="delete-btn">
                    <img src="svg/remove.svg" alt="delete" width="20px">
                </a>
            </div>
        `;
  // add event listeners to both buttons;
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);


  // append child
  listArticle.appendChild(element);
}