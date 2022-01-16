
// Current Account and Savings buttons eventListeners

const accountBtns = [...document.querySelectorAll('.accountBtn')]
const boxes = [...document.querySelectorAll('.box')]

accountBtns.forEach( btn => {
    btn.addEventListener('click', function(e){
  if(e.target.classList.contains('savings')){
        boxes.forEach(box => {
        box.style.display = 'none'
    })

    document.querySelector('.container').style.height = '570px'
    document.querySelector('.flatBroke').style.display = 'flex'

  } else if (e.target.classList.contains('payments')){
      boxes.forEach(box => {
          box.style.display = 'flex'
        })
      document.querySelector('.container').style.height = '500px'
      document.querySelector('.flatBroke').style.display = 'none'
      }
   })
})