const fs = require('fs');
const path = require('path');

/** Minimal RFC4180-ish CSV parse (handles quoted commas). */
function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = '';
  let i = 0;
  let inQuotes = false;
  const s = content.replace(/^\uFEFF/, '');

  while (i < s.length) {
    const ch = s[i];
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      row.push(cell.trim());
      cell = '';
      i += 1;
      continue;
    }
    if (ch === '\n' || (ch === '\r' && s[i + 1] === '\n')) {
      row.push(cell.trim());
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      cell = '';
      i += ch === '\r' ? 2 : 1;
      continue;
    }
    if (ch === '\r') {
      row.push(cell.trim());
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      cell = '';
      i += 1;
      continue;
    }
    cell += ch;
    i += 1;
  }
  row.push(cell.trim());
  if (row.some((c) => c !== '')) rows.push(row);
  return rows;
}

function readCSV(filePath) {
  const fileContent = fs.readFileSync(path.join(__dirname, filePath), {
    encoding: 'utf8',
  });
  const rows = parseCsv(fileContent);
  return rows.slice(1); // drop header
}

const provinces = readCSV('./provinces.csv');
const regencies = readCSV('./regencies.csv');
const districts = readCSV('./districts.csv');
const villages = readCSV('./villages.csv');

fs.mkdirSync('dist', { recursive: true });

fs.writeFileSync(
  './dist/provinces.json',
  JSON.stringify(
    provinces.map((province) => ({
      id: parseInt(province[1], 10),
      value: province[0],
    })),
    null,
    2,
  ),
);

let regencyCount = 0;
let districtCount = 0;
let villageCount = 0;

provinces.forEach((province) => {
  const [provinceName, provinceId] = province;
  const provinceRegencies = regencies.filter((regency) => regency[2] === provinceId);
  regencyCount += provinceRegencies.length;

  fs.mkdirSync(`dist/${provinceId}`, { recursive: true });

  fs.writeFileSync(
    `./dist/${provinceId}/regencies.json`,
    JSON.stringify(
      provinceRegencies.map((regency) => ({
        id: parseInt(regency[4], 10),
        province_id: parseInt(provinceId, 10),
        type: regency[0],
        value: regency[0] === 'Kota' ? `${regency[0]} ${regency[1]}` : regency[1],
      })),
      null,
      2,
    ),
  );

  provinceRegencies.forEach((regency) => {
    const regencyDistricts = districts.filter((district) => district[4] === regency[4]);
    districtCount += regencyDistricts.length;

    fs.mkdirSync(`dist/${provinceId}/${regency[4]}`, { recursive: true });

    fs.writeFileSync(
      `./dist/${provinceId}/${regency[4]}/district.json`,
      JSON.stringify(
        regencyDistricts.map((district) => ({
          id: parseInt(district[5], 10),
          province_id: parseInt(provinceId, 10),
          regency_id: parseInt(regency[4], 10),
          value: district[0],
        })),
        null,
        2,
      ),
    );

    regencyDistricts.forEach((district) => {
      const districtVillages = villages.filter((village) => village[7] == district[5]);
      villageCount += districtVillages.length;

      fs.mkdirSync(`dist/${provinceId}/${regency[4]}/${district[5]}`, {
        recursive: true,
      });

      fs.writeFileSync(
        `./dist/${provinceId}/${regency[4]}/${district[5]}/subdistrict.json`,
        JSON.stringify(
          districtVillages.map((village) => ({
            id: parseInt(village[6], 10),
            province_id: parseInt(provinceId, 10),
            regency_id: parseInt(regency[4], 10),
            district_id: parseInt(district[5], 10),
            value: village[1],
            postal_code: village[0],
          })),
          null,
          2,
        ),
      );
    });
  });
});

console.log('Generated successfully!');
console.log(
  JSON.stringify(
    {
      provinces: provinces.length,
      regencies: regencyCount,
      districts: districtCount,
      villages: villageCount,
    },
    null,
    2,
  ),
);
