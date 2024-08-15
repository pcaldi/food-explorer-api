const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
})

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port 🚀 ${PORT}`);
})
