/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: { serverComponentsExternalPackages: ['sequelize'] },
	webpack: (config) => {
		config.externals['utf-8-validate'] = 'utf-8-validate';
		config.externals['bufferutil'] = 'bufferutil';
		// Important: return the modified config
		return config;
	},
};

module.exports = nextConfig;
