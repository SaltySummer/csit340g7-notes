import express from "express";

const app = express();

app.get('/notes', (req, res) => {
  res.json([
    { id: 1, title: 'Hello from the server', body: 'This note is written in server.js.' },
  ])
})
 
app.listen(3000, (error) => {
  if (error) throw error
  console.log('Server running at http://localhost:3000')
})