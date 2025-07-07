export const onRequestGet: PagesFunction = async (context) => {
    const db = context.env.DB as D1Database
    const { results } = await db.prepare('SELECT * FROM survey_responses ORDER BY createdAt DESC LIMIT 100').all()
    return new Response(JSON.stringify({ responses: results }), { status: 200 })
  }
  
  export const onRequestPost: PagesFunction = async (context) => {
    const body = await context.request.json()
    const db = context.env.DB as D1Database
  
    await db.prepare(
      `INSERT INTO survey_responses (age, location, cityName, occupation, occupationOther, willVote, votingFactors, winningParty, competitionLevel, competitionOther, interests, expectations, expectationsOther, concerns, concernsOther, confidence, additionalComments, ipAddress, userAgent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      body.age,
      body.location,
      body.cityName,
      body.occupation,
      body.occupationOther,
      body.willVote,
      JSON.stringify(body.votingFactors),
      body.winningParty,
      body.competitionLevel,
      body.competitionOther,
      JSON.stringify(body.interests),
      body.expectations,
      body.expectationsOther,
      JSON.stringify(body.concerns),
      body.concernsOther,
      body.confidence,
      body.additionalComments,
      context.request.headers.get('cf-connecting-ip') || '',
      context.request.headers.get('user-agent') || ''
    ).run()
  
    return new Response(JSON.stringify({ success: true }), { status: 201 })
  }