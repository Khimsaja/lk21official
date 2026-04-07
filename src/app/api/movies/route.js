import sql from "../utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const query = searchParams.get("q");
  const id = searchParams.get("id");
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 24;
  const offset = (page - 1) * limit;

  try {
    let movies = [];

    if (type === "detail" && id) {
      // Get single movie detail with recommendations
      const movieResults = await sql`
        SELECT * FROM movies 
        WHERE tmdb_id = ${parseInt(id)}
        LIMIT 1
      `;

      if (movieResults.length === 0) {
        return Response.json({ error: "Movie not found" }, { status: 404 });
      }

      const movie = movieResults[0];

      // Get recommendations (same genres, high rating)
      // Use array overlap operator with proper casting
      const recommendations = await sql`
        SELECT * FROM movies 
        WHERE tmdb_id != ${parseInt(id)}
        AND genres && ${sql.array(movie.genres || [])}::text[]
        ORDER BY vote_average DESC, popularity DESC
        LIMIT 10
      `;

      return Response.json({
        ...movie,
        id: movie.tmdb_id,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: parseFloat(movie.vote_average),
        genres: movie.genres?.map((g) => ({ id: g, name: g })) || [],
        recommendations: {
          results: recommendations.map((r) => ({
            id: r.tmdb_id,
            title: r.title,
            poster_path: r.poster_path,
            release_date: r.release_date,
            vote_average: parseFloat(r.vote_average),
          })),
        },
      });
    }

    if (type === "search" && query) {
      movies = await sql`
        SELECT * FROM movies 
        WHERE LOWER(title) LIKE LOWER(${"%" + query + "%"})
        ORDER BY popularity DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (type === "latest") {
      movies = await sql`
        SELECT * FROM movies 
        ORDER BY release_date DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (type === "popular") {
      movies = await sql`
        SELECT * FROM movies 
        WHERE vote_count > 1000
        ORDER BY vote_average DESC, popularity DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      // trending - Realtime from TMDB with auto DB cache
      try {
        const TMDB_KEY = '4e44d9029b1270a757cddc766a1bcb63';
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}&page=${page}`);
        if (!res.ok) throw new Error("TMDB fetch failed");
        const tmdbData = await res.json();
        const tmdbMovies = tmdbData.results;
        
        movies = tmdbMovies.map(m => ({
          tmdb_id: m.id,
          title: m.title || 'Unknown',
          original_title: m.original_title || m.title || 'Unknown',
          overview: m.overview || '',
          poster_path: m.poster_path || '',
          backdrop_path: m.backdrop_path || '',
          release_date: m.release_date || null,
          vote_average: parseFloat(m.vote_average) || 0,
          vote_count: m.vote_count || 0,
          popularity: parseFloat(m.popularity) || 0,
          genres: [],
          runtime: 0,
          language: m.original_language || 'en'
        }));

        // Instantly save to our DB so the detail/watch page doesn't 404
        if (movies.length > 0) {
          await sql`
            INSERT INTO movies ${sql(movies, 'tmdb_id', 'title', 'original_title', 'overview', 'poster_path', 'backdrop_path', 'release_date', 'vote_average', 'vote_count', 'popularity', 'genres', 'runtime', 'language')}
            ON CONFLICT (tmdb_id) DO UPDATE SET popularity = EXCLUDED.popularity
          `;
        }
      } catch (err) {
        console.error("Realtime fetch failed, fallback to DB:", err);
        movies = await sql`
          SELECT * FROM movies 
          ORDER BY popularity DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      }
    }

    return Response.json({
      results: movies.map((m) => ({
        id: m.tmdb_id,
        title: m.title,
        original_title: m.original_title,
        overview: m.overview,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        vote_average: parseFloat(m.vote_average),
        vote_count: m.vote_count,
        popularity: parseFloat(m.popularity),
        genres: m.genres,
        runtime: m.runtime,
      })),
    });
  } catch (error) {
    console.error("Movie API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
