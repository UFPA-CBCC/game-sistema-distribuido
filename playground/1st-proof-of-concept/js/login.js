
document.addEventListener("DOMContentLoaded",(event)=>{
    const loginForm = document.getElementById('login-form')
    const signInButton = document.getElementById('sign-in')
    const backToLogin = document.getElementById('back-to-login')
    signInButton.addEventListener('click',(event=>{
        event.preventDefault()
        const loginModel = document.getElementById('login-model')
        const signInModel = document.getElementById('sign-in-model')
        fadeOutElement(loginModel).then(()=>{
            fadeInElement(signInModel)
        })
        
    }))
    backToLogin.addEventListener('click',(event=>{
        event.preventDefault()
        const loginModel = document.getElementById('login-model')
        const signInModel = document.getElementById('sign-in-model')
        fadeOutElement(signInModel).then(()=>{
            fadeInElement(loginModel)
        })
        
    }))
})

function login(loginForm){
    console.log("login function")
}

function fadeOutElement(element){
   return new Promise(function(resolve,reject){
    element.style.animationName = 'fadeout'
    element.style.animationDuration = '2s'
    setTimeout(()=>{
        element.style.display = 'none'
        resolve()
    },2000)
   })
}
function fadeInElement(element){
    element.style.animationName = 'fadein'
    element.style.animationDuration = '2s'
    element.style.display="inline"

}