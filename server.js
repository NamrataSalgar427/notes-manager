const express = require('express');
const path=require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about',(req,res)=>{
    res.send("This is the notes manager app");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});