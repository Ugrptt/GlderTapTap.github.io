// Oyuncunun puanını ve arkadaşlarını localStorage'da tut
let score = localStorage.getItem('userScore') ? parseInt(localStorage.getItem('userScore')) : 0;
let friends = JSON.parse(localStorage.getItem('friends')) || [];
const scoreDisplay = document.getElementById('score');
const taskModal = document.getElementById('task-modal');
const friendsModal = document.getElementById('friends-modal');
const rankingModal = document.getElementById('ranking-modal');
const closeModal = document.querySelectorAll('.close');
const links = document.querySelectorAll('#task-modal a');
const timerText = document.getElementById('timer-text');
const timerBarFill = document.getElementById('timer-bar-fill');
const claimBtn = document.getElementById('claim-btn');
const referralCodeDisplay = document.getElementById('referral-code');
const referralLinkInput = document.getElementById('referral-link');
const friendsList = document.getElementById('friends-list');
const displayUsername = document.getElementById('display-username');
let timer; // Zamanlayıcı referansı
let endTime; // Zamanın sonlandığı zaman
const timerDuration = 600; // 10 dakika (600 saniye)

// Skoru göster
scoreDisplay.innerText = `$GLDER: ${score}`;

// Kullanıcıya Telegram referans numarası ata
const telegramUserID = Math.floor(Math.random() * 100000);
const referralCode = `referral_${telegramUserID}`;
referralCodeDisplay.textContent = referralCode;
referralLinkInput.value = `https://t.me/GlderTap_bot?start=${referralCode}`;

// Puan ekleme fonksiyonu
function addPoints(points) {
    score += points;
    localStorage.setItem('userScore', score);
    scoreDisplay.innerText = `$GLDER: ${score}`;
}

// Arkadaşları güncelle ve listele
function displayFriends() {
    friendsList.innerHTML = '';
    friends.forEach(friend => {
        const li = document.createElement('li');
        li.textContent = `Kullanıcı: ${friend.username}`;
        friendsList.appendChild(li);
    });
}

// Arkadaş ekle ve puan kazandır
function friendJoined(friendUsername) {
    if (!friends.some(f => f.username === friendUsername)) {
        friends.push({ username: friendUsername });
        localStorage.setItem('friends', JSON.stringify(friends));
        addPoints(100); // Her arkadaş için 100 puan
        displayFriends();
    }
}

// Zamanlayıcıyı başlat
function startTimer() {
    const storedEndTime = localStorage.getItem('endTime');
    
    if (storedEndTime) {
        endTime = parseInt(storedEndTime); // Kayıtlı bitiş zamanını al
    } else {
        endTime = Date.now() + timerDuration * 1000; // Yeni bir bitiş zamanı oluştur
        localStorage.setItem('endTime', endTime); // Kayıt et
    }

    updateTimer(); // Zamanlayıcıyı güncelle
    timer = setInterval(updateTimer, 1000); // Her saniyede güncelle
}

// Zamanlayıcıyı güncelle
function updateTimer() {
    const now = Date.now();
    const remainingTime = Math.max(0, endTime - now); // Kalan zamanı hesapla

    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    timerText.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Zaman metnini güncelle
    timerBarFill.style.width = `${(remainingTime / (timerDuration * 1000)) * 100}%`; // Barı güncelle

    if (remainingTime <= 0) {
        clearInterval(timer);
        claimBtn.style.display = 'block'; // Claim butonunu göster
        localStorage.removeItem('endTime'); // Süre dolduğunda kayıtı sil
    }
}

// Claim butonuna tıklandığında
claimBtn.onclick = function() {
    addPoints(250); // 250 puan ekle
    alert('250 puan kazandınız!'); // Kullanıcıya bilgi ver
    claimBtn.style.display = 'none'; // Claim butonunu gizle
    endTime = Date.now() + timerDuration * 1000; // Yeni bir bitiş zamanı oluştur
    localStorage.setItem('endTime', endTime); // Kayıt et
    updateTimer(); // Zamanlayıcıyı güncelle
};

// Görevler linklerini tıklanabilir hale getirme
links.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.classList.contains('completed')) {
            const points = parseInt(this.getAttribute('data-points'));
            addPoints(points);
            this.classList.add('completed');
            this.querySelector('.checkmark').style.display = 'inline';
            document.getElementById('confirmation-message').style.display = 'block';
            window.open(this.href, '_blank'); // Linki yeni sekmede aç
        } else {
            alert('Bu görevden daha önce puan aldınız!');
        }
    });
});

// Modal kapatma butonları
closeModal.forEach(button => {
    button.onclick = function() {
        button.parentElement.parentElement.style.opacity = '0';
        setTimeout(() => {
            taskModal.style.display = 'none';
            friendsModal.style.display = 'none';
            rankingModal.style.display = 'none';
        }, 300);
    };
});

// Görev butonuna tıklandığında modalı aç
document.getElementById('task-btn').onclick = function() {
    taskModal.style.display = 'block';
    taskModal.style.opacity = '0';
    setTimeout(() => {
        taskModal.style.opacity = '1';
    }, 10);
};

// Arkadaş butonuna tıklandığında modalı aç
document.getElementById('friends-btn').onclick = function() {
    friendsModal.style.display = 'block';
    friendsModal.style.opacity = '0';
    setTimeout(() => {
        friendsModal.style.opacity = '1';
    }, 10);
    displayFriends(); // Arkadaşları göster
};

// Sıralama butonuna tıklandığında modalı aç
document.getElementById('ranking-btn').onclick = function() {
    rankingModal.style.display = 'block';
    rankingModal.style.opacity = '0';
    setTimeout(() => {
        rankingModal.style.opacity = '1';
    }, 10);
    displayRanking(); // Sıralamayı göster
};

// Geri butonları
document.getElementById('back-btn').onclick = function() {
    taskModal.style.display = 'none';
};

document.getElementById('back-btn-friends').onclick = function() {
    friendsModal.style.display = 'none';
};

document.getElementById('back-btn-ranking').onclick = function() {
    rankingModal.style.display = 'none';
};

// Sıralama Gösterimi
function displayRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<li>Çok Yakında</li>'; // "Çok Yakında" mesajı
}

// Kullanıcı adı kaydetme
function displaySavedUsername() {
    const savedUsername = localStorage.getItem('telegramUsername');
    if (savedUsername) {
        displayUsername.innerText = `Telegram Kullanıcı Adı: ${savedUsername}`;
    } else {
        displayUsername.innerText = 'Telegram Kullanıcı Adı: Bulunamadı';
    }
}

// Sayfa yüklendiğinde kullanıcı adını göster
window.onload = function() {
    displaySavedUsername();
};

// Linki kopyala
document.getElementById('copy-link').onclick = function() {
    referralLinkInput.select();
    document.execCommand('copy');
    alert('Link kopyalandı!');
};

// Oyun başladığında veya sayfa yüklendiğinde zamanlayıcıyı başlat
startTimer();
