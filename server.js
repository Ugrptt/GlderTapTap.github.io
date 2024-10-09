const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Kullanıcı bilgilerini almak için API
app.get('/api/user/:telegramId', (req, res) => {
    const usersFile = 'users.json';
    const users = JSON.parse(fs.readFileSync(usersFile));

    const user = users.find(u => u.telegramId == req.params.telegramId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
