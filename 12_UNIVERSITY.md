# 12 — UNIVERSITY (Üniversite Ders Takip Modülü)

## 1. Amaç

Sınav odaklı diğer modüllerden farklı olarak, üniversite modülü **dönemsel ders/not yönetimi** üzerine kuruludur (bkz. 03_DATABASE.md §3.8 `school_exams`).

## 2. Veri Modeli Genişletmesi

- `subjects.module_type = 'university'` olan dersler, bir `semester` (dönem) ve `credit` (kredi) alanı taşır
- Her ders için birden fazla değerlendirme kalemi (`school_exams`): Vize, Final, Quiz, Laboratuvar, Proje/Ödev
- Her kalemin `weight_percent` alanı vardır (örn. Vize %30, Final %50, Quiz %10, Proje %10 — toplam %100 olmalı, sistem doğrular)

## 3. Ders Notu Hesaplama

```
ders_notu = Σ(kalem_puanı × kalem_ağırlığı / 100)
```

Sistem, girilen ağırlıkların toplamının %100 olduğunu doğrular; olmayan durumda kullanıcı uyarılır (kayıt yine yapılabilir ama "geçici/eksik" olarak işaretlenir).

## 4. Harf Notu ve GPA Sistemi

- Kullanıcı, üniversitesinin not sistemini seçer: **4'lük** (0.00-4.00) veya **100'lük**
- Harf notu eşiği tablosu kullanıcı tarafından özelleştirilebilir (üniversiteler arası farklılık gösterdiğinden sabit kodlanmaz — varsayılan yaygın bir eşik tablosu önerilir, düzenlenebilir)
- **Dönemlik GPA:** `Σ(ders_notu_katsayısı × kredi) / Σ(kredi)`
- **Genel Ağırlıklı Ortalama (CGPA):** tüm dönemler üzerinden aynı formülün kümülatif hali

## 5. Dönem Takibi

- Dönem bazlı ders listesi, dönem GPA'sı, kümülatif GPA grafiği (dönemden döneme trend)
- Ders geçme/kalma durumu takibi (üniversitenin baraj notuna göre — kullanıcı tanımlı)
- Kredi toplamı takibi (mezuniyet için gereken toplam krediye göre ilerleme çubuğu)

## 6. Analiz Özellikleri

- Dönemler arası GPA trend grafiği
- Ders bazlı performans karşılaştırması (hangi derste en çok/az başarı)
- Değerlendirme kalemi bazlı analiz ("Vize'lerde güçlüyüm ama Final'lerde düşüyorum" gibi AI içgörüsü)

## 7. Modülerlik Notu

Bu modül, diğer sınav modüllerinden (LGS/TYT-AYT) **tamamen bağımsız** bir veri akışı kullanır (ağırlıklı ortalama mantığı, net/puan mantığından farklıdır) ama aynı `subjects`→`topics` zincirini paylaşabilir (örn. bir üniversite dersinin konularını da takip etmek isteyen kullanıcı için opsiyonel).

---
*Bağımlı olduğu doküman: 03, 05 — Sonraki doküman: 13_SECURITY.md*
