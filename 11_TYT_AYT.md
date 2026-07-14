# 11 — TYT / AYT (YKS Modülü)

## 1. Sınav Formatı

### TYT (Temel Yeterlilik Testi)
| Ders | Soru Sayısı |
|---|---|
| Türkçe | 40 |
| Sosyal Bilimler | 20 |
| Temel Matematik | 40 |
| Fen Bilimleri | 20 |

### AYT (Alan Yeterlilik Testi) — Alan Bazlı
| Alan | Dersler |
|---|---|
| Sayısal | Matematik (40), Fizik (14), Kimya (13), Biyoloji (13) |
| Eşit Ağırlık | Matematik (40), Edebiyat (24), Tarih-1 (10), Coğrafya-1 (6) |
| Sözel | Edebiyat-Coğrafya-1 (24+6), Tarih-1/2 (10+11), Coğrafya-2 (11), Felsefe Grubu (12), Din K. (6) |
| Dil | Yabancı Dil (80) |

**Not:** Bu dağılımlar da (LGS'de olduğu gibi) `exam_format_templates` üzerinden yapılandırılabilir tutulur; ÖSYM formatı değişirse kod değişmeden güncellenir.

## 2. Yanlış Götürme Katsayısı

TYT/AYT'de her **4 yanlış, 1 doğruyu götürür** (`wrong_coefficient = 4`). Bu, sistemde varsayılan değerdir ve `exam_format_templates` üzerinden değiştirilebilir.

## 3. Puan Hesaplama Yaklaşımı

ÖSYM'nin resmi YKS puan hesaplama sistemi, ham puanları yıllık ortalama ve standart sapmaya göre dönüştüren karmaşık bir istatistiksel modele (T puanı türevi) dayanır ve yıldan yıla katsayılar değişebilir. Bu nedenle sistem:

- Varsayılan olarak **ders bazlı net toplamını ve alan bazlı ağırlıklı tahmini puanı** hesaplar ("tahmini puan" olarak etiketlenir)
- Kullanıcı, güncel yıla ait resmi ağırlık/ortalama katsayılarını biliyorsa `exam_format_templates` üzerinden girebilir, sistem daha isabetli tahmini puan üretir
- Gerçek ÖSYM puanıyla birebir örtüşmeyebileceği UI'da açıkça belirtilir

## 4. Sıralama Tahmini (Opsiyonel Özellik)

Kullanıcı, geçmiş yıllara ait yayınlanmış puan-sıralama eşleştirme tablolarını (varsa) sisteme referans veri olarak yükleyebilir; sistem bu referans veriye göre yaklaşık sıralama tahmini gösterebilir. Bu veri sistemin bir parçası olarak **gömülü** gelmez — kullanıcı kaynaklı, güncellenebilir referans verisidir (güncellik ÖSYM'ye bağlı olduğundan sabit kodlanmaz).

## 5. Analiz Özellikleri

- TYT ve AYT için ayrı trend grafikleri, ortak "YKS Genel Görünüm" dashboard'unda birleştirilir
- Alan bazlı (Sayısal/EA/Sözel/Dil) karşılaştırmalı net profili
- Konu bazlı yanlış analizi → TYT/AYT müfredat kazanımlarıyla ilişkilendirme
- Hedef üniversite/bölüm puanı karşılaştırması

## 6. Müfredat Şablonu

Lise 9-12. sınıf müfredatına dayalı önceden tanımlı ders/konu/kazanım şablonu sağlanır; AYT alan seçimine göre (Sayısal/EA/Sözel/Dil) otomatik filtrelenir.

## 7. Genişletilebilirlik

Bu modül `ExamModule` sözleşmesini (bkz. 08_EXAMS.md) hem TYT hem AYT için ayrı ayrı implemente eder (`examType: 'TYT'` ve `examType: 'AYT'`), ancak ortak alan bazlı ağırlık mantığını paylaşan tek bir `yks-shared.ts` yardımcı katmanı kullanır.

---
*Bağımlı olduğu doküman: 08, 09 — Sonraki doküman: 12_UNIVERSITY.md*
