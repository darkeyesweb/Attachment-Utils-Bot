const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:8000/api/discord/callback');

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?clientid=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});