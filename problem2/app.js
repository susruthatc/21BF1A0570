const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 9876;

const WINDOW_SIZE = 10;
let storedNumbers = [];


async function fetchNumbersFromServer(url) {
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
}

function addNumbers(numbers) {
    storedNumbers = [...storedNumbers, ...numbers];
    storedNumbers = [...new Set(storedNumbers)]; 
    if (storedNumbers.length > WINDOW_SIZE) {
        storedNumbers = storedNumbers.slice(-WINDOW_SIZE); 
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}


function formatResponse(prevState, currState, numbers, avg) {
    return {
        windowPrevState: prevState,
        windowCurrState: currState,
        numbers: numbers,
        avg: avg.toFixed(2) 
    };
}
app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    let url;

    
    switch (numberid) {
        case 'p':
            url = 'http://20.244.56.144/test/primes';
            break;
        case 'f':
            url = 'http://20.244.56.144/test/fibo';
            break;
        case 'e':
            url = 'http://20.244.56.144/test/even';
            break;
        case 'r':
            url = 'http://20.244.56.144/test/rand';
            break;
        default:
            return res.status(400).json({ error: 'Invalid number ID' });
    }

    const numbers = await fetchNumbersFromServer(url);

    if (numbers.length === 0) {
        return res.status(500).json({ error: 'Failed to fetch numbers or request timed out' });
    }

    const prevState = [...storedNumbers]; 
    addNumbers(numbers);
    const currState = [...storedNumbers]; 
    const avg = calculateAverage(storedNumbers);

    const response = formatResponse(prevState, currState, numbers, avg);
    res.json(response);
});


app.listen(PORT, () => {
    console.log(Serverisrunningonport$,{PORT});
});