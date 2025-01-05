module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                darkbg: '#121212',
                darkcard: '#1c1c1c',
                insetcard: '#161616',
                lightgray: '#c1c1c3',
                midgray: '#a1a1a3',
                primary: '#059669',
                secondary: '#04714F',
            },
            fontFamily: {
                primary: ['Lato', 'Helvetica', 'Arial', 'sans-serif'],
            },
            fontWeight: {
                thin: 100,
                light: 300,
                normal: 400,
                bold: 700,
                extrabold: 900,
            },
        },
    },
    plugins: [],
}
