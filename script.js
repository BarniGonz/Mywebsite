const stripe = Stripe('JS7GSK-762H28-JSHUSJH'); // Replace with your actual Stripe public key

document.querySelectorAll('.buyBtn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const price = event.target.parentElement.dataset.price;

        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ price })
        });

        const sessionId = await response.json();

        const result = await stripe.redirectToCheckout({sessionId: sessionId.id});
        if (result.error) {
            document.getElementById('actionBar').innerText = result.error.message;
        }
    });
});
