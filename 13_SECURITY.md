# 13 — SECURITY (Veri Güvenliği ve Yedekleme)

## 1. Tehdit Modeli

Uygulama tamamen offline ve tek kullanıcı odaklı çalıştığından, ana risk alanları **uzak saldırı değil, veri kaybı ve yerel erişim**dir:

- Disk arızası / uygulama çökmesi sırasında veri bozulması
- Kullanıcının yanlışlıkla veri silmesi
- Cihaz kaybı/çalınması durumunda hassas verilere erişim

## 2. Veri Şifreleme

- SQLite veritabanı dosyası, **SQLCipher** (AES-256) ile şifrelenir
- Şifreleme anahtarı, OS'nin güvenli depolama API'si (Windows: DPAPI, macOS: Keychain, Linux: Secret Service) üzerinden yönetilir — kullanıcı ayrı bir şifre yönetmek zorunda kalmaz
- Opsiyonel: kullanıcı uygulama açılışında ek bir PIN/parola talep edebilir (ayarlardan aktif edilir)

## 3. Yedekleme Stratejisi

- **Otomatik yedekleme:** Her gün ilk açılışta ve her 50 yazma işleminde bir, zaman damgalı yedek `backups/` klasörüne alınır
- **Yedek rotasyonu:** Son 30 günlük yedek saklanır, daha eskiler otomatik temizlenir (disk şişmesini önlemek için)
- **Manuel yedekleme:** Kullanıcı istediği an "Şimdi Yedekle" butonuyla anlık yedek alabilir
- **Yedekten geri yükleme:** Ayarlar → Yedekler ekranından herhangi bir yedek noktasına dönülebilir (geri yükleme öncesi mevcut durumun da yedeği alınır — "yedeksiz geri yükleme" asla yapılmaz)

## 4. Veri Bütünlüğü Kontrolleri

- Her yazma işlemi SQLite transaction içinde yapılır — yarım kalan yazma asla veri bozulmasına yol açmaz (atomicity)
- Uygulama açılışında checksum/bütünlük kontrolü yapılır; bozulma tespit edilirse kullanıcıya en son sağlam yedeğe dönme seçeneği sunulur

## 5. Silme Güvenliği

- Tüm silme işlemleri varsayılan olarak **soft delete**'tir (bkz. 03_DATABASE.md §1)
- Kalıcı silme (hard delete), yalnızca "Çöp Kutusu" ekranından, çift onaylı ve geri alınamaz uyarısıyla yapılabilir
- Toplu veri sıfırlama (fabrika ayarları), 3 adımlı onay + yazılı teyit ("SİL" yazma) gerektirir

## 6. Çoklu Profil İzolasyonu

- Her profilin verisi `user_id` ile tam izole edilir
- Profil şifre korumalı olabilir (opsiyonel PIN), böylece aynı cihazı paylaşan aile üyeleri birbirinin verisine yanlışlıkla erişemez

## 7. Export Güvenliği

- JSON/Excel export dosyaları varsayılan olarak şifresiz üretilir (kullanıcı kendi taşıması için) ama kullanıcı isterse export'a parola koyabilir (Excel için native parola koruması, JSON için AES şifreleme opsiyonu)
- Export edilen dosyalar hiçbir zaman otomatik olarak internete gönderilmez

## 8. Güvenlik Test Kriterleri (Kabul Kriterleri)

1. Uygulama zorla kapatıldığında (crash simülasyonu) veri bozulmamalı
2. Yedekten geri yükleme, veri kaybı olmadan tam çalışmalı
3. Şifreli DB dosyası, uygulama dışında düz metin olarak okunamamalı
4. Soft-delete edilen veri, "Çöp Kutusu"ndan geri getirilebilmeli

---
*Bağımlı olduğu doküman: 02, 03 — Sonraki doküman: 14_EXPORTS.md*
