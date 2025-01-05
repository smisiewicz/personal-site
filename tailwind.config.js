module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                dark_bg: '#18181b',
                dark_card: '#28282b',
                dark_border: '#36363a',
                dark_spacer_border: '#414145',
                dark_hover_border: '#48484c',
                dark_inset_card: '#1e1e20',
                dark_inset_border: '#30302d',
                dark_text_primary: '#c1c1c3',
                dark_primary: '#059669',
                dark_secondary: '#04714F',
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
