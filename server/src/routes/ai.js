
import { Router } from 'express';
import OpenAI from 'openai';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/recipe', async (req, res, next) => {
  try {
    const {
      ingredients = [],
      goal = 'balanced',
      diet = 'anything',
      budget,
      servings = 2
    } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length > 40) {
      return res.status(400).json({
        message: 'Provide up to 40 ingredients'
      });
    }

    // Fallback when OpenAI API key is not configured
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        source: 'demo-fallback',
        recipe: {
          title: 'Quick balanced pantry bowl',
          description:
            'A flexible meal idea using your available ingredients. Adjust portions to your needs.',
          prepMinutes: 20,
          servings,
          ingredients: ingredients.map(name => ({
            name,
            quantity: 1,
            unit: 'as needed'
          })),
          instructions: [
            'Prepare and wash the available ingredients.',
            'Cook grains or base ingredients until tender.',
            'Combine ingredients, season to taste and serve.'
          ],
          nutrition: {
            calories: 420,
            protein: 22,
            carbs: 52,
            fat: 13,
            fiber: 8
          },
          note: 'Illustrative nutrition estimate. Add an API key for AI-generated recipes.'
        }
      });
    }

    // Initialize OpenAI
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Generate recipe
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: {
        type: 'json_object'
      },
      messages: [
        {
          role: 'system',
          content: `
            You are a careful AI nutrition and recipe assistant.

            Return valid JSON containing:
            - title
            - description
            - prepMinutes
            - servings
            - ingredients (name, quantity, unit)
            - instructions (array)
            - nutrition (calories, protein, carbs, fat, fiber)
            - note

            Respect dietary preferences and allergies.
            Nutrition values must be estimates.
            Never provide medical advice.
          `
        },
        {
          role: 'user',
          content: JSON.stringify({
            ingredients,
            goal,
            diet,
            budget,
            servings,
            allergies: req.user.profile?.allergies || []
          })
        }
      ],
      temperature: 0.7
    });

    const recipe = JSON.parse(
      response.choices[0].message.content
    );

    return res.json({
      source: 'openai',
      recipe
    });

  } catch (error) {
    next(error);
  }
});

export default router;
