# 15 — DEVELOPMENT RULES (Geliştirme Süreci Kuralları)

## 1. Branch Stratejisi

```
main            → Her zaman yayına hazır, stabil
develop         → Aktif geliştirme entegrasyon dalı
feature/*       → Her özellik ayrı dal (örn. feature/test-engine)
fix/*           → Hata düzeltmeleri
release/*       → Yayın hazırlığı dalları
```

- Doğrudan `main`'e commit yasaktır
- Her `feature/*` dalı, tamamlandığında `develop`'a Pull Request ile birleştirilir

## 2. Commit Mesaj Standardı (Conventional Commits)

```
feat: yeni özellik
fix: hata düzeltmesi
refactor: davranış değişmeden kod iyileştirme
perf: performans iyileştirmesi
docs: dokümantasyon
test: test ekleme/düzenleme
chore: yapılandırma/bağımlılık güncellemesi
```

Örnek: `feat(test-engine): toplu test girişi modu eklendi`

## 3. Pull Request Kriterleri

Bir PR onaylanabilmesi için:

1. İlgili domain mantığı (`domain/`) için birim testleri eklenmiş olmalı
2. Yeni UI komponenti, Dark/Light mode'da manuel test edilmiş olmalı
3. Performans etkisi olan değişiklikler (yeni sorgu, yeni liste ekranı) için 10.000+ kayıtla test edilmiş olmalı
4. Sahte/mock veri veya "TODO" içermemeli (bkz. 01_PROJECT_RULES.md §5)
5. En az bir başka geliştirici tarafından code review yapılmış olmalı (solo geliştirmede: bir gün bekletilip yeniden gözden geçirilmeli)

## 4. Test Politikası

| Katman | Test Türü | Kapsam Hedefi |
|---|---|---|
| `domain/calculations` | Birim testi | %100 (kritik iş mantığı) |
| `domain/analysis` | Birim testi | %90+ |
| `data/repositories` | Entegrasyon testi | Ana CRUD akışları |
| `features/*` | Entegrasyon testi | Kritik kullanıcı akışları (test girişi, deneme girişi) |
| UI komponentleri | Görsel/manuel test | Her yeni komponent için Dark/Light kontrol listesi |

## 5. Kod İnceleme (Code Review) Kriterleri

- İş mantığı UI katmanına sızmış mı? (bkz. 02_SYSTEM_ARCHITECTURE.md §3 kuralı)
- Yeni bir tablo/alan eklendiyse migration dosyası eksiksiz mi?
- Performans etkisi olan sorgularda indeks kullanılıyor mu?
- Hata durumları (empty state, error state) tasarlanmış mı?

## 6. Sürüm Yönetimi (Semantic Versioning)

`MAJOR.MINOR.PATCH`

- **MAJOR:** Şema uyumsuz büyük değişiklik (migration gerektiren, geri dönüşsüz)
- **MINOR:** Yeni özellik, geriye dönük uyumlu
- **PATCH:** Hata düzeltmesi, geriye dönük uyumlu

## 7. Yayın Öncesi Kontrol Listesi

Bkz. 17_FINAL_REQUIREMENTS.md — bu doküman geliştirme sürecini tanımlar, yayın kriterlerini değil.

---
*Bağımlı olduğu doküman: 01, 02 — Sonraki doküman: 16_CODING_STANDARD.md*
