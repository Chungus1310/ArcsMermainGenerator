/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: {
	  unoptimized: true
	},
	trailingSlash: true,
	distDir: 'dist',
	assetPrefix: './' // Add this to ensure assets load correctly
  }
  
  module.exports = nextConfig