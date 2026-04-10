# API 404 Test Failures and Route Aliasing

## Sorun (Symptom)
Feature testleri (`EligibilityEngineTest`, `GssEligibilityTest` vb.) çalıştırıldığında, beklentinin (Örn: 200 OK veya 422 Unprocessable Entity) aksine **404 Not Found** hatası alınması ve tüm test suitinin başarısız (fail) olması.

## Kök Neden (Root Cause)
Bu durum genellikle Controller veya API uç noktalarında (endpoint) yapılan bir isimlendirme değişikliğinden kaynaklanır. 
Örneğin; API yolu `/api/v1/check` iken eski istemciler hala `/api/v1/eligibility-check` URL'ine POST isteği atarsa, Laravel eşleşen bir rota bulamadığı için 404 döndürür.

## Kurumsal Çözüm Standardı (Resolution Policy)
Eğer public bir API uç noktasının adını değiştiriyorsak, **testleri veya istemcileri hemen güncellemek yerine geriye dönük uyumluluğu (backward compatibility) sağlamalıyız.**

**Yanlış Yaklaşım:** Tüm test dosyalarını açıp URL'leri `/check` olarak değiştirmek. (Bu işlem dışarıdaki canlı istemcileri kırar).

**Doğru Yaklaşım (Route Alias):** `routes/api.php` dosyasına, eski yolu yeni Controller metoduna bağlayan bir alias (takma ad) eklemek.

```php
Route::prefix('v1')->group(function () {
    // Yeni, canonical yol
    Route::post('/check', [EligibilityController::class, 'check']);

    // Eski testler ve istemciler için alias
    Route::post('/eligibility-check', [EligibilityController::class, 'check']);
});
```

## Gelecek Aksiyonlar (Deprecation Strategy)
1. Alias eklendikten sonra testler tekrar çalıştırılır ve yeşile (pass) döndüğü doğrulanır.
2. Frontend ve diğer tüm istemcilerin yeni canonical URL'e (`/check`) geçiş yapması sağlanır.
3. Yeni URL kullanım oranı %100'e ulaştığında veya bir sonraki büyük API versiyonunda (`v2`), eski alias rotası kontrollü olarak sistemden kaldırılabilir (Sunset/Deprecation).

## İlgili Belgeler
- Cross-Repo Delivery Protocol
- 2026 Benefit Conformance Wave
