let persons = [];
// number of rows to be displayed per page
let rowsPerPage = 2;

// current page
let currentPage = 1;



document.getElementById("submit").addEventListener("click", (e)=>{
    e.preventDefault();

    const d = Date.now();    
    const lastFiveDigits = d % 100000;

    if (validateForm()) {
        let newPerson = {
            id: lastFiveDigits,
            fname:document.getElementById("name").value,
            age:document.getElementById("age").value,
            city:document.getElementById("city").value,
            address:document.getElementById("address").value, 
            image: document.getElementById("image").files[0],   
        }
    
        persons.push(newPerson);
        addPersonToTable(newPerson);
        inputReset();
        closeForm();
    }
    displayRowsForPage(currentPage);
    createPageButtons();
})

function addPersonToTable(person) {
    // get the table element
    const table = document.getElementById("table-body");
    
  
    // create a new row for the person
    const row = table.insertRow();
  
    // add cells for each property of the person object
    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const ageCell = row.insertCell();
    const cityCell = row.insertCell();
    const addressCell = row.insertCell();
    const imageCell = row.insertCell();
    const actionsCell = row.insertCell();
  
    // set the values for each cell
    idCell.innerHTML = person.id;
    nameCell.innerHTML = person.fname;
    ageCell.innerHTML = person.age;
    cityCell.innerHTML = person.city;
    addressCell.innerHTML = person.address;

    if (person.image) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(person.image);
        img.classList.add("table-img")
        imageCell.appendChild(img);
    }

    // create delete button and add click event listener
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn");
    actionsCell.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => {
        // remove person from array and table
        if (confirm("Sure to delete row?")) {
            const index = persons.findIndex(p => p.id === person.id);
            persons.splice(index, 1);
            table.deleteRow(row);
        }
        if (document.getElementById("table-body").innerHTML === "") {
            currentPage --;
            displayRowsForPage(currentPage);
            createPageButtons();    
            updatePageButtons()
        }else{
            displayRowsForPage(currentPage);
            createPageButtons();
        }
    });

    // create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn");
    actionsCell.appendChild(editButton);
    editButton.addEventListener("click", () => {
        // replace cells with input fields
        nameCell.innerHTML = `<input type="text" value="${person.fname}">`;
        ageCell.innerHTML = `<input type="number" value="${person.age}">`;
        cityCell.innerHTML = `<input type="text" value="${person.city}">`;
        addressCell.innerHTML = `<input type="text" value="${person.address}">`;
      
        // create image input field
        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.classList.add("form-control");
      
        // replace image cell with image input field
        // imageCell.innerHTML = "";
        imageCell.appendChild(imageInput);
      
        // replace edit button with save button
        actionsCell.removeChild(editButton);
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("btn")
        actionsCell.appendChild(saveButton);
      
        // add event listener for save button
        saveButton.addEventListener("click", () => {
          // get updated values from input fields
          const updatedName = nameCell.querySelector("input").value;
          const updatedAge = ageCell.querySelector("input").value;
          const updatedCity = cityCell.querySelector("input").value;
          const updatedAddress = addressCell.querySelector("input").value;
          const updatedImage = imageInput.files[0];
      
          // update person object
          person.fname = updatedName;
          person.age = updatedAge;
          person.city = updatedCity;
          person.address = updatedAddress;
          if (updatedImage) {
            person.image = updatedImage;
          }
      
          // replace input fields with updated values
          nameCell.innerHTML = person.fname;
          ageCell.innerHTML = person.age;
          cityCell.innerHTML = person.city;
          addressCell.innerHTML = person.address;
      
          // replace image input field with image cell
          if (person.image) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(person.image);
            img.classList.add("table-img")
            imageCell.innerHTML = "";
            imageCell.appendChild(img);
          }
      
          // replace save button with edit button
          actionsCell.removeChild(saveButton);
          actionsCell.appendChild(editButton);
        });
      });
      
    }


function inputReset() {
    const form = document.getElementById("person-form");
    form.reset();
}


// function to display rows for a particular page
function displayRowsForPage(page) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const rows = persons.slice(startIndex, endIndex);
  const table = document.getElementById("table-body");
  table.innerHTML = ""; // clear table
  rows.forEach(addPersonToTable);
}

// function to create page buttons
function createPageButtons() {
  const totalPages = Math.ceil(persons.length / rowsPerPage);
  const pagination = document.getElementById("pagination-pages");
  pagination.innerHTML = ""; // clear pagination
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === 1) {
        button.classList.add("current-page")
    }
    button.addEventListener("click", () => {
      currentPage = i;
      displayRowsForPage(currentPage);
      updatePageButtons(); // update class for page buttons
    });
    pagination.appendChild(button);
  }
}

// function to update class for page buttons
function updatePageButtons() {
    const buttons = document.querySelectorAll("#pagination-pages button");
  
    for (let i = 0; i < buttons.length; i++) {
      if (i + 1 === currentPage) {
        buttons[i].classList.add("current-page");
      } else {
        buttons[i].classList.remove("current-page");
      }
    }
  }


// initial display
displayRowsForPage(currentPage);
createPageButtons();

document.getElementById("page-prev").addEventListener("click", ()=>{
    if (currentPage > 1) {
        displayRowsForPage(currentPage - 1);
        currentPage--;
        updatePageButtons()
    }
})

document.getElementById("page-next").addEventListener("click", () => {
    if (currentPage < Math.ceil(persons.length / rowsPerPage)) { // check if current page is not already the last page
      displayRowsForPage(currentPage + 1);
      currentPage++;
      updatePageButtons()
    }
  });


function addPersonForm(){
    document.getElementById("form-container").style.top = "80px";
}

function closeForm() {
    document.getElementById("form-container").style.top = "-480px";
}

function validateForm(){
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;

    // check if inputs are not empty
// if (name.trim() === "" || age.trim() === "" || city.trim() === "") {
//     alert("Please fill required* fields.");
//     return false;
// }

// // check if age is a number and is greater than 0
// if (isNaN(age) || age < 1) {
//     alert("Please enter a valid age.");
//     return false;
// }
return true;
}

const selectElement = document.getElementById('my-select');

selectElement.addEventListener('change', (event) => {

  console.log(currentPage);
  const selectedValue = event.target.value;
    rowsPerPage = selectedValue;

    displayRowsForPage(currentPage);
    createPageButtons(); 
});


