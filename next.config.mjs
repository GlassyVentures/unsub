/** @type {import('next').NextConfig} */
import { withPlausibleProxy } from 'next-plausible'

export default withPlausibleProxy()({
  reactStrictMode: true,
  swcMinify: true,
})
