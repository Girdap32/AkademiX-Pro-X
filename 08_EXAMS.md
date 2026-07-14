# 08 — EXAMS (Genel Sınav / Deneme Çekirdek Modeli)

## 1. Amaç

Bu doküman, tüm sınav türleri (LGS, TYT, AYT, KPSS, ALES, DGS, YDS, YÖKDİL ve gelecekte eklenecekler) için **ortak bir çekirdek veri modeli ve davranış sözleşmesi** tanımlar. Sınava özel kurallar (10, 11 vb. dosyalarda) bu çekirdeği genişletir, asla yeniden yazmaz.

## 2. `ExamModule` Arayüzü (Kavramsal Sözleşme)

Her sınav modülü şu sözleşmeyi implemente eder:

```
ExamModule {
  examType: string                          // 'LGS' | 'TYT' | 'AYT' | ...
  subjectWeights: Record<string, number>     // Ders bazlı katsayı/ağırlık
  wrongCoefficient: number                    // Yanlış götürme katsayısı (genelde 3 veya 4)
  calculateScore(rawResults): ExamScoreResult // Puan hesaplama fonksiyonu
  validateInput(rawResults): ValidationResult // Giriş doğrulama (soru sayısı sınırları vb.)
}
```

Yeni bir sınav türü eklemek = yeni bir `ExamModule` implementasyonu yazmak. Veritabanı şeması (`exams`, `exam_subject_results`) değişmez (bkz. 03_DATABASE.md §3.6-3.7).

## 3. Ortak Veri Akışı

```
1. Kullanıcı deneme sonucunu girer (ders bazlı doğru/yanlış/boş)
2. validateInput() çalışır → soru sayısı, sınav formatına uygun mu kontrol edilir
3. calculateScore() çalışır → ders bazlı net + toplam puan hesaplanır
4. exams + exam_subject_results tablolarına yazılır
5. Analiz motoru (07_ANALYTICS.md) otomatik günceller
```

## 4. Desteklenen Sınav Türleri ve Kapsamları

| Sınav Türü | Kapsam | Detay Dokümanı |
|---|---|---|
| LGS | Ortaokul 8. sınıf merkezi sınavı | 10_LGS.md |
| TYT | Temel Yeterlilik Testi | 11_TYT_AYT.md |
| AYT | Alan Yeterlilik Testi | 11_TYT_AYT.md |
| KPSS | Kamu Personeli Seçme Sınavı | Genel çekirdek + genişletilebilir modül |
| ALES | Akademik Personel ve Lisansüstü Eğitimi Sınavı | Genel çekirdek + genişletilebilir modül |
| DGS | Dikey Geçiş Sınavı | Genel çekirdek + genişletilebilir modül |
| YDS / YÖKDİL | Yabancı Dil Sınavları | Genel çekirdek + genişletilebilir modül |
| Üniversite Sınavları | Vize/Final vb. | 12_UNIVERSITY.md (farklı model — ağırlıklı ortalama) |

**Not:** KPSS/ALES/DGS/YDS/YÖKDİL için v1'de genel çekirdek model (ortak net/puan hesaplama) yeterlidir; bu sınavlara özel ayrı doküman gerekirse ileride eklenir (bkz. 01_PROJECT_RULES.md §3 modülerlik ilkesi).

## 5. Ortak Doğrulama Kuralları

- Doğru + Yanlış + Boş = Toplam Soru Sayısı (aşılamaz)
- Negatif değer girilemez
- Sınav tarihi gelecekte olamaz
- Ders bazlı soru sayısı, ilgili sınav formatının sabit yapısıyla uyumlu olmalı (örn. LGS Türkçe her zaman 20 soru)

## 6. Ortak Raporlama Çıktıları

Her sınav türü için otomatik üretilen:

- Puan/net trend grafiği
- Ders bazlı radar profil
- Hedef puan karşılaştırması ("Hedefin: 450, Şu an: 410")
- Sınav geçmişi tablosu (filtrelenebilir, export edilebilir)

---
*Bağımlı olduğu doküman: 03 — Sonraki doküman: 09_TEST_ENGINE.md*
