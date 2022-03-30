let loginBtn = document.querySelector('#login-btn');

loginBtn.addEventListener('click', async () => {
  let user = document.querySelector('#username');
  let pswd = document.querySelector('#password');

  const URL ='http://localhost:8081/login';

  const jsonString = JSON.stringify({
    "username": user.value,
    "password": pswd.value
  })

  let res = await fetch(URL, {
    method: 'POST',
    body: jsonString
  });

  if(res.status === 200) {
    let user = await res.json();

    let token = res.headers.get('Token');
    localStorage.setItem('jwt', token);
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_role', user.userRole);

    if(user.userRole === "employee") {
      window.location = './employee.html';
    } else if(user.userRole === "finance manager") {
      window.location = './manager.html';
    } else {
      let errMsg = await res.text();
      console.log(errMsg);
      
      let errorEl = document.querySelector("#error");
      errorEl.innerHTML = errMsg;
    }
  }
})