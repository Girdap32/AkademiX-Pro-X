# 05 — FEATURES (Özellik Spesifikasyonu)

## 1. Ders / Konu / Kazanım Yönetimi

- Sınırsız ders, konu, alt konu, kazanım oluşturma (sürükle-bırak sıralama)
- Her kazanım için "tamamlandı" işaretleme
- Toplu içe aktarma: hazır müfredat şablonları (MEB müfredatı LGS/TYT-AYT için önceden tanımlı, kullanıcı düzenleyebilir)
- Ders bazlı renk/ikon özelleştirme

**Kullanıcı Hikayesi:** *"Matematik dersine 'Olasılık' konusunu, altına 'Koşullu Olasılık' alt konusunu ve 3 kazanım ekliyorum. İleride bu kazanımların hangisinde zayıf olduğumu göreceğim."*

## 2. Kaynak / Kitap Takibi

- Konu bazlı kaynak/kitap ekleme
- Kitap ilerleme yüzdesi (kaç test çözüldü / toplam test)
- Kaynak karşılaştırma raporu ("Hangi kaynak bana daha çok katkı sağladı?")

## 3. Test Kayıt Sistemi

- Hızlı giriş formu: ders → konu → alt konu → kaynak/kitap → test no → doğru/yanlış/boş
- Otomatik net ve başarı % hesaplama (anlık, kayıt öncesi önizleme)
- Toplu giriş modu (bir oturumda birden fazla test)
- Not/yorum ekleme

## 4. Deneme Sistemi

- Tüm sınav türleri (LGS, TYT, AYT, KPSS, ALES, DGS, YDS, YÖKDİL) için ortak giriş formu, modül bazlı puan hesaplama
- Ders bazlı doğru/yanlış/boş girişi → otomatik toplam puan/net
- Deneme geçmişi karşılaştırma grafiği (zaman içinde puan trendi)
- Yayınevi bazlı deneme performans karşılaştırması

## 5. Okul / Üniversite Yazılı Sistemi

- Vize/Final/Quiz/Lab/Proje kayıtları, ağırlıklı ortalama hesaplama
- Üniversite modülünde dönem (semester) bazlı GPA hesaplama
- Ders geçme durumu takibi (harf notu / 4'lük veya 100'lük sistem desteği)

## 6. Yanlış Analizi

- Her yanlış cevap, kazanım bazında işaretlenebilir
- Hata türü etiketleme (bilgi eksikliği / dikkatsizlik / zaman yetersizliği / soru tipi bilinmiyor)
- Tekrar eden hata örüntülerinin otomatik tespiti (AI destekli)

## 7. Tekrar Sistemi (Spaced Repetition)

- Unutma eğrisi tabanlı otomatik tekrar zamanlaması (kazanım bazlı)
- Tekrar takvimi görünümü
- Tekrar sonucu girişi → algoritma bir sonraki tekrar aralığını yeniden hesaplar

## 8. Çalışma Planı

- Günlük/haftalık/aylık plan oluşturma
- Görev bazlı (ders + konu + hedef süre/soru sayısı)
- Plan-gerçekleşen karşılaştırması (uyum oranı)
- AI destekli otomatik plan önerisi (zayıf konulara öncelik)

## 9. Hedef Yönetimi

- Kısa/orta/uzun vadeli hedef tanımlama (örn. "Bu ay Fen netimi 15'ten 20'ye çıkar")
- Hedef ilerleme takibi, otomatik durum güncelleme
- Hedefe ulaşılamadığında AI'dan nedensel analiz

## 10. Raporlama ve Analiz

Bkz. 07_ANALYTICS.md — bu doküman metrik ve formülleri detaylandırır. Bu bölüm yalnızca kullanıcı-görünür özellik listesidir:

- Ders/konu/kaynak/kitap bazlı performans raporları
- Gelişim eğrileri (zaman serisi)
- Karşılaştırmalı raporlar (dönemler arası, dersler arası)
- Özelleştirilebilir tarih aralığı filtreleme
- PDF/Excel export

## 11. Akademi AI (Yapay Zeka Koçu)

Bkz. 06_AI_SYSTEM.md için detaylı davranış kuralları. Özellik düzeyinde:

- Doğal dil soru-cevap paneli
- Otomatik "insight" kartları (dashboard'da proaktif uyarılar/öneriler)
- Haftalık/aylık otomatik performans özeti

## 12. Oyunlaştırma

- XP sistemi (her test/tekrar/plan tamamlama XP kazandırır)
- Seviye sistemi
- Rozetler (örn. "7 Gün Kesintisiz Çalışma", "100 Test Tamamlandı")
- Çalışma serisi (streak) takibi
- Haftalık/aylık hedef görevleri

## 13. Çoklu Profil

- Aynı cihazda birden fazla öğrenci profili (örn. kardeşler için)
- Profiller arası veri tam izolasyon

## 14. Export / Import

Bkz. 14_EXPORTS.md — JSON (tam yedek), Excel (rapor/analiz), PDF (sunum/paylaşım amaçlı) formatları.

## 15. Ayarlar

- Tema (Dark/Light/Sistem)
- Ders/modül yönetimi
- Yedekleme sıklığı ayarı
- Veri sıfırlama (çift onaylı, geri alınamaz uyarısıyla)

---
*Bağımlı olduğu doküman: 03, 04 — Sonraki doküman: 06_AI_SYSTEM.md*
