import { data } from './index.js'


//Change select-box bordercolor if value is minus
export const changeBorderColor = () => {
    document.querySelector('.select_type').classList.toggle('red-focus')
}


//Progressbar shows percentage of budget available
const bar = document.getElementById('progress')
const perc = document.querySelector('.percentage')
export const progress = (percentage) => {
    perc.textContent = percentage + '%'
    bar.style.width = percentage + '%'
    percentage < 20 ? (bar.style.backgroundColor = 'darkred', perc.style.backgroundColor = 'darkred') :
        (bar.style.backgroundColor = 'green', perc.style.backgroundColor = 'green');

    if (data.budget === 0) {
        perc.style.backgroundColor = 'green'
    }
}


//If deposit or withdrawal list is longer then 100, half of the list will be deleted at page refresh or page reload
export const halveItemsList = (type) => {
    let half = Math.ceil(data.items[type].length) / 2
    if (data.items[type].length > 100) {
        data.items[type].splice(0, half)
    }
    localStorage.setItem('DATA', JSON.stringify(data))
}


//Down arrow appears at bottom of list items if list length exceeds 7 
const arrowDownLeft = document.querySelector('.scrollSignLeft')
const arrowDownRight = document.querySelector('.scrollSignRight')
export const displayDownArrow = () => {
    data.items.plus.length >= 6 ? arrowDownLeft.style.display = "flex" :
        arrowDownLeft.style.display = "none"
    data.items.minus.length >= 6 ? arrowDownRight.style.display = "flex" :
        arrowDownRight.style.display = "none"
}


// EventListeners for current account and savings button
const accountBtns = [...document.querySelectorAll('.accountBtn')]
const boxes = [...document.querySelectorAll('.box')]

accountBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        boxes.forEach(box => {
            if (e.target.classList.contains('savings')) {
                box.style.display = 'none'
                // document.querySelector('.container').style.height = '570px'
                document.querySelector('.flatBroke').style.display = 'flex'
                document.querySelector('.savingsBox').style.display = 'flex'
                document.querySelector('.budget').style.display = 'none'

            } else if (e.target.classList.contains('payments')) {
                box.style.display = 'flex'
                // document.querySelector('.container').style.height = '500px'
                document.querySelector('.flatBroke').style.display = 'none'
                document.querySelector('.savingsBox').style.display = 'none'
                document.querySelector('.budget').style.display = 'flex'
            }
        })
    })
})