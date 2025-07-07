const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PAYSTACK_SECRET_KEY = 'sk_test_7219cd376522e4c402c9c282980042bdc7ce2622'; // Replace with .env later

app.post('/pay', async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: 'Email and amount are required' });
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
        callback_url: 'https://example.com/payment/success',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json(response.data.data);
  } catch (err) {
    console.error('Paystack error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
