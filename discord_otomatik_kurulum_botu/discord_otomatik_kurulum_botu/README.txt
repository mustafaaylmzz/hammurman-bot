DISCORD OTOMATİK SUNUCU KURULUM BOTU

GEREKENLER
- Node.js (LTS sürümü)
- Discord Developer Portal'dan oluşturulmuş bir bot
- Botun sunucuda Kanalları Yönet (Manage Channels) ve Uygulamaları Komutları (Use Application Commands) izinleri

KURULUM
1. ZIP dosyasını bir klasöre çıkar.
2. Node.js kurulu değilse nodejs.org üzerinden LTS sürümünü kur.
3. Klasörün içinde terminal/CMD aç.
4. Şu komutu çalıştır:
   npm install
5. .env.example dosyasının adını .env yap.
6. .env dosyasına şu bilgileri gir:
   DISCORD_TOKEN=Bot tokeni
   CLIENT_ID=Developer Portal > General Information > Application ID
   GUILD_ID=Discord sunucu ID'si
7. Discord Developer Portal > Bot bölümünde botu oluştur ve sunucuna davet et.
   OAuth2 URL Generator bölümünde scopes olarak bot ve applications.commands seç.
   Bot izinlerinde Manage Channels ve View Channels ver.
8. Botu başlat:
   npm start
9. Discord sunucunda /kurulum komutunu kullan.

ÖNEMLİ
- Bot tokenini kimseyle paylaşma ve ekran görüntüsünde gösterme.
- /kurulum komutu yalnızca Administrator yetkisi olan kişilerde görünür/kullanılır.
- Her /kurulum çalıştırmasında kategoriler yeniden oluşturulur. Mevcut kategorileri otomatik silmez.
- Kanallar kategoriye bağlı olarak oluşturulur.
- Bot rolünün sunucu rol listesinde yeterince yukarıda olduğundan emin ol.

SES KANALLARI
- Genel Sohbet
- Oyun Odası 1
- Oyun Odası 2
- Oyun Odası 3
- Müzik
- AFK
- Toplantı Odası
