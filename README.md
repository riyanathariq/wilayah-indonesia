# Wilayah Indonesia API

API data wilayah administratif Indonesia: provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan. Setiap tingkat wilayah disajikan sebagai berkas JSON terpisah.

## Endpoints

- **Provinces (Provinsi):** Access the list of provinces in Indonesia.
  - URL: [https://riyanathariq.github.io/wilayah-indonesia/provinces.json](https://riyanathariq.github.io/wilayah-indonesia/provinces.json)
  - Example response:
    ```json
    [
        {
            "id": 31,
            "value": "DKI Jakarta"
        },
        {
            "id": 32,
            "value": "Jawa Barat"
        },
        // More provinces...
    ]
    ```

- **Regencies (Kabupaten/Kota):** Access the list of regencies for a specific province by providing the province ID.
  - URL: `https://riyanathariq.github.io/wilayah-indonesia/<province_id>/regencies.json`
  - Example URL: [https://riyanathariq.github.io/wilayah-indonesia/32/regencies.json](https://riyanathariq.github.io/wilayah-indonesia/32/regencies.json)
  - Example response:
    ```json
    [
        {
            "id": 3201,
            "province_id": 32,
            "type": "Kabupaten",
            "value": "Bogor"
        },
        {
            "id": 3271,
            "province_id": 32,
            "type": "Kota",
            "value": "Kota Bogor"
        },
        // More regencies...
    ]
    ```

- **Districts (Kecamatan):** Access the list of districts for a specific regency within a province.
  - URL: `https://riyanathariq.github.io/wilayah-indonesia/<province_id>/<regency_id>/district.json`
  - Example URL: [https://riyanathariq.github.io/wilayah-indonesia/32/3201/district.json](https://riyanathariq.github.io/wilayah-indonesia/32/3201/district.json)
  - Example response:
    ```json
    [
        {
            "id": 320101,
            "province_id": 32,
            "regency_id": 3201,
            "value": "Cibinong"
        },
        {
            "id": 320107,
            "province_id": 32,
            "regency_id": 3201,
            "value": "Cileungsi"
        },
        // More districts...
    ]
    ```

- **Subdistricts (Desa/Kelurahan):** Daftar desa/kelurahan per kecamatan.
  - URL: `https://riyanathariq.github.io/wilayah-indonesia/<province_id>/<regency_id>/<district_id>/subdistrict.json`
  - Example URL: [https://riyanathariq.github.io/wilayah-indonesia/32/3201/320101/subdistrict.json](https://riyanathariq.github.io/wilayah-indonesia/32/3201/320101/subdistrict.json)
  - Example response:
    ```json
    [
        {
            "id": 3201012001,
            "province_id": 32,
            "regency_id": 3201,
            "district_id": 320101,
            "value": "Nanggewer",
            "postal_code": "16912"
        },
        {
            "id": 3201012002,
            "province_id": 32,
            "regency_id": 3201,
            "district_id": 320101,
            "value": "Pakansari",
            "postal_code": "16915"
        }
    ]
    ```

## Build (generate JSON from CSV)

```bash
npm install
npm run build
```

Script `index.js` membaca `provinces.csv`, `regencies.csv`, `districts.csv`, `villages.csv` dan menulis hasil ke folder `dist/`. Deploy ke GitHub Pages: `npm run deploy`.

## Usage

Akses data dengan HTTP GET ke URL di atas. Response berupa JSON.

## Catatan

- Ganti `<province_id>`, `<regency_id>`, dan `<district_id>` dengan ID provinsi, kabupaten, dan kecamatan yang sesuai.
- ID provinsi, kabupaten, kecamatan, dan desa/kelurahan adalah pengidentifikasi unik per wilayah.
- Tangani permintaan HTTP dan respons error dengan benar saat memakai API ini.

Jika ada masalah atau pertanyaan, silakan [buat issue](https://github.com/riyanathariq/wilayah-indonesia/issues) di repositori ini atau hubungi lewat [profil GitHub](https://github.com/riyanathariq).
