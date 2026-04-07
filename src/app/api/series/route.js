import sql from "../utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "popular";
    const query = searchParams.get("q") || "";
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 24;
    const offset = (page - 1) * limit;

    let results = [];

    // Handle detail fetch for single series
    if (type === "detail" && id) {
      const seriesResults = await sql`
        SELECT * FROM series 
        WHERE tmdb_id = ${parseInt(id)}
        LIMIT 1
      `;

      if (seriesResults.length === 0) {
        return Response.json({ error: "Series not found" }, { status: 404 });
      }

      const series = seriesResults[0];

      // Get recommendations (same genres, high rating)
      const recommendations = await sql`
        SELECT * FROM series 
        WHERE tmdb_id != ${parseInt(id)}
        AND genres && ${sql.array(series.genres || [])}::text[]
        ORDER BY vote_average DESC, popularity DESC
        LIMIT 10
      `;

      return Response.json({
        ...series,
        id: series.tmdb_id,
        title: series.title,
        poster_path: series.poster_path,
        backdrop_path: series.backdrop_path,
        vote_average: parseFloat(series.vote_average),
        first_air_date: series.first_air_date,
        number_of_seasons: series.number_of_seasons,
        number_of_episodes: series.number_of_episodes,
        genres: series.genres?.map((g) => ({ id: g, name: g })) || [],
        recommendations: {
          results: recommendations.map((r) => ({
            id: r.tmdb_id,
            title: r.title,
            poster_path: r.poster_path,
            first_air_date: r.first_air_date,
            vote_average: parseFloat(r.vote_average),
          })),
        },
      });
    }

    switch (type) {
      case "popular":
        results = await sql`
          SELECT * FROM series 
          ORDER BY popularity DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
        break;

      case "trending":
        results = await sql`
          SELECT * FROM series 
          ORDER BY vote_average DESC, popularity DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
        break;

      case "latest":
        results = await sql`
          SELECT * FROM series 
          ORDER BY first_air_date DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
        break;

      case "anime":
        results = await sql`
          SELECT * FROM series 
          WHERE language = 'ja'
          ORDER BY popularity DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
        break;

      case "kdrama":
        results = await sql`
          SELECT * FROM series 
          WHERE language = 'ko'
          ORDER BY popularity DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
        break;

      case "search":
        if (query) {
          results = await sql`
            SELECT * FROM series 
            WHERE LOWER(title) LIKE LOWER(${"%" + query + "%"})
            OR LOWER(original_title) LIKE LOWER(${"%" + query + "%"})
            ORDER BY popularity DESC
            LIMIT ${limit} OFFSET ${offset}
          `;
        }
        break;

      default:
        results = await sql`
          SELECT * FROM series 
          ORDER BY popularity DESC 
          LIMIT ${limit} OFFSET ${offset}
        `;
    }

    return Response.json({
      results: results.map((s) => ({
        id: s.tmdb_id,
        title: s.title,
        original_title: s.original_title,
        overview: s.overview,
        poster_path: s.poster_path,
        backdrop_path: s.backdrop_path,
        first_air_date: s.first_air_date,
        vote_average: parseFloat(s.vote_average),
        vote_count: s.vote_count,
        popularity: parseFloat(s.popularity),
        genres: s.genres,
        number_of_seasons: s.number_of_seasons,
        number_of_episodes: s.number_of_episodes,
      })),
    });
  } catch (error) {
    console.error("Error fetching series:", error);
    return Response.json(
      { error: "Failed to fetch series", results: [] },
      { status: 500 },
    );
  }
}
