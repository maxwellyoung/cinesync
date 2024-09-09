/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

module.exports = nextConfig;
