const root = document.getElementById('root');
const baseUrl = 'http://localhost:8080';
class Auth {
  #loginEmailInput: HTMLInputElement | null;
  #loginPasswordInput: HTMLInputElement | null;
  #loginSubmit: HTMLInputElement | null;
  #registerEmailInput: HTMLInputElement | null;
  #registerPasswordInput: HTMLInputElement | null;
  #registerSubmit: HTMLInputElement | null;
  #registerValidation:Record<string,boolean>;
  #regexRecord:Record<string,RegExp>;
  constructor() {
    this.#loginEmailInput = null
    this.#loginPasswordInput = null
    this.#loginSubmit = null
    this.#registerEmailInput = null
    this.#registerPasswordInput = null
    this.#registerSubmit = null
    this.#registerValidation = {'register_email':false,'register_password':false};
    this.#regexRecord = {'register_email':/[a-zA-Z\d]+@[a-zA-Z\d]+.[a-z]+/,'register_password': /[a-zA-Z\d]{8,}/};
  }
  checkAuth(){
    if(!localStorage.getItem('token')){
      window.location.hash = '#/auth';
      this.formRender();
      this.addEvent();
    }else{
      window.location.hash = '#/';
      root!.innerHTML = '<div>로그인 되었습니다.</div>';
    }
  }

  login(){
    const email = this.#loginEmailInput!.value;
    const password = this.#loginPasswordInput!.value;
    const body = {email, password};
    fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
    .then(res => {
      window.alert(res.message);
      localStorage.setItem('token', res.token);
      this.checkAuth();
    })
    .catch(err => {
      console.error(err);
      window.alert('로그인에 실패했습니다.');
    })
  }

  register(){
    const email = this.#registerEmailInput!.value;
    const password = this.#registerPasswordInput!.value;
    const body = {email, password};
    console.log(body);
    fetch(`${baseUrl}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
    .then(res => {
      window.alert(res.message);
    })
    .catch(err => {
      console.error(err);
      window.alert('회원가입에 실패했습니다.');
    })
  }

  checkRegex(target:HTMLInputElement){
    return this.#regexRecord[target.id].test(target.value);
  }

  checkValidation(target:HTMLInputElement,msg?:string){
    const isValid = this.checkRegex(target);
    if(!isValid){
      target.style.border = '1px solid red';

    }else{
      target.style.border = '1px solid black';
    }
    return isValid;
  }

  checkRegisterValidation(target:HTMLInputElement){
    const isTargetValid = this.checkValidation(target);
    this.#registerValidation[target.id] = isTargetValid;

    const isRegisterValid = Object.values(this.#registerValidation).every(v => v);
    this.#registerSubmit!.disabled = !isRegisterValid;
  }

  formRender() {
    const template = `
      <div>
        <h1>Login</h1>
        <form>
          <input placeholder="email" id='login_email' />
          <input placeholder="password" id='login_password'  />
          <input type='submit' value='login' id='login_submit' />
        </form>
      </div>
      </br>
      <div>
        <h1>Register</h1>
        <form>
          <input placeholder="email" id='register_email'/>
          <input placeholder="password" id='register_password' />
          <input type='submit' value='register' id='register_submit'/>
        </form>
      </div>
    `;
    root!.innerHTML = template;
    this.#loginEmailInput = document.getElementById('login_email') as HTMLInputElement;
    this.#loginPasswordInput = document.getElementById('login_password') as HTMLInputElement;
    this.#loginSubmit = document.getElementById('login_submit') as HTMLInputElement;
    this.#registerEmailInput = document.getElementById('register_email') as HTMLInputElement;
    this.#registerPasswordInput = document.getElementById('register_password') as HTMLInputElement;
    this.#registerSubmit = document.getElementById('register_submit') as HTMLInputElement;
  }

  addEvent(){
    this.#loginSubmit?.addEventListener('click', (e) => {
      e.preventDefault();
      this.login()
    });
    this.#registerEmailInput?.addEventListener('focusout', (e) => this.checkRegisterValidation(e.target as HTMLInputElement));
    this.#registerPasswordInput?.addEventListener('focusout', (e) => this.checkRegisterValidation(e.target as HTMLInputElement));
    this.#registerSubmit?.addEventListener('click', (e) => {
      e.preventDefault();
      this.register();
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const auth = new Auth();
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
  auth.checkAuth();
})

window.addEventListener('hashchange', () => {
  const auth = new Auth();
  auth.checkAuth();
})