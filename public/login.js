document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
  
    if (registerForm) {
      registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('Email');
        const passwordInput = document.getElementById('password');
  
        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
  
        const newUser = { name, email, password };
  
        localStorage.setItem('user', JSON.stringify(newUser));
  
        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            window.location.href = 'mainscreen.html';
          })
          .catch(error => console.error('Error:', error));
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const emailInput = document.getElementById('login-Email');
        const passwordInput = document.getElementById('login-password');
  
        const email = emailInput.value;
        const password = passwordInput.value;
  
        const credentials = { email, password };
  
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            window.location.href = 'mainscreen.html';
          })
          .catch(error => console.error('Error:', error));
      });
    }
  });
  