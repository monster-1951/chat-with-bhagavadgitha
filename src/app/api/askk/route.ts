

export async function POST(req: Request) {
  const { input } = await req.json();



  // Return the extracted response
  return Response.json({
    input,
    content:"The Bhagavad Gita mentions three main types of Yoga: Karma Yoga, Bhakti Yoga, and Jnana Yoga. Karma Yoga focuses on selfless action and performing duties without attachment to the results. Bhakti Yoga emphasizes devotion and love for a higher power, while Jnana Yoga focuses on knowledge and self-realization through understanding the true nature of the self."
  });
}
