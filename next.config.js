/** @type {import('next').NextConfig} */
const nextConfig = {
  // framer-motion's AnimatePresence doesn't play well with React 18 strict-mode
  // double-mounting in dev — exiting components can linger in the DOM. Disable
  // strict-mode double-invocation so in-dev behavior matches production.
  reactStrictMode: false,
}

module.exports = nextConfig
