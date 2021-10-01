const newList = document.querySelector("#newListId");
const listAll = document.querySelector(".listAllC");
const list = document.getElementsByClassName("listC");
const add = document.querySelector(".checkmarkNewList");
const cross = document.getElementsByClassName("cross");
const listName = document.querySelector(".listName");
const itemsLeft = document.querySelector(".itemsLeft");
const checkbox = document.getElementsByClassName("checkbox");

/*-----Add new list-----*/
newList.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        createElement();
    }
})

add.addEventListener("click", createElement);

function createElement() {
    if (newList.value === "") {
        alert("Write something!");
    } else {
        var li = document.createElement("li");
        var input = document.createElement("input");
        var span = document.createElement("span");
        var listName = document.createElement("div");
        var crossIcon = document.createElement("div");

        li.className = "listC";
        li.draggable = "true";
        listAll.appendChild(li);

        input.type = "checkbox";
        input.className = "checkbox";
        span.className = "checkmark";
        listName.className = "listName";
        listName.innerHTML = newList.value;
        crossIcon.className = "cross";

        li.appendChild(input);
        li.appendChild(span);
        li.appendChild(listName);
        li.appendChild(crossIcon);

        newList.value = "";

        listRemove();
        listCount();
        for (var i = 0; i < list.length; i++) {
            list[i].addEventListener("click", listCount)
            list[i].addEventListener("click", filtering)
            list[i].addEventListener("click", nolist)
        }
        draggable();
        filtering();
    }
}

/*-----Remove list-----*/

function listRemove() {
    var i;
    for (i = 0; i < cross.length; i++) {
        cross[i].onclick = function () {
            var li = this.parentElement;
            li.remove();
            listCount();
        }
    }
}

listRemove();

/*-----List count-----*/

function listCount() {
    var checkboxChecked = document.querySelectorAll('input[class="checkbox"]:checked').length;
    var checkboxAll = checkbox.length;
    itemsLeftCount = checkboxAll - checkboxChecked;
    if (itemsLeftCount == 0 || itemsLeftCount == 1) {
        itemsLeft.innerHTML = itemsLeftCount + " item left";
    } else {
        itemsLeft.innerHTML = itemsLeftCount + " items left";
    }
}

listCount();

for (var i = 0; i < list.length; i++) {
    list[i].addEventListener("click", listCount)
    list[i].addEventListener("click", filtering)
    list[i].addEventListener("click", nolist)
}

/*-----Drag&Drop list-----*/
function draggable() {
    document.querySelectorAll(".listC").forEach(draggable => {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging")
        })

        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging")
        })
    })
}

draggable();

listAll.addEventListener("dragover", e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(listAll, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
        listAll.appendChild(draggable)
    } else {
        listAll.insertBefore(draggable, afterElement)
    }
})

function getDragAfterElement(listAll, y) {
    const draggableElements = [...listAll.querySelectorAll(".listC:not(.dragging)")]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/*-----Filtering list-----*/
const showOnly = document.querySelectorAll(".showOnly a");
const showOnlyMobile = document.querySelectorAll(".showOnlyMobile a");
const btnshowOnly = document.getElementsByClassName("btn");
const all = document.querySelectorAll(".showAll");
const active = document.querySelectorAll(".showOnlyActive");
const completed = document.querySelectorAll(".showOnlyCompleted");

showOnly.forEach(btn => {
    btn.addEventListener("click", () => {
        for (btnEach of btnshowOnly) {
            btnEach.classList.remove("active");
        }
        btn.classList.add("active");

        filtering();
        nolist();
    })
})
showOnlyMobile.forEach(btn => {
    btn.addEventListener("click", () => {
        for (btnEach of btnshowOnly) {
            btnEach.classList.remove("active");
        }
        btn.classList.add("active");

        filtering();
        nolist();
    })
})

function filtering() {
    for (a of all) {
        if (a.classList.contains("active")) {
            for (var i = 0; i < list.length; i++) {
                list[i].style.display = "block";
            }
            listCount();
        }
    }
    for (b of active) {
        if (b.classList.contains("active")) {
            var filterCheckboxChecked = document.querySelectorAll(".checkbox:checked");
            for (var i = 0; i < list.length; i++) {
                list[i].style.display = "block";
            }
            for (var i = 0; i < filterCheckboxChecked.length; i++) {
                filterCheckboxChecked[i].parentElement.style.display = "none";
            }
            itemsLeft.innerHTML = "";
        }
    }
    for (c of completed) {
        if (c.classList.contains("active")) {
            var filterCheckboxChecked = document.querySelectorAll(".checkbox:checked");
            for (var i = 0; i < list.length; i++) {
                list[i].style.display = "none";
            }
            for (var i = 0; i < filterCheckboxChecked.length; i++) {
                filterCheckboxChecked[i].parentElement.style.display = "block";
            }
            itemsLeft.innerHTML = "";
        }
    }
}
filtering();

/*-----Clear Completed list-----*/
const clearCompleted = document.querySelector(".clearCompleted");

clearCompleted.addEventListener("click", () => {
    var filterCheckboxChecked = document.querySelectorAll(".checkbox:checked");
    for (var i = 0; i < filterCheckboxChecked.length; i++) {
        filterCheckboxChecked[i].parentElement.remove();
        nolist();
    }
})

function nolist() {
    let listShown = 0;
    document.querySelectorAll(".listC").forEach(display => {
        if (display.style.display == "none") {
            listShown++;
        }
    })
    var liNoList = document.querySelectorAll(".noListC");

    if (listShown == list.length) {
        var li = document.createElement("li");

        li.className = "listC noListC";
        li.innerHTML = '<div class="noList">Not found.</div>';
        listAll.appendChild(li);
    } else {
        for (var i = 0; i < liNoList.length; i++) {
            liNoList[i].remove();
        }
    }
}
nolist();