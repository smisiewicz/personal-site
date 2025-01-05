module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                dark_bg: '#161617',
                dark_card: '#28282a',
                dark_border: '#363638',
                dark_spacer_border: '#414143',
                dark_hover_border: '#48484a',
                dark_inset_card: '#1e1e20',
                dark_inset_border: '#303032',
                dark_text_primary: '#c1c1c3',
                dark_primary: '#059669',
                dark_secondary: '#04714f',
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
