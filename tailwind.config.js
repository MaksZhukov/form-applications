/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/_components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			},
			flex: {
				0.5: '0.5',
				0.25: '0.25'
			}
		},
		container: {
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem'
			}
		},
		colors: {
			accent: '#0097b2'
		}
	},
	plugins: []
});
