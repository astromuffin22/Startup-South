document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const usernameElement = document.querySelector('.username');
    const randomDogImage = document.getElementById('randomdog');

    if (usernameElement && storedUser) {
        usernameElement.textContent = storedUser.name;
    }

    if (randomDogImage) {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                fetch('/api/dogImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageUrl: data.message }),
                });
            });
    }
});
