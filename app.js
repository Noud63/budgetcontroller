// Run live-server if you are using type="module"!!
// you can't run JS with "type='module'" directly in the browser without server.

//------------------------------- BUDGET CONTROLLER APP ------------------------------//

// datastructure
let data = {
    plus: [],      // Deposit values
    minus: [],     // Withdrawal values
    budget: 0,
    totals: {
        plus: 0,
        minus: 0
    },
    items: {
        plus: [],  // Array of deposit objects
        minus: []  // Array of withdrawal objects
    }
}


//Get input values when submit button is clicked
const getInput = () => {
    return {
        type: document.querySelector('.select_type').value,
        description: document.querySelector('.add_description').value,
        value: parseFloat(document.querySelector('.add_value').value),
        id: Date.now() + Math.random(),
        created: getTimeStamp()
    }
}


//Store values in datastructure
const storeValues = (type, value) => {
    data[type].push(value)
}


//Calculate budget and store in datastructure
function calculateBudget() {
    let sum = 0;
    let sum1 = 0;
    data.plus.forEach(val => {
        sum = sum + val
    })
    data.minus.forEach(val => {
        sum1 = sum1 + val
    })
    let budget = sum - sum1
    data.budget = budget
    return budget
}


const calcTotals = (type) => {
    let sum = 0;
    data[type].forEach(el => {
        sum = sum + el
    })
    data.totals[type] = sum
}


const displayTotals = () => {
    document.querySelector('.depTotal').innerHTML = '&euro;' + " " + data.totals.plus.toFixed(2)
    document.querySelector('.withTotal').innerHTML = '&euro;' + " " + data.totals.minus.toFixed(2)
}


//Display budget
const displayBudget = (budget) => {
    let sign;
    if (budget >= 0) {
        sign = '+'
    } else {
        budget = Math.abs(budget)
        sign = '-'
    }
    let element = document.querySelector('.budgetTotal')
    element.innerHTML = `<div class="saldo">${sign} &euro; ${budget.toFixed(2)}</div>`


    //Change default background-color to red when budget is negative
    sign === '-' ? document.querySelector('.budget').classList.add('red') : document.querySelector('.budget').classList.remove('red')
    sign === '-' ? document.querySelector('.smile_sad').innerHTML = '<img src="sad.png" alt="smile" style="width: 28px;" class="smile"/>' :
        document.querySelector('.smile_sad').innerHTML = '<img src="smile.png" alt="smile" style="width: 28px;" class="smile"/>'

}


// Clear all fields on clicking submit button
const clearAllFields = () => {
    document.querySelector('.add_description').value = ""
    document.querySelector('.add_value').value = ""
}


// Add timestamp to each listitem
function getTimeStamp() {
    let time = new Date();
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let hour = time.getHours();
    let minute = time.getMinutes();

    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    let created = year + "-" + month + '-' + day + ' ' + hour + ':' + minute + 'h';
    return created;
}


//Show item in list container
const displayObject = (obj, type) => {
    let html, element;

    if (type === "plus") {
        element = document.querySelector('.pluscontainer')
        html = `<div class="plusItem" id=plus-${obj.id}>
                <div class="pluslist">
                <div class="descontainer">${obj.description}</div>
                <div class="valcontainer">+ &euro; ${obj.value.toFixed(2)}</div>
                </div>
                <div class="timestamp"><div class="created">${obj.created}</div><div class="remove">remove item</div></div>
                </div>
                `
    } else if (type === "minus") {
        element = document.querySelector('.minuscontainer')
        html = `<div class="minItem" id=minus-${obj.id}>
                <div class="minlist" >
                <div class="descontainer">${obj.description}</div>
                <div class="valcontainer">- &euro; ${obj.value.toFixed(2)}</div>
                </div>
                <div class="timestamp"><div class="created">${obj.created}</div><div class="remove">remove item</div></div>
                </div>
                `
    }
    element.insertAdjacentHTML('beforeend', html)
    data.items[type].push(obj)
}


//Down arrow appears at bottom of list items if list length exceeds 7
const addScrollSign = () => {
    if (data.items.plus.length >= 7) {
        document.querySelector('.scrollSignLeft').innerHTML = '<img src="scroll.png" style="width: 60px;" >'
    } else {
        document.querySelector('.scrollSignLeft').innerHTML = ""
    }
    if (data.items.minus.length >= 7) {
        document.querySelector('.scrollSignRight').innerHTML = '<img src="scroll.png" style="width: 60px;" >'
    } else {
        document.querySelector('.scrollSignRight').innerHTML = ""
    }
}


//If deposit or withdrawal list is longer then 100, half of the list will be deleted at page refresh or page reload
const halveItemsList = (type) => {
    let half = Math.ceil(data.items[type].length) / 2

    if (data.items[type].length > 100) {
        data.items[type].splice(0, half)
    }
    localStorage.setItem('DATA', JSON.stringify(data))
}


//Render UI, calculate budget, store values in datastructure
const parseData = () => {

    const inputData = getInput()

    if (inputData.description !== "" && !isNaN(inputData.value)) {
        displayObject(inputData, inputData.type)
        storeValues(inputData.type, inputData.value)
        let budget = calculateBudget()
        displayBudget(budget)
        halveItemsList(inputData.type)
        calcTotals(inputData.type)
        displayTotals()
    } else {
        alert('Fill out input fields with required data!')
    }
    addScrollSign()
    clearAllFields()
    localStorage.setItem('DATA', JSON.stringify(data))
}


//Delete list item from UI
const deleteItem = (e) => {
    let item = e.target.parentNode.parentNode
    console.log(item.parentNode)
    let ID = e.target.parentNode.parentNode.id
    ID = ID.split('-')
    let type = ID[0]
    ID = parseFloat(ID[1])

    if (e.target.className === 'remove') {
        item.remove()
        updateAllValues(ID, type)

    }
    localStorage.setItem('DATA', JSON.stringify(data))
}


//Delete list item from datastructure
const deleteItemFromData = (id, type) => {
    data.items[type] = data.items[type].filter(el => {
        return el.id !== id
    })
}


//Delete values from datastructure
const deleteValueFromData = (id, type) => {
    data.items[type].forEach((x) => {
        if (x.id === id) {
            let i = data.items[type].indexOf(x)
            data[type].splice(i, 1)
        }
    })
}

const updateAllValues = (ID, type) => {
    deleteValueFromData(ID, type)
    deleteItemFromData(ID, type)
    calculateBudget()
    displayBudget(data.budget)
    calcTotals(type)
    displayTotals()
    addScrollSign()
}


//EventListener attached to submit button and 'remove item'
function setUpEventListeners() {
    const btns = [...document.querySelectorAll('.btn')]
    btns.forEach(btn => {
        btn.addEventListener('click', parseData)
    })

    const deleteBtns = document.querySelectorAll('.delete')
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', deleteItem)
    })

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            parseData();
        }
    });
}


//Initial state, get data from localStorage, if any, and set eventListeners
function init() {

    const data = JSON.parse(localStorage.getItem("DATA"))
    if (data) {
        const items = [...data.items.plus, ...data.items.minus]
        items.forEach(el => {
            let obj = el
            let type = el.type
            let value = el.value
            let id = el.id
            let created = el.created
            displayObject(obj, type, id, created)
            calculateBudget()
            displayBudget(data.budget)
            storeValues(type, value)
            addScrollSign()
            calcTotals(type)
            displayTotals()
        })
    }

    setUpEventListeners()
    console.log(data)
}

init()


