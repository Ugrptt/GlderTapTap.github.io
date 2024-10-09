const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');
require('dotenv').config();

const token = '7285054543:AAHH8_znE_T9WANMlzBKZCvO5ji0hLAV1u0'; // Telegram bot tokenini buraya yerleştir
const bot = new TelegramBot(token, { polling: true });

// Kullanıcıları saklamak için dosya
const usersFile = 'users.json';

// Kullanıcıları dosyadan oku
function readUsers() {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify([])); // Dosya yoksa oluştur
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

// Kullanıcıyı dosyaya ekle
function saveUser(user) {
    const users = readUsers();
    users.push(user);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2)); // Kullanıcıyı dosyaya kaydet
}

// Referans kodu oluşturma
function generateReferralCode() {
    return crypto.randomBytes(4).toString('hex'); // 8 karakterli rastgele referans kodu
}

// /start komutu
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || "Bilinmiyor"; // Kullanıcı adı

    // Kullanıcıyı dosyaya kaydet
    const users = readUsers();
    const existingUser = users.find(user => user.telegramId === msg.from.id);

    if (!existingUser) {
        const referralCode = generateReferralCode(); // Yeni bir referans kodu oluştur
        const newUser = {
            telegramId: msg.from.id,
            username: username,
            firstName: msg.from.first_name,
            referralCode: referralCode, // Referans kodunu kaydet
        };
        saveUser(newUser);
        bot.sendMessage(chatId, `Merhaba ${msg.from.first_name}! Referans Kodunuz: ${referralCode}`);
    } else {
        // Kullanıcı zaten varsa, referans kodunu al
        const referralCode = existingUser.referralCode;
        bot.sendMessage(chatId, `Merhaba ${msg.from.first_name}! Referans Kodunuz: ${referralCode}`);
    }
});
