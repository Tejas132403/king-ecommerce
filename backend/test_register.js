async function testRegister() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'New Test User',
                email: 'newtest@gmail.com',
                password: 'password123',
                role: 'customer'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (e) {
        console.error('Error:', e);
    }
}
testRegister();
