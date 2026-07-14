# 03 — DATABASE (Veritabanı Tasarımı)

## 1. Genel Prensip

Veritabanı motoru: **SQLite**. Tüm tablolar birbirine yabancı anahtar (foreign key) ile bağlıdır; hiçbir veri izole değildir (bkz. 01_PROJECT_RULES.md §2). Silme işlemleri varsayılan olarak **soft delete** (`is_deleted` alanı) ile yapılır; kalıcı silme yalnızca kullanıcı onayıyla ayrı bir işlemdir.

## 2. Ana Varlık Zinciri (Entity Chain)

```
users → subjects (Ders) → topics (Konu) → subtopics (Alt Konu) → outcomes (Kazanım)
                                                                        │
resources (Kaynak) → books (Kitap) ────────────────────────────────────┤
                                                                        ▼
                                                                  test_records (Test)
                                                                        │
                                                          ┌─────────────┼─────────────┐
                                                          ▼             ▼             ▼
                                                  wrong_analysis   review_queue   statistics
                                                    (Yanlış)      (Tekrar)      (İstatistik)
                                                                        │
                                                                        ▼
                                                                  ai_insights (AI Analiz)
```

## 3. Tablo Tanımları

### 3.1 `users`
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | |
| education_level | TEXT | ilkokul/ortaokul/lise/üniversite vb. — profil varsayılanı |
| theme_preference | TEXT | dark/light |
| created_at | DATETIME | |

### 3.2 `subjects` (Ders)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| user_id | INTEGER FK → users | |
| name | TEXT | Kullanıcı tanımlı, sınırsız |
| module_type | TEXT | lgs/tyt_ayt/university/custom vb. |
| color | TEXT | UI için renk kodu |
| is_deleted | BOOLEAN | |

### 3.3 `topics` (Konu) / `subtopics` (Alt Konu) / `outcomes` (Kazanım)
Üçü de aynı desende: `id, parent_id (FK), name, order_index, is_deleted`. `outcomes` ayrıca `is_mastered BOOLEAN` alanı taşır (kazanım tamamlandı mı).

### 3.4 `resources` (Kaynak) / `books` (Kitap)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| subject_id | INTEGER FK | |
| name | TEXT | Yayınevi/kaynak adı |
| books.resource_id | INTEGER FK | |
| books.total_tests | INTEGER | Kitaptaki toplam test sayısı (opsiyonel, ilerleme takibi için) |

### 3.5 `test_records` (Test) — Çekirdek Tablo
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| subject_id, topic_id, subtopic_id | INTEGER FK | Nullable (bazıları boş olabilir) |
| resource_id, book_id | INTEGER FK | Nullable |
| test_number | INTEGER | Kitap içindeki test no |
| date | DATE | |
| duration_minutes | INTEGER | |
| question_count | INTEGER | |
| correct, wrong, blank | INTEGER | |
| net | REAL | Hesaplanır: correct − (wrong / wrong_coefficient) |
| success_rate | REAL | net / question_count * 100 |
| note | TEXT | |
| created_at | DATETIME | |

**İndeksler:** `(subject_id, date)`, `(topic_id)`, `(date)` — dashboard sorguları için kritik.

### 3.6 `exams` (Deneme — LGS/TYT/AYT/KPSS vb. ortak çekirdek)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| exam_type | TEXT | 'LGS','TYT','AYT','KPSS', vb. (bkz. 08_EXAMS.md) |
| date | DATE | |
| publisher | TEXT | Deneme yayınevi |
| total_score | REAL | Hesaplanan puan (modül bazlı formülle) |
| raw_data_json | TEXT | Ders bazlı doğru/yanlış/boş — JSON (esneklik için) |

### 3.7 `exam_subject_results` (Deneme Ders Detayı)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| exam_id | INTEGER FK | |
| subject_name | TEXT | |
| correct, wrong, blank | INTEGER | |
| net | REAL | |

### 3.8 `school_exams` (Yazılı — Vize/Final/Quiz/Proje)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| subject_id | INTEGER FK | |
| exam_type | TEXT | vize/final/quiz/lab/proje |
| score | REAL | |
| max_score | REAL | |
| weight_percent | REAL | GPA/ortalama hesaplamasında ağırlık |
| semester | TEXT | Üniversite modülü için dönem bilgisi |

### 3.9 `wrong_analysis` (Yanlış Analizi)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| test_record_id | INTEGER FK | |
| outcome_id | INTEGER FK | Hangi kazanımda hata yapıldı |
| error_type | TEXT | bilgi eksikliği/dikkatsizlik/zaman yetersizliği vb. |
| note | TEXT | |

### 3.10 `review_queue` (Tekrar Sistemi)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| outcome_id | INTEGER FK | |
| next_review_date | DATE | Unutma eğrisi algoritmasıyla hesaplanır |
| review_count | INTEGER | Kaçıncı tekrar |
| last_result | TEXT | başarılı/başarısız |

### 3.11 `study_plans` / `plan_tasks` (Çalışma Planı)
| Alan | Tip | Açıklama |
|---|---|---|
| study_plans.id | INTEGER PK | |
| study_plans.period_type | TEXT | günlük/haftalık/aylık |
| plan_tasks.plan_id | INTEGER FK | |
| plan_tasks.subject_id / topic_id | INTEGER FK | |
| plan_tasks.is_completed | BOOLEAN | |
| plan_tasks.target_date | DATE | |

### 3.12 `gamification` (Rozet/XP/Seviye/Seri)
| Alan | Tip | Açıklama |
|---|---|---|
| user_xp.total_xp | INTEGER | |
| user_xp.level | INTEGER | |
| streaks.current_streak | INTEGER | Kesintisiz çalışma günü |
| badges.badge_key | TEXT | |
| badges.earned_at | DATETIME | |

### 3.13 `ai_insights` (AI Analiz Kayıtları)
| Alan | Tip | Açıklama |
|---|---|---|
| id | INTEGER PK | |
| insight_type | TEXT | trend/uyarı/öneri |
| subject_id | INTEGER FK | Nullable |
| message | TEXT | Üretilen analiz metni |
| generated_at | DATETIME | |
| is_read | BOOLEAN | |

## 4. Bütünlük Kuralları (Referential Integrity)

- Tüm FK ilişkilerinde `ON DELETE CASCADE` yalnızca soft-delete sonrası kalıcı silmede aktiftir
- `test_records` silinirse bağlı `wrong_analysis` kayıtları da soft-delete olur
- Hiçbir tablo, `user_id` zincirinden kopuk olamaz (çoklu profil izolasyonu için)

## 5. Migration Stratejisi

- Şema değişiklikleri `src-tauri/src/db/migrations/` altında sıralı SQL dosyalarıyla yönetilir (`001_init.sql`, `002_add_review_queue.sql` ...)
- Her migration geriye dönük veri kaybına yol açmayacak şekilde yazılır
- Uygulama açılışında otomatik migration kontrolü yapılır

---
*Bağımlı olduğu doküman: 02_SYSTEM_ARCHITECTURE.md — Sonraki doküman: 04_UI_UX.md*
