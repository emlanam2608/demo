const supabaseUrl = "https://boqvejxlbxsydunmbkcd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvcXZlanhsYnhzeWR1bm1ia2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMDE2NjYsImV4cCI6MjA0NTY3NzY2Nn0.gaRiKqws1M6HMGxb2Dge3Ab3UKD1wiBwz-gMRThGaG0";

class SupabaseClient {
  getSupabseUrl(table) {
    return `${supabaseUrl}/rest/v1/${table}?apikey=${supabaseKey}`;
  }

  async getComments({ limit, offset, blog_name }) {
    let url = this.getSupabseUrl("comments");
    url += `&limit=${limit}&offset=${offset}&order=created_at.desc&blog_name=eq.${blog_name}`;
    const response = await fetch(url);

    return response;
  }

  async postComment({ comment, blog_name }) {
    let url = this.getSupabseUrl("comments");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment, blog_name }),
    });

    return response;
  }
}

export default SupabaseClient;
