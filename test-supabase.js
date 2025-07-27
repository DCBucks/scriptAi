// Test Supabase connection
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

async function testSupabase() {
  console.log("🔍 Testing Supabase Connection...\n");

  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("📋 Environment Variables:");
  console.log("URL:", url ? "✅ Set" : "❌ Missing");
  console.log("Key:", key ? "✅ Set" : "❌ Missing");

  if (!url || !key) {
    console.log("\n❌ Missing Supabase environment variables!");
    console.log("Please check your .env.local file has:");
    console.log("NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here");
    return;
  }

  // Test connection
  try {
    const supabase = createClient(url, key);
    console.log("\n🔗 Testing database connection...");

    // Try a simple query
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      if (error.code === "42P01") {
        console.log("❌ Database schema not created!");
        console.log(
          "You need to run the SQL schema in your Supabase dashboard."
        );
        console.log(
          "Copy the contents of supabase-schema.sql and run it in the SQL Editor."
        );
      } else {
        console.log("❌ Database error:", error.message);
        console.log("Error code:", error.code);
      }
    } else {
      console.log("✅ Supabase connection successful!");
      console.log("✅ Database schema exists!");
    }
  } catch (err) {
    console.log("❌ Connection failed:", err.message);
  }
}

testSupabase();
