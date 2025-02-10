import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		screens: {
  			'500': '500px',
  			'930': '930px'
  		},
  		fontFamily: {
  			manrope: [
  				'Manrope',
  				'sans-serif'
  			]
  		},
  		colors: {
  			lightblue: '#F1F0FF',
  			red: '#D73C3C',
  			'second-lightblue': 'rgba(231, 248, 252)',
  			'second-lightblue-hover': 'rgb(213, 244, 255)',
  			'third-lightblue': '#E6E9EC',
  			'fourth-lightblue': '#D2F0F8',
  			'sixth-lightblue': 'rgb(230, 248, 252)',
  			'deep-blue': 'rgb(123, 175, 250)',
  			'medium-gray': '#c0c0c0a',
  			'fifth-lightblue': 'rgba(229, 255, 230, 0.50)',
  			blue: '#367AFF',
  			'second-blue': '#3B86FF',
  			gray: '#ccc',
  			lightgray: '#CED4DA',
  			'second-lightgray': '#D0D0D0',
  			'third-lightgray': '#B1B1B1',
  			'fourth-lightgray': 'rgba(0, 0, 0, 0.20)',
  			'grayish-gray': '#5C6F88',
  			'dark-color': '#212529',
  			'form-line': 'rgba(116, 123, 149, 0.25)',
  			'svg-color': '#2E3A59',
  			file: '#f9f9f9',
  			'active-lightblue': '#E5FFE6',
  			'blue-500': 'rgba(59, 130, 246, 0.5)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'selection-box': '0px 10px 20px 1px rgba(0, 0, 0, 0.25)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate]
}