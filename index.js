import { registerUser } from './service';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('Email');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const name = nameInput.value;
        const email = emailInput.value;
    
        const newUser = { name, email };
    
        try {
            const serverResponse = await registerUser(newUser);
    
            localStorage.setItem('user', JSON.stringify(serverResponse));
    
            const existingUser = JSON.parse(localStorage.getItem('user'));
    
            if (existingUser) {
                alert(`Welcome back, ${existingUser.name}!`);
            } else {
                alert(`Welcome, ${name}! You've been signed up.`);
            }
    
            window.location.href = 'mainscreen.html';
        } catch (error) {
            console.error('Service error:', error);
        }
    });
    
});
