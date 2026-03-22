// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. MongoDB 연결 (MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// 2. Schema 정의 (일기와 분석 결과를 한 곳에 저장)
const diarySchema = new mongoose.Schema({
  content: String,
  analysis: Object, // AI가 준 JSON을 그대로 저장
  createdAt: { type: Date, default: Date.now }
});
const Diary = mongoose.model('Diary', diarySchema);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 3. 분석 API
app.post('/api/analyze', async (req, res) => {
  const { content } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "일기를 분석해 JSON 응답: { score: 수치, emotions: [{label, value}], stress: [], recovery: [], advice: '' }" },
        { role: "user", content }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    const newDiary = new Diary({ content, analysis });
    await newDiary.save(); // DB에 저장

    res.json(newDiary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => console.log('Server on 4000'));