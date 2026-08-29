


import axios from "axios";
import { Router } from "express";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const resAi = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
      
        model: "meta-llama/llama-3.3-70b-instruct",
        models: [
          "meta-llama/llama-3.3-70b-instruct:free",
          "qwen/qwen-2.5-72b-instruct:free",
        ],
        messages: [
          {
            role: "user",
            content: `Write a detailed blog post about: ${prompt}.

Include an engaging introduction, main content with subheadings,
and a conclusion. Make it informative and well-structured.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEYS}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedContent = resAi.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      content: generatedContent,
    });

  } catch (error) {
    console.error("AI Generation Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI content",
      error: error.response?.data || error.message,
    });
  }
});

export default router;