// Get environment variable values for Vercel setup
require("dotenv").config({ path: ".env.local" });

console.log("🔑 Environment Variables for Vercel:\n");
console.log("NEXT_PUBLIC_SUPABASE_URL:");
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("\nNEXT_PUBLIC_SUPABASE_ANON_KEY:");
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log("\n📝 Copy these values to add to Vercel...");
