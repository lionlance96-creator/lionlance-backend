const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('OK'));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/api/jobs', (req, res) => res.json([]));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
