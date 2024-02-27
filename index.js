document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('Email');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const email = emailInput.value;

        const existingUser = JSON.parse(localStorage.getItem(email));

        if (existingUser) {
            alert(`Welcome back, ${existingUser.name}!`);
        } else {
            const newUser = { name, email };
            localStorage.setItem(email, JSON.stringify(newUser));
            alert(`Welcome, ${name}! You've been signed up.`);
        }

        window.location.href = 'mainscreen.html';
    });
});
