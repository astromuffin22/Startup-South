document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('Email');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;

        const newUser = { name, email };

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
});
