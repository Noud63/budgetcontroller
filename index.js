// Run live-server if you are using type="module"!!
// you can't run JS with "type='module" directly in the browser without server.

// ------------------------------- BUDGET CONTROLLER APP ------------------------------ //

import { getTimeStamp, date } from './dates.js'
import { changeBorderColor, progress, halveItemsList, displayDownArrow } from './additions.js'

// datastructure
export let data = {
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
    },
    percentage: 0
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


//Calculate total deposites and withdrawals
const calcTotals = (type) => {
    let sum = 0;
    data[type].forEach(el => {
        sum = sum + el
    })
    data.totals[type] = sum
}


//Calculate percentages for progressbar
const calcPercentage = () => {
    let percentage = parseInt(data.budget / data.totals.plus * 100)

    if (data.budget === 0) {
        percentage = 0
    }
    if (data.totals.plus === data.budget) {
        percentage = 100;
    }
    if (data.totals.plus === 0 && data.budget === 0) {
        percentage = 0
    }
    if (data.budget < 0) {
        percentage = 0
    }
    data.percentage = percentage
}


//Get totals from 
const getTotals = () => {
     return {
         totalPlus: data.totals.plus,
         totalMinus: data.totals.minus
     }
}

//Store values in datastructure
const storeValues = (type, value) => {
    data[type].push(value)
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


//Display totals at top of list
const displayTotals = () => {
    let totals = getTotals()
    document.querySelector('.depTotal').innerHTML = '&euro;' + " " + totals.totalPlus.toFixed(2)
    document.querySelector('.withTotal').innerHTML = '&euro;' + " " + totals.totalMinus.toFixed(2)
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
    const budgetRedGreen = document.querySelector('.budget')
    const emoji = document.querySelector('.smile_sad')
    sign === '-' ? budgetRedGreen.classList.add('red') : budgetRedGreen.classList.remove('red');
    sign === '-' ? emoji.innerHTML = '<img src="images/sad1.png" alt="smile" style="width: 20px;" class="smile"/>' :
        emoji.innerHTML = '<img src="images/smile2.png" alt="smile" style="width: 20px;" class="smile"/>'
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


// Clear all fields on clicking submit button
const clearAllFields = () => {
    document.querySelector('.add_description').value = ""
    document.querySelector('.add_value').value = ""
}


//Render UI, calculate budget, store values in datastructure
const addItem = () => {
    const inputData = getInput()

    if (inputData.description !== "" && !isNaN(inputData.value)) {
        displayObject(inputData, inputData.type)
        storeValues(inputData.type, inputData.value)
        let budget = calculateBudget()
        displayBudget(budget)
        halveItemsList(inputData.type)
        calcTotals(inputData.type)
        displayTotals()
        calcPercentage()
        progress(data.percentage)
        displayDownArrow()
    } else {
        alert('Fill out input fields with required data!')
    }

    clearAllFields()
    localStorage.setItem('DATA', JSON.stringify(data))
}


//Delete list item from UI and update app
const deleteItem = (e) => {
    let item = e.target.parentNode.parentNode;
    let ID = e.target.parentNode.parentNode.id;
    ID = ID.split('-')
    let type = ID[0]
    ID = parseFloat(ID[1])

    if (e.target.className === 'remove') {
        item.remove()
        deleteAndUpdate(ID, type)
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


//Update all values when item has been deleted
const deleteAndUpdate = (ID, type) => {
    deleteValueFromData(ID, type)
    deleteItemFromData(ID, type)
    calculateBudget()
    displayBudget(data.budget)
    calcTotals(type)
    displayTotals()
    displayDownArrow()
    calcPercentage()
    progress(data.percentage)
}


//EventListener attached to submit button and listcontainers
function setUpEventListeners() {
    const btns = [...document.querySelectorAll('.btn')]
    btns.forEach(btn => {
        btn.addEventListener('click', addItem)
    })

    const deleteBtns = document.querySelectorAll('.delete')
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', deleteItem)
    })

    const select = document.querySelector('.select_type')
    select.addEventListener('change', changeBorderColor)

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
            displayObject(obj, type)
            calculateBudget()
            displayBudget(data.budget)
            storeValues(type, value)
            displayDownArrow()
            calcTotals(type)
            displayTotals()
            calcPercentage()
            progress(data.percentage)
        })
    }

    if (!data || data.budget === 0) {
        document.querySelector('.smile_sad').innerHTML =
            '<img src="images/smile2.png" alt="smile" style="width: 28px;" class="smile"/>'
    }
    
    date()
    setUpEventListeners()
    console.log(data)
}

init()

