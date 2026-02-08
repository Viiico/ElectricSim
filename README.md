# Symulacja Pola Elektrycznego i Dynamiki Ładunków

Interaktywna, dwuwymiarowa symulacja fizyczna pozwalająca na wizualizację linii sił pola elektrycznego oraz badanie oddziaływań między poruszającymi się cząstkami naładowanymi. Projekt zrealizowany w ramach przedmiotu **Wstęp do Fizyki I**.

## Funkcje

* **Wizualizacja Pola w Czasie Rzeczywistym:** Dynamicznie generowana siatka wektorów natężenia pola elektrycznego ().
* **Interaktywne Dodawanie Ładunków:** Możliwość umieszczania ładunków dodatnich i ujemnych w dowolnym miejscu obszaru roboczego.
* **Zaawansowana Fizyka:**
* Obliczanie sił na podstawie **Prawa Coulomba**.
* Uwzględnienie **zasady superpozycji**.
* Tłumienie ruchu (opór ośrodka) dla zachowania stabilności układu.
* Kolizje sprężyste z krawędziami symulacji.


* **Panel Kontrolny:** Manipulacja wartością ładunku (), krokiem czasowym () oraz funkcja pauzy i resetu.

## Model Fizyczny

### Oddziaływania

Podstawą symulacji jest obliczanie siły wzajemnego oddziaływania ładunków:


Aby uniknąć błędów numerycznych przy bardzo małych odległościach (dzielenie przez zero), w kodzie zastosowano **force clamping** oraz stałą wygładzającą .

### Integracja numeryczna

Ruch cząstek obliczany jest metodą Eulera:

1. **Akumulacja sił:** Sumowanie wektorowe oddziaływań od wszystkich innych ładunków (z wykorzystaniem III zasady dynamiki Newtona dla optymalizacji ).
2. **Aktualizacja prędkości:**  (gdzie  to współczynnik tłumienia).
3. **Aktualizacja pozycji:** .

## Obsługa

* **Lewy Przycisk Myszy:** Dodanie ładunku ujemnego.
* **Prawy Przycisk Myszy:** Dodanie ładunku dodatniego.
* **Suwaki:** Zmiana parametrów fizycznych w czasie rzeczywistym.

---

## Autorzy

* **Wiktor Kwiatkowski**
* **Jakub Ryszko**
* *Wydział Elektroniki i Technik Informacyjnych (WEITI)*

---