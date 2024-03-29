document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('userForm');

// Clear token instead
    localStorage.removeItem("user")

    if (userForm) {
        userForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('Email');
            const passwordInput = document.getElementById('password');

            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            let payload,
                path,
                successMessage;
            if (event.submitter.id === 'loginBtn') {
                payload = { email, password };
                path = '/api/login';
                successMessage = "CONGRATS you have loggggged in <3";
            }else if (event.submitter.id === 'signupBtn') {
                payload = { name, email, password };
                path = '/api/register';
                successMessage = "CONGRATS U SIGNED UP and now ur about to enter into a world of new imagination <3";
            }
            
            fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json().then(data => ({
                    data:data,
                    isOk:response.ok
                })))
                .then(info => {
                    if (!info.isOk) {
                        alert(info.data.message);
                    } else {
                        alert(successMessage)
                        // Set token instead of user info
                        localStorage.setItem("user", JSON.stringify({
                            "name":name,
                            "email":email,
                            "password":password
                        }))
                        window.location.href = 'mainscreen.html';
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }
});
