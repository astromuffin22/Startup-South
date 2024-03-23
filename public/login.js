document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const newUser = { name, email, password };

        const submitButton = event.submitter;

        let url;
        if (submitButton.id === 'loginBtn') {
            url = '/api/login';
        } else if (submitButton.id === 'signupBtn') {
            url = '/api/register';
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login/signup');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = 'mainscreen.html';
        })
        .catch(error => console.error('Error:', error));
    });
});
