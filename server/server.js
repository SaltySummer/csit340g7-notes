import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }))

app.get('/notes', async (req, res) => {
    const { data, error } = await supabase.from('notes').select().order('id')
  if (error) {
    return res.status(500).json({ error: error.message })
  }
  res.json(data)
 })

app.listen(3000, (error) => {
  if (error) throw error
  console.log('Server running at http://localhost:3000')
})