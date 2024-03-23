document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('Email').value;
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
            if (data.token) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'mainscreen.html';
            } else {
                console.error('Token not found in response:', data);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
