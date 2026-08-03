# PROMPTS.md — AI Product Description Generator

This document logs the prompt variations tested for the **AI Product Description Generator** feature (`POST /api/ai/generate-description`), which calls the Hugging Face Inference API (`meta-llama/Llama-3.1-8B-Instruct`).

## System / Role

No separate system message is used. The role and instructions are combined into a single user message sent to the chat completion endpoint.

## Sample Input (used for all three variations)

```json
{
  "name": "Handwoven Jute Tote Bag",
  "category": "Bags",
  "material": "Jute and cotton lining",
  "features": "Reinforced handles, inner zip pocket, foldable, eco-friendly"
}
```

## Variation 1 — Minimal instruction

**Prompt:**