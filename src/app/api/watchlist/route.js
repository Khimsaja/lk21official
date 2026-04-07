import sql from "../utils/sql";

// Get watchlist
export async function GET(request) {
  try {
    const userId = "guest"; // Default user for now

    const watchlist = await sql`
      SELECT 
        w.id,
        w.added_at,
        CASE 
          WHEN w.movie_id IS NOT NULL THEN 'movie'
          ELSE 'series'
        END as type,
        COALESCE(m.tmdb_id, s.tmdb_id) as item_id,
        COALESCE(m.tmdb_id, s.tmdb_id) as tmdb_id,
        COALESCE(m.title, s.title) as title,
        COALESCE(m.poster_path, s.poster_path) as poster_path,
        COALESCE(m.backdrop_path, s.backdrop_path) as backdrop_path,
        COALESCE(m.vote_average, s.vote_average) as vote_average,
        COALESCE(m.release_date::text, s.first_air_date::text) as release_date,
        COALESCE(m.overview, s.overview) as overview
      FROM watchlist w
      LEFT JOIN movies m ON w.movie_id = m.id
      LEFT JOIN series s ON w.series_id = s.id
      WHERE w.user_id = ${userId}
      ORDER BY w.added_at DESC
    `;

    return Response.json({ results: watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return Response.json(
      { error: "Failed to fetch watchlist", results: [] },
      { status: 500 },
    );
  }
}

// Add to watchlist
export async function POST(request) {
  try {
    const body = await request.json();
    const { itemId, type } = body; // itemId is tmdb_id, type: 'movie' or 'series'
    const userId = "guest";

    if (!itemId || !type) {
      return Response.json(
        { error: "itemId and type are required" },
        { status: 400 },
      );
    }

    if (type === "movie") {
      // Look up movie by tmdb_id to get the internal id
      const movie = await sql`SELECT id FROM movies WHERE tmdb_id = ${parseInt(itemId)} LIMIT 1`;
      if (movie.length === 0) {
        return Response.json({ error: "Movie not found" }, { status: 404 });
      }
      await sql`
        INSERT INTO watchlist (user_id, movie_id)
        VALUES (${userId}, ${movie[0].id})
        ON CONFLICT DO NOTHING
      `;
    } else if (type === "series") {
      // Look up series by tmdb_id to get the internal id
      const series = await sql`SELECT id FROM series WHERE tmdb_id = ${parseInt(itemId)} LIMIT 1`;
      if (series.length === 0) {
        return Response.json({ error: "Series not found" }, { status: 404 });
      }
      await sql`
        INSERT INTO watchlist (user_id, series_id)
        VALUES (${userId}, ${series[0].id})
        ON CONFLICT DO NOTHING
      `;
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return Response.json(
      { error: "Failed to add to watchlist" },
      { status: 500 },
    );
  }
}

// Remove from watchlist
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const type = searchParams.get("type");
    const userId = "guest";

    if (!itemId || !type) {
      return Response.json(
        { error: "itemId and type are required" },
        { status: 400 },
      );
    }

    if (type === "movie") {
      const movie = await sql`SELECT id FROM movies WHERE tmdb_id = ${parseInt(itemId)} LIMIT 1`;
      if (movie.length > 0) {
        await sql`
          DELETE FROM watchlist
          WHERE user_id = ${userId} AND movie_id = ${movie[0].id}
        `;
      }
    } else if (type === "series") {
      const series = await sql`SELECT id FROM series WHERE tmdb_id = ${parseInt(itemId)} LIMIT 1`;
      if (series.length > 0) {
        await sql`
          DELETE FROM watchlist
          WHERE user_id = ${userId} AND series_id = ${series[0].id}
        `;
      }
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return Response.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 },
    );
  }
}
