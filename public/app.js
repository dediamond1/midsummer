const waveBtn = document.querySelector('.wave')
const slimBtn = document.querySelector('.slim')
const boldBtn = document.querySelector('.bold')
const waveInfo = document.querySelector('.waveInfo')
const slimInfo = document.querySelector('.slimInfo')
const boldInfo = document.querySelector('.boldInfo')
const helpAccept = document.querySelectorAll('.helpAccept')


waveBtn.addEventListener("click", () => {
    waveInfo.classList.remove('hidden')
    helpAccept.forEach(accept => {
      accept.addEventListener("click", () => {
        waveInfo.classList.add('hidden')
  
  
      })
    })
    
    boldInfo.classList.add('hidden')
    slimInfo.classList.add('hidden')
  })
  
  
  slimBtn.addEventListener("click", () => {
    slimInfo.classList.remove('hidden')
  
    helpAccept.forEach(accept => {
      accept.addEventListener("click", () => {
        slimInfo.classList.add('hidden')
      })
    })
    
    boldInfo.classList.remove('hidden')
    waveInfo.classList.add('hidden')
  })
  
  boldBtn.addEventListener("click", () => {
    boldInfo.classList.remove('hidden')
    waveInfo.classList.add('hidden')
    slimInfo.classList.add('hidden')
  
    helpAccept.forEach(accept => {
      accept.addEventListener("click", () => {
        boldInfo.classList.add('hidden')
  
      })
    })
    
  })