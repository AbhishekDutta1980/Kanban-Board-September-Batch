
//Selectors

const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector('.remove-btn');
const modalCont = document.querySelector(".modal-cont");
const textArea = document.querySelector(".text-area");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color")
const toolBoxColors = document.querySelectorAll(".color-box")
let ticketsArr = JSON.parse(localStorage.getItem('tickets')) || []

function init(){
    if(localStorage.getItem('tickets')){
        ticketsArr.forEach(function (ticket){
            createTicket(ticket.ticketColor, ticket.task, ticket.id)
        })
    }
}

init()

//local variables
let modalPriorityColor = 'lightpink'
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";
const colors = ['lightpink', 'lightgreen', 'lightblue', 'black']

let addBtnFlag = false
let removeBtnFlag = false

//add btn toggle
addBtn.addEventListener('click', function () {
    addBtnFlag = !addBtnFlag

    if (addBtnFlag) {
        modalCont.style.display = 'flex'
    } else {
        modalCont.style.display = 'none'
    }
});

//remove btn toggle

removeBtn.addEventListener('click', function(){
    removeBtnFlag = !removeBtnFlag
    if (removeBtnFlag) {
         alert("Delete Button Activated")
         removeBtn.style.color = 'red'
    } else {
         removeBtn.style.color = 'white'
    }
})

//handle removal

function handleRemoval(ticket){
ticket.addEventListener('click', function(){
    
    if(removeBtnFlag==true){
        const id = ticket.querySelector('.ticket-id').innerText
        ticket.remove()
        const ticketIdx = getIdx(id)
        ticketsArr.splice(ticketIdx, 1)
        
        updateLocalStorage()
    }
})
}


//filtering of tickets according to colors
toolBoxColors.forEach(function (colorElem){
    colorElem.addEventListener('click', function(){
         const allTickets = document.querySelectorAll('.ticket-cont')
        // console.log(allTickets)
        const selectedColor = colorElem.classList[0]
        // console.log(selectedColor)

        allTickets.forEach(function(ticket){
            const ticketColorBand = ticket.querySelector('.ticket-color')
            console.log(ticketColorBand)
            if(ticketColorBand.style.backgroundColor === selectedColor){
                ticket.style.display = 'block'
            }
            else{
                ticket.style.display = 'none'
            }
        }) 

    })
    colorElem.addEventListener('dblclick', function(){
        const allTickets = document.querySelectorAll('.ticket-cont')
        allTickets.forEach(function(ticket){
            ticket.style.display = 'block'
        })
    })
})

//change task priority on colorband
function handleColor(ticket){
    const ticketColorBand = ticket.querySelector('.ticket-color')
    const id = ticket.querySelector('.ticket-id').innerText
    
    console.log(ticketColorBand)
    ticketColorBand.addEventListener('click', function(){
        const currentColor = ticketColorBand.style.backgroundColor
        console.log(currentColor)
        const ticketIdx = getIdx(id)
         
        let currentColorIdx = colors.findIndex(function(color){
            return currentColor === color 
        })
        currentColorIdx++

        const newColorIdx = currentColorIdx % colors.length
        const newColorBand = colors[newColorIdx]
        ticketColorBand.style.backgroundColor = newColorBand
        ticketsArr[ticketIdx].ticketColor = newColorBand

        updateLocalStorage()
    })
}

//handle lock
//https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable
function handleLock(ticket){
    const ticketLockElem = ticket.querySelector('.ticket-lock')
    const id = ticket.querySelector('.ticket-id').innerText
    const ticketLockIcon = ticketLockElem.children[0]
    const taskArea = ticket.querySelector('.task-area')
    console.log(ticketLockIcon)

    ticketLockIcon.addEventListener('click', function(){
        const ticketIdx = getIdx(id)
        if(ticketLockIcon.classList.contains(lockClose)){
            ticketLockIcon.classList.remove(lockClose)
            ticketLockIcon.classList.add(lockOpen)
            taskArea.setAttribute('contenteditable', 'true')
        } else{
            ticketLockIcon.classList.remove(lockOpen)
            ticketLockIcon.classList.add(lockClose)
            taskArea.setAttribute('contenteditable', 'false')
        }
        ticketsArr[ticketIdx].task = taskArea.innerText
        updateLocalStorage()
    })
}


//removal of rickets


// generate a ticket

function createTicket(taskColor, task, id) {
    const ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color" style="background-color:${taskColor}"></div>
            <div class="ticket-id">${id}</div>
            <div class="task-area">${task}</div> 
            <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
    //  mainCont.appendChild(ticketCont);
    //console.log(ticketCont)
    mainCont.appendChild(ticketCont)
    handleColor(ticketCont)
    handleLock(ticketCont)
   handleRemoval(ticketCont)
}



// Attaching key event to the modal

modalCont.addEventListener("keydown", function (e) {

    if (e.key === "Shift") {
        const task = textArea.value;
        const id = (Math.random()*10000).toFixed(0)
        //console.log("Color is : " +modalPriorityColor)
        createTicket(modalPriorityColor, task, id);
        modalCont.style.display = 'none'
        addBtnFlag = false      
        ticketsArr.push({id, task, ticketColor : modalPriorityColor})
        console.log(ticketsArr)
        updateLocalStorage()
    }
});


allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click', function(){
        allPriorityColors.forEach(function(priorityColors){
            priorityColors.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0]; 
        console.log(modalPriorityColor)
    })
})

function updateLocalStorage(){
    localStorage.setItem('tickets', JSON.stringify(ticketsArr))
}

function getIdx(id){
    const ticketIdx = ticketsArr.findIndex(function(ticket){
    return ticket.id === id
})
return ticketIdx
}