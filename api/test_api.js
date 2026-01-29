fetch('http://localhost:3000/api/products')
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Data received:', JSON.stringify(data, null, 2));
    })
    .catch(err => console.error('Error fetching:', err));
