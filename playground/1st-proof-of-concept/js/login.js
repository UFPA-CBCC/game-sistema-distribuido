const PostHeaders = new Headers({
  'Content-Type':'application/json; charset=utf-8'
})


document.addEventListener("DOMContentLoaded",(event)=>{
    const signInButton = document.getElementById('sign-in')
    const backToLogin = document.getElementById('back-to-login')
    const registerButton = document.getElementById('sign-in-submit')
    const loginButton = document.getElementById('login')
    const loginModel = document.getElementById('login-model')
    const signInModel = document.getElementById('sign-in-model')
    signInButton.addEventListener('click',(event=>{
        event.preventDefault()
        fadeOutElement(loginModel).then(()=>{
            fadeInElement(signInModel)
        })

    }))

    backToLogin.addEventListener('click',(event=>{
        event.preventDefault()
        fadeOutElement(signInModel).then(()=>{
            fadeInElement(loginModel)
        })
    }))

    registerButton.addEventListener('click',(event)=>{
      event.preventDefault()
      const userName = document.getElementById('register-username').value
      const password = document.getElementById('register-password').value
      const payload = {
        username:userName,
        password:password
      }
      fetch('/api/register',{
        method:'POST',
        body:JSON.stringify(payload),
        headers:PostHeaders
      }).then(res=>{
        if(res.status === 201){
          alert('Cadastrado com sucesso')
          fadeOutElement(signInModel).then(()=>{
            fadeInElement(loginModel)
          })
        }
      })
    })

    loginButton.addEventListener('click',(event)=>{
      event.preventDefault()
      const userName = document.getElementById('username').value
      const password = document.getElementById('password').value
      const payload = {
        username:userName,
        password:password
      }
      fetch('/api/login',{
        method:'POST',
        body:JSON.stringify(payload),
        headers:PostHeaders
      }).then(res=>{
        if(res.status === 200){
          location='/'
        }
      })
    })

})

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
