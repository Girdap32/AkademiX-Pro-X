# 06 — AI SYSTEM (Akademi AI Davranış Kuralları)

## 1. İki Katmanlı Mimari

Bkz. 02_SYSTEM_ARCHITECTURE.md §7. Akademi AI iki katmandan oluşur:

1. **Yerel Analiz Motoru (Çekirdek, her zaman aktif, offline):** Kural ve istatistik tabanlı, veritabanı sorgularıyla çalışır. İnternet gerektirmez.
2. **Bulut LLM Katmanı (Opsiyonel, internet varsa):** Serbest metin soru-cevap ve doğal dil özetleme için. Çekirdek analiz asla buna bağımlı değildir.

**Kural:** LLM katmanı kapalıyken de tüm "insight" ve öneri özellikleri tam çalışır durumda olmalıdır.

## 2. Yerel Analiz Motorunun Ürettiği İçgörü Türleri

| İçgörü Türü | Tetikleyici Mantık |
|---|---|
| **Trend Tespiti** | Son N test/deneme netinin lineer regresyon eğimi pozitif/negatif eşiği aşarsa ("Matematik yükseliyor / Fen düşüyor") |
| **Unutma Uyarısı** | Bir kazanımda son çalışmadan bu yana geçen süre, tekrar algoritmasının önerdiği aralığı aştıysa ("Elektrik konusu unutuluyor") |
| **Zayıf Konu Tespiti** | Konu bazlı başarı oranı, kullanıcının genel ortalamasının belirli bir eşik altında kalırsa |
| **Hedef Sapması** | Plan-gerçekleşen karşılaştırmasında tamamlanma oranı hedefin altındaysa ("Bu hafta hedefe ulaşılamadı") |
| **Çalışma Süresi Değişimi** | Haftalık toplam çalışma süresi, önceki haftaya göre belirgin düşüş/artış gösterirse |
| **Kaynak Etkinliği** | Aynı konu için birden fazla kaynak kullanılmışsa, hangisinde başarı oranı daha yüksek |

Her içgörü `ai_insights` tablosuna kaydedilir (bkz. 03_DATABASE.md §3.13) ve dashboard'da kart olarak gösterilir.

## 3. Soru-Cevap Senaryoları (Yerel Motor ile Cevaplanabilenler)

Bu sorular **LLM olmadan da** doğru cevaplanabilmelidir çünkü doğrudan veritabanı sorgusu + formülle çözülür:

- "Bugün hangi konuları çalışmalıyım?" → Tekrar kuyruğu + zayıf konu tespiti birleşimi
- "En zayıf dersim hangisi?" → Ders bazlı ortalama başarı sıralaması
- "Bu hafta neden düştüm?" → Haftalık trend + çalışma süresi + tekrar eksikliği korelasyonu
- "Hangi konular bana en çok puan kazandırır?" → Konu bazlı net katkı analizi (ağırlıklı sınav puanına etkisi)
- "Bu ay çalışma performansım nasıl?" → Aylık özet rapor (otomatik metne dönüştürülmüş istatistik)
- "Hangi kitap bana daha çok katkı sağladı?" → Kaynak etkinlik karşılaştırması

**Kural:** LLM katmanı bu cevapları daha doğal/akıcı bir dille yeniden ifade edebilir, ama **sayısal içerik her zaman yerel motordan gelir** — LLM sayı/istatistik uydurmaz, yalnızca yerel motorun ürettiği verileri doğal dile çevirir.

## 4. LLM Katmanı Kullanım Kuralları

- LLM'e gönderilen prompt, her zaman yerel motorun ürettiği **gerçek** veri özetini içerir (örn. "Kullanıcının son 10 testi: [gerçek veri]. Bu veriye dayanarak motive edici bir özet yaz.")
- LLM asla ham kullanıcı kişisel verisini (isim, doğum tarihi vb.) gereksiz yere işlemez — yalnızca performans verisi paylaşılır
- LLM yanıtları kullanıcıya "AI önerisi" olarak açıkça etiketlenir, otorite/kesinlik iması yapılmaz
- Kullanıcı, ayarlardan LLM katmanını tamamen kapatabilir — bu durumda "AI Coach" paneli yalnızca yerel motor içgörülerini gösterir

## 5. Ton ve Dil Kuralları

- Akademi AI, motive edici ama gerçekçi bir ton kullanır — asla aşırı pozitif/sahte övgü yapmaz
- Olumsuz durumları (düşüş, hedef kaçırma) yargılamadan, çözüm odaklı sunar
- Öneriler her zaman somut ve eyleme geçirilebilir olur ("Elektrik konusunu bu hafta 2 kez tekrar et" gibi, "daha çok çalış" gibi genel değil)

## 6. Öneri Motoru Algoritması (Basitleştirilmiş Akış)

```
1. Kullanıcının tüm aktif kazanımlarını çek
2. Her kazanım için: son çalışma tarihi, başarı oranı, tekrar sırası hesapla
3. Öncelik skoru = (unutma riski × ağırlık) + (zayıflık × ağırlık) + (sınav yakınlığı × ağırlık)
4. En yüksek skorlu 3-5 kazanımı "bugün önerilen çalışma listesi" olarak sun
```

Ağırlıklar kullanıcı profilinden (yaklaşan sınav tarihi, hedefler) dinamik olarak ayarlanır.

## 7. Gizlilik ve Veri Kullanımı

- Yerel motor: tüm işlem cihazda gerçekleşir, veri hiçbir yere gönderilmez
- Bulut LLM aktifse: yalnızca performans özet verisi (isimsiz/anonimleştirilmiş şekilde mümkünse) gönderilir, kullanıcı bunu açıkça onaylamış olmalıdır (opt-in, varsayılan kapalı)

---
*Bağımlı olduğu doküman: 03, 05 — Sonraki doküman: 07_ANALYTICS.md*
