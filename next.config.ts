import type { NextConfig } from "next";

const DEFAULT_BACKEND_API_BASE_URL = "http://localhost:3333";
const backendApiBaseUrl =
	process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") ??
	DEFAULT_BACKEND_API_BASE_URL;

const nextConfig: NextConfig = {
	distDir: process.env.NEXT_DIST_DIR ?? ".next",
	images: {
		remotePatterns: [
			{
				hostname: "images.unsplash.com",
				protocol: "https",
			},
			{
				hostname: "localhost",
				port: "3000",
				protocol: "http",
			},
			{
				hostname: "localhost",
				port: "3333",
				protocol: "http",
			},
		],
	},
	rewrites: async () => [
		{
			destination: `${backendApiBaseUrl}/:path*`,
			source: "/backend-api/:path*",
		},
	],
};

export default nextConfig;
