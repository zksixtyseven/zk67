import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured')
    }

    // Create varied, funny prompts for the number 67
    const memeStyles = [
      'the number 67 as a cool cyberpunk hacker character with sunglasses and neon green Matrix code flowing around it',
      'the number 67 doing a victory dance with neon green Matrix rain in the background, dramatic lighting',
      'the number 67 as a superhero flying through cyberspace with Matrix-style green code trails',
      'the number 67 sitting on a throne made of binary code with neon green Matrix effects',
      'the number 67 as a DJ with turntables, surrounded by Matrix green digital rain and neon lights',
      'the number 67 as a martial artist doing a kung-fu pose with Matrix code flowing around dramatically',
      'the number 67 wearing a trench coat like Neo from The Matrix, green code rain falling',
      'the number 67 breaking through a wall of green Matrix code like a champion',
      'the number 67 as a wizard casting spells made of neon green code in Matrix style',
      'the number 67 riding a motorcycle through a tunnel of Matrix green code'
    ]

    const randomPrompt = memeStyles[Math.floor(Math.random() * memeStyles.length)]
    const fullPrompt = `Create a funny, memeable image in Matrix movie style with dark background and bright neon green glowing effects. Show ${randomPrompt}. Digital art style, high contrast, cyberpunk aesthetic, dramatic and humorous.`

    console.log('Generating meme with prompt:', fullPrompt)

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI gateway error:', response.status, errorText)
      throw new Error(`AI gateway error: ${response.status}`)
    }

    const data = await response.json()
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    console.log('Meme generated successfully')

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in generate-meme function:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
