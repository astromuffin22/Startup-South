document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('userForm');

    if (userForm) {
        userForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('Email');
            const passwordInput = document.getElementById('password');

            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            if (event.submitter.id === 'loginBtn') {
                const credentials = { email, password };
            
                fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                })
                    .then(response => {
                        console.log(response)
                        response.json()
                        console.log(response)
                    })
                    .then(data => {
                        console.log(data)
                        console.log(data.status)
                        if (data.status == 500) {
                          alert(data.message);
                        } else {
                        //   window.location.href = 'mainscreen.html';
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else if (event.submitter.id === 'signupBtn') {
                const newUser = { name, email, password };

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
            }
        });
    }
});
