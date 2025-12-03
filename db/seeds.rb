# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Seeding database..."

# =============================================================================
# TARGET GROUPS - Based on Pedoman Standar Gizi MBG document
# Nutritional requirements per meal (25% of daily requirement)
# =============================================================================
puts "Creating target groups..."

target_groups_data = [
  {
    name: "Ibu Hamil",
    code: "IBU_HAMIL",
    description: "Ibu hamil trimester 1-3",
    min_energy: 600,      # kcal per meal
    min_protein: 20,      # gram
    min_fat: 17,          # gram
    min_carbohydrate: 90, # gram
    min_fiber: 9,         # gram
    min_vitamin_a: 225,   # mcg
    min_vitamin_b1: 0.35, # mg
    min_vitamin_b2: 0.4,  # mg
    min_vitamin_b3: 4.5,  # mg
    min_vitamin_b6: 0.45, # mg
    min_vitamin_b9: 163,  # mcg (folate)
    min_vitamin_b12: 1.2, # mcg
    min_vitamin_c: 23,    # mg
    min_vitamin_d: 4,     # mcg
    min_calcium: 325,     # mg
    min_iron: 7,          # mg
    min_zinc: 3.8,        # mg
    min_iodine: 58,       # mcg
    min_selenium: 9,      # mcg
    age_range_start: 15,
    age_range_end: 49
  },
  {
    name: "Ibu Menyusui",
    code: "IBU_MENYUSUI",
    description: "Ibu menyusui 0-6 bulan dan 6-12 bulan",
    min_energy: 650,
    min_protein: 22,
    min_fat: 18,
    min_carbohydrate: 95,
    min_fiber: 10,
    min_vitamin_a: 238,
    min_vitamin_b1: 0.38,
    min_vitamin_b2: 0.45,
    min_vitamin_b3: 5,
    min_vitamin_b6: 0.5,
    min_vitamin_b9: 138,
    min_vitamin_b12: 1.4,
    min_vitamin_c: 28,
    min_vitamin_d: 4,
    min_calcium: 325,
    min_iron: 5,
    min_zinc: 4.5,
    min_iodine: 63,
    min_selenium: 11,
    age_range_start: 15,
    age_range_end: 49
  },
  {
    name: "Balita & PAUD/TK/RA",
    code: "BALITA_PAUD",
    description: "Anak usia 1-6 tahun, siswa PAUD/TK/RA sederajat",
    min_energy: 400,
    min_protein: 10,
    min_fat: 11,
    min_carbohydrate: 60,
    min_fiber: 5,
    min_vitamin_a: 113,
    min_vitamin_b1: 0.15,
    min_vitamin_b2: 0.15,
    min_vitamin_b3: 2,
    min_vitamin_b6: 0.15,
    min_vitamin_b9: 50,
    min_vitamin_b12: 0.4,
    min_vitamin_c: 11,
    min_vitamin_d: 4,
    min_calcium: 163,
    min_iron: 2.3,
    min_zinc: 1.5,
    min_iodine: 23,
    min_selenium: 5,
    age_range_start: 1,
    age_range_end: 6
  },
  {
    name: "SD/MI Kelas 1-3",
    code: "SD_KELAS_1_3",
    description: "Siswa SD/MI sederajat kelas 1-3 (usia 7-9 tahun)",
    min_energy: 500,
    min_protein: 12.5,
    min_fat: 14,
    min_carbohydrate: 75,
    min_fiber: 6.5,
    min_vitamin_a: 138,
    min_vitamin_b1: 0.23,
    min_vitamin_b2: 0.23,
    min_vitamin_b3: 3,
    min_vitamin_b6: 0.25,
    min_vitamin_b9: 75,
    min_vitamin_b12: 0.6,
    min_vitamin_c: 13,
    min_vitamin_d: 4,
    min_calcium: 250,
    min_iron: 2.5,
    min_zinc: 2,
    min_iodine: 30,
    min_selenium: 6,
    age_range_start: 7,
    age_range_end: 9
  },
  {
    name: "SD/MI Kelas 4-6",
    code: "SD_KELAS_4_6",
    description: "Siswa SD/MI sederajat kelas 4-6 (usia 10-12 tahun)",
    min_energy: 550,
    min_protein: 13.75,
    min_fat: 15,
    min_carbohydrate: 83,
    min_fiber: 7.5,
    min_vitamin_a: 150,
    min_vitamin_b1: 0.28,
    min_vitamin_b2: 0.28,
    min_vitamin_b3: 3.5,
    min_vitamin_b6: 0.3,
    min_vitamin_b9: 100,
    min_vitamin_b12: 0.75,
    min_vitamin_c: 13,
    min_vitamin_d: 4,
    min_calcium: 313,
    min_iron: 3.5,
    min_zinc: 2.5,
    min_iodine: 30,
    min_selenium: 7,
    age_range_start: 10,
    age_range_end: 12
  },
  {
    name: "SMP/MTS Sederajat",
    code: "SMP",
    description: "Siswa SMP/MTS sederajat (usia 13-15 tahun)",
    min_energy: 700,
    min_protein: 17.5,
    min_fat: 19,
    min_carbohydrate: 105,
    min_fiber: 9,
    min_vitamin_a: 175,
    min_vitamin_b1: 0.33,
    min_vitamin_b2: 0.33,
    min_vitamin_b3: 4,
    min_vitamin_b6: 0.35,
    min_vitamin_b9: 100,
    min_vitamin_b12: 1,
    min_vitamin_c: 18,
    min_vitamin_d: 4,
    min_calcium: 313,
    min_iron: 5.5,
    min_zinc: 3.5,
    min_iodine: 38,
    min_selenium: 8,
    age_range_start: 13,
    age_range_end: 15
  },
  {
    name: "SMA/MA Sederajat",
    code: "SMA",
    description: "Siswa SMA/MA sederajat (usia 16-18 tahun)",
    min_energy: 750,
    min_protein: 18.75,
    min_fat: 21,
    min_carbohydrate: 113,
    min_fiber: 9.5,
    min_vitamin_a: 188,
    min_vitamin_b1: 0.35,
    min_vitamin_b2: 0.35,
    min_vitamin_b3: 4.25,
    min_vitamin_b6: 0.38,
    min_vitamin_b9: 100,
    min_vitamin_b12: 1,
    min_vitamin_c: 20,
    min_vitamin_d: 4,
    min_calcium: 313,
    min_iron: 5,
    min_zinc: 3.5,
    min_iodine: 38,
    min_selenium: 9,
    age_range_start: 16,
    age_range_end: 18
  },
  {
    name: "Santri",
    code: "SANTRI",
    description: "Santri pondok pesantren (usia 13-18 tahun)",
    min_energy: 725,
    min_protein: 18,
    min_fat: 20,
    min_carbohydrate: 109,
    min_fiber: 9.25,
    min_vitamin_a: 181,
    min_vitamin_b1: 0.34,
    min_vitamin_b2: 0.34,
    min_vitamin_b3: 4.13,
    min_vitamin_b6: 0.36,
    min_vitamin_b9: 100,
    min_vitamin_b12: 1,
    min_vitamin_c: 19,
    min_vitamin_d: 4,
    min_calcium: 313,
    min_iron: 5.25,
    min_zinc: 3.5,
    min_iodine: 38,
    min_selenium: 8.5,
    age_range_start: 13,
    age_range_end: 18
  }
]

target_groups_data.each do |data|
  TargetGroup.find_or_create_by!(code: data[:code]) do |tg|
    tg.assign_attributes(data)
  end
end

puts "Created #{TargetGroup.count} target groups"

# =============================================================================
# TARGET GROUP NUTRITION REQUIREMENTS (Profiles)
# =============================================================================
puts "Creating target group nutrition requirement profiles..."

TargetGroup.find_each do |tg|
  TargetGroupNutritionRequirement.find_or_create_by!(
    target_group: tg,
    profile_key: "standard"
  ) do |profile|
    profile.energy = tg.min_energy
    profile.protein = tg.min_protein
    profile.fat = tg.min_fat
    profile.carbohydrate = tg.min_carbohydrate
    profile.fiber = tg.min_fiber
  end
end

puts "Created #{TargetGroupNutritionRequirement.count} nutrition requirement profiles"

# =============================================================================
# FOOD ITEMS - Based on Daftar Penukar Pangan (Food Exchange List)
# Nutritional values per 100 gram
# =============================================================================
puts "Creating food items..."

food_items_data = [
  # MAKANAN POKOK (Staple Foods)
  { name: "Nasi Putih", code: "MP001", category: :makanan_pokok, energy_per_100g: 130, protein_per_100g: 2.7, fat_per_100g: 0.3, carbohydrate_per_100g: 28.2, fiber_per_100g: 0.4, portion_size: 100, portion_unit: "gram", urt_description: "3/4 gelas" },
  { name: "Nasi Merah", code: "MP002", category: :makanan_pokok, energy_per_100g: 110, protein_per_100g: 2.5, fat_per_100g: 0.8, carbohydrate_per_100g: 23.5, fiber_per_100g: 1.8, portion_size: 100, portion_unit: "gram", urt_description: "3/4 gelas" },
  { name: "Mie Basah", code: "MP003", category: :makanan_pokok, energy_per_100g: 86, protein_per_100g: 0.6, fat_per_100g: 3.3, carbohydrate_per_100g: 14.0, fiber_per_100g: 0.3, portion_size: 200, portion_unit: "gram", urt_description: "2 gelas" },
  { name: "Roti Tawar", code: "MP004", category: :makanan_pokok, energy_per_100g: 248, protein_per_100g: 8.0, fat_per_100g: 1.2, carbohydrate_per_100g: 50.0, fiber_per_100g: 2.7, portion_size: 35, portion_unit: "gram", urt_description: "1 lembar" },
  { name: "Kentang", code: "MP005", category: :makanan_pokok, energy_per_100g: 62, protein_per_100g: 2.0, fat_per_100g: 0.1, carbohydrate_per_100g: 13.5, fiber_per_100g: 2.2, portion_size: 200, portion_unit: "gram", urt_description: "2 buah sedang" },
  { name: "Singkong", code: "MP006", category: :makanan_pokok, energy_per_100g: 154, protein_per_100g: 1.0, fat_per_100g: 0.3, carbohydrate_per_100g: 36.8, fiber_per_100g: 0.9, portion_size: 100, portion_unit: "gram", urt_description: "1 potong sedang" },
  { name: "Ubi Jalar", code: "MP007", category: :makanan_pokok, energy_per_100g: 123, protein_per_100g: 0.8, fat_per_100g: 0.7, carbohydrate_per_100g: 27.9, fiber_per_100g: 0.7, portion_size: 125, portion_unit: "gram", urt_description: "1 buah sedang" },
  { name: "Jagung", code: "MP008", category: :makanan_pokok, energy_per_100g: 140, protein_per_100g: 4.1, fat_per_100g: 1.3, carbohydrate_per_100g: 30.3, fiber_per_100g: 2.9, portion_size: 125, portion_unit: "gram", urt_description: "1 buah sedang" },
  { name: "Oatmeal", code: "MP009", category: :makanan_pokok, energy_per_100g: 379, protein_per_100g: 13.2, fat_per_100g: 6.5, carbohydrate_per_100g: 67.7, fiber_per_100g: 10.1, portion_size: 40, portion_unit: "gram", urt_description: "5 sdm" },
  { name: "Bihun", code: "MP010", category: :makanan_pokok, energy_per_100g: 360, protein_per_100g: 4.7, fat_per_100g: 0.1, carbohydrate_per_100g: 82.1, fiber_per_100g: 0.8, portion_size: 50, portion_unit: "gram", urt_description: "1/2 gelas" },

  # LAUK HEWANI (Animal Protein)
  { name: "Ayam (Daging)", code: "LH001", category: :lauk_hewani, energy_per_100g: 302, protein_per_100g: 18.2, fat_per_100g: 25.0, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 40, portion_unit: "gram", urt_description: "1 potong sedang" },
  { name: "Daging Sapi", code: "LH002", category: :lauk_hewani, energy_per_100g: 207, protein_per_100g: 18.8, fat_per_100g: 14.0, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 35, portion_unit: "gram", urt_description: "1 potong sedang" },
  { name: "Ikan Kembung", code: "LH003", category: :lauk_hewani, energy_per_100g: 103, protein_per_100g: 22.0, fat_per_100g: 1.0, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 40, portion_unit: "gram", urt_description: "1 ekor sedang" },
  { name: "Ikan Lele", code: "LH004", category: :lauk_hewani, energy_per_100g: 90, protein_per_100g: 18.7, fat_per_100g: 1.1, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 75, portion_unit: "gram", urt_description: "1 ekor sedang" },
  { name: "Ikan Bandeng", code: "LH005", category: :lauk_hewani, energy_per_100g: 129, protein_per_100g: 20.0, fat_per_100g: 4.8, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 50, portion_unit: "gram", urt_description: "1 potong sedang" },
  { name: "Ikan Tongkol", code: "LH006", category: :lauk_hewani, energy_per_100g: 109, protein_per_100g: 22.6, fat_per_100g: 1.5, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 45, portion_unit: "gram", urt_description: "1 potong sedang" },
  { name: "Telur Ayam", code: "LH007", category: :lauk_hewani, energy_per_100g: 154, protein_per_100g: 12.4, fat_per_100g: 10.8, carbohydrate_per_100g: 0.7, fiber_per_100g: 0.0, portion_size: 55, portion_unit: "gram", urt_description: "1 butir" },
  { name: "Telur Puyuh", code: "LH008", category: :lauk_hewani, energy_per_100g: 158, protein_per_100g: 13.1, fat_per_100g: 11.1, carbohydrate_per_100g: 0.4, fiber_per_100g: 0.0, portion_size: 50, portion_unit: "gram", urt_description: "5 butir" },
  { name: "Udang Segar", code: "LH009", category: :lauk_hewani, energy_per_100g: 91, protein_per_100g: 21.0, fat_per_100g: 0.2, carbohydrate_per_100g: 0.1, fiber_per_100g: 0.0, portion_size: 35, portion_unit: "gram", urt_description: "5 ekor sedang" },
  { name: "Cumi-cumi", code: "LH010", category: :lauk_hewani, energy_per_100g: 75, protein_per_100g: 16.1, fat_per_100g: 0.7, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 50, portion_unit: "gram", urt_description: "1 ekor sedang" },
  { name: "Ikan Teri", code: "LH011", category: :lauk_hewani, energy_per_100g: 77, protein_per_100g: 16.0, fat_per_100g: 1.0, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 20, portion_unit: "gram", urt_description: "1 sdm" },
  { name: "Bebek", code: "LH012", category: :lauk_hewani, energy_per_100g: 326, protein_per_100g: 16.0, fat_per_100g: 28.6, carbohydrate_per_100g: 0.0, fiber_per_100g: 0.0, portion_size: 40, portion_unit: "gram", urt_description: "1 potong sedang" },

  # LAUK NABATI (Plant Protein)
  { name: "Tempe", code: "LN001", category: :lauk_nabati, energy_per_100g: 149, protein_per_100g: 18.3, fat_per_100g: 4.0, carbohydrate_per_100g: 12.7, fiber_per_100g: 1.4, portion_size: 50, portion_unit: "gram", urt_description: "2 potong sedang" },
  { name: "Tahu", code: "LN002", category: :lauk_nabati, energy_per_100g: 68, protein_per_100g: 7.8, fat_per_100g: 4.6, carbohydrate_per_100g: 1.6, fiber_per_100g: 0.1, portion_size: 100, portion_unit: "gram", urt_description: "2 potong besar" },
  { name: "Kacang Tanah", code: "LN003", category: :lauk_nabati, energy_per_100g: 525, protein_per_100g: 27.9, fat_per_100g: 42.7, carbohydrate_per_100g: 17.4, fiber_per_100g: 2.4, portion_size: 15, portion_unit: "gram", urt_description: "1 sdm" },
  { name: "Kacang Merah", code: "LN004", category: :lauk_nabati, energy_per_100g: 336, protein_per_100g: 22.1, fat_per_100g: 1.1, carbohydrate_per_100g: 61.2, fiber_per_100g: 4.0, portion_size: 25, portion_unit: "gram", urt_description: "2 sdm" },
  { name: "Kacang Hijau", code: "LN005", category: :lauk_nabati, energy_per_100g: 323, protein_per_100g: 22.2, fat_per_100g: 1.2, carbohydrate_per_100g: 62.9, fiber_per_100g: 4.1, portion_size: 25, portion_unit: "gram", urt_description: "2 sdm" },
  { name: "Kacang Kedelai", code: "LN006", category: :lauk_nabati, energy_per_100g: 381, protein_per_100g: 30.2, fat_per_100g: 15.6, carbohydrate_per_100g: 30.1, fiber_per_100g: 4.9, portion_size: 25, portion_unit: "gram", urt_description: "2 sdm" },
  { name: "Oncom", code: "LN007", category: :lauk_nabati, energy_per_100g: 187, protein_per_100g: 13.0, fat_per_100g: 6.0, carbohydrate_per_100g: 22.6, fiber_per_100g: 2.0, portion_size: 50, portion_unit: "gram", urt_description: "2 potong" },

  # SAYURAN (Vegetables)
  { name: "Bayam", code: "SY001", category: :sayuran, energy_per_100g: 36, protein_per_100g: 3.5, fat_per_100g: 0.5, carbohydrate_per_100g: 6.5, fiber_per_100g: 0.8, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Kangkung", code: "SY002", category: :sayuran, energy_per_100g: 29, protein_per_100g: 3.0, fat_per_100g: 0.3, carbohydrate_per_100g: 5.4, fiber_per_100g: 1.0, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Wortel", code: "SY003", category: :sayuran, energy_per_100g: 42, protein_per_100g: 1.2, fat_per_100g: 0.3, carbohydrate_per_100g: 9.3, fiber_per_100g: 1.0, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Brokoli", code: "SY004", category: :sayuran, energy_per_100g: 25, protein_per_100g: 3.0, fat_per_100g: 0.4, carbohydrate_per_100g: 4.5, fiber_per_100g: 2.4, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Kol/Kubis", code: "SY005", category: :sayuran, energy_per_100g: 24, protein_per_100g: 1.4, fat_per_100g: 0.2, carbohydrate_per_100g: 5.3, fiber_per_100g: 0.9, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Sawi Hijau", code: "SY006", category: :sayuran, energy_per_100g: 22, protein_per_100g: 2.3, fat_per_100g: 0.3, carbohydrate_per_100g: 4.0, fiber_per_100g: 1.2, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Tomat", code: "SY007", category: :sayuran, energy_per_100g: 20, protein_per_100g: 1.0, fat_per_100g: 0.3, carbohydrate_per_100g: 4.2, fiber_per_100g: 1.2, portion_size: 100, portion_unit: "gram", urt_description: "1 buah besar" },
  { name: "Kacang Panjang", code: "SY008", category: :sayuran, energy_per_100g: 44, protein_per_100g: 2.7, fat_per_100g: 0.2, carbohydrate_per_100g: 7.8, fiber_per_100g: 3.2, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Labu Siam", code: "SY009", category: :sayuran, energy_per_100g: 26, protein_per_100g: 0.6, fat_per_100g: 0.1, carbohydrate_per_100g: 6.7, fiber_per_100g: 0.6, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Terong", code: "SY010", category: :sayuran, energy_per_100g: 24, protein_per_100g: 1.1, fat_per_100g: 0.2, carbohydrate_per_100g: 5.5, fiber_per_100g: 2.5, portion_size: 100, portion_unit: "gram", urt_description: "1 buah sedang" },
  { name: "Kembang Kol", code: "SY011", category: :sayuran, energy_per_100g: 25, protein_per_100g: 2.4, fat_per_100g: 0.2, carbohydrate_per_100g: 4.9, fiber_per_100g: 2.3, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Buncis", code: "SY012", category: :sayuran, energy_per_100g: 35, protein_per_100g: 2.4, fat_per_100g: 0.2, carbohydrate_per_100g: 7.7, fiber_per_100g: 1.9, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },
  { name: "Jagung Muda", code: "SY013", category: :sayuran, energy_per_100g: 33, protein_per_100g: 2.2, fat_per_100g: 0.3, carbohydrate_per_100g: 7.1, fiber_per_100g: 2.0, portion_size: 100, portion_unit: "gram", urt_description: "1 gelas" },

  # BUAH (Fruits)
  { name: "Pisang Ambon", code: "BH001", category: :buah, energy_per_100g: 99, protein_per_100g: 1.2, fat_per_100g: 0.2, carbohydrate_per_100g: 25.8, fiber_per_100g: 0.6, portion_size: 100, portion_unit: "gram", urt_description: "1 buah sedang" },
  { name: "Jeruk Manis", code: "BH002", category: :buah, energy_per_100g: 45, protein_per_100g: 0.9, fat_per_100g: 0.2, carbohydrate_per_100g: 11.2, fiber_per_100g: 0.4, portion_size: 100, portion_unit: "gram", urt_description: "1 buah sedang" },
  { name: "Pepaya", code: "BH003", category: :buah, energy_per_100g: 46, protein_per_100g: 0.5, fat_per_100g: 0.0, carbohydrate_per_100g: 12.2, fiber_per_100g: 0.7, portion_size: 100, portion_unit: "gram", urt_description: "1 potong besar" },
  { name: "Mangga", code: "BH004", category: :buah, energy_per_100g: 72, protein_per_100g: 0.4, fat_per_100g: 0.2, carbohydrate_per_100g: 16.7, fiber_per_100g: 0.4, portion_size: 100, portion_unit: "gram", urt_description: "1 potong" },
  { name: "Semangka", code: "BH005", category: :buah, energy_per_100g: 28, protein_per_100g: 0.5, fat_per_100g: 0.2, carbohydrate_per_100g: 6.9, fiber_per_100g: 0.2, portion_size: 150, portion_unit: "gram", urt_description: "1 potong besar" },
  { name: "Melon", code: "BH006", category: :buah, energy_per_100g: 37, protein_per_100g: 0.6, fat_per_100g: 0.0, carbohydrate_per_100g: 6.0, fiber_per_100g: 0.3, portion_size: 150, portion_unit: "gram", urt_description: "1 potong besar" },
  { name: "Apel", code: "BH007", category: :buah, energy_per_100g: 58, protein_per_100g: 0.3, fat_per_100g: 0.4, carbohydrate_per_100g: 14.9, fiber_per_100g: 0.7, portion_size: 100, portion_unit: "gram", urt_description: "1 buah sedang" },
  { name: "Jambu Biji", code: "BH008", category: :buah, energy_per_100g: 49, protein_per_100g: 0.9, fat_per_100g: 0.3, carbohydrate_per_100g: 12.2, fiber_per_100g: 5.6, portion_size: 100, portion_unit: "gram", urt_description: "1 buah besar" },
  { name: "Nanas", code: "BH009", category: :buah, energy_per_100g: 52, protein_per_100g: 0.4, fat_per_100g: 0.2, carbohydrate_per_100g: 13.7, fiber_per_100g: 0.4, portion_size: 100, portion_unit: "gram", urt_description: "1 potong sedang" },
  { name: "Salak", code: "BH010", category: :buah, energy_per_100g: 77, protein_per_100g: 0.4, fat_per_100g: 0.0, carbohydrate_per_100g: 20.9, fiber_per_100g: 0.3, portion_size: 80, portion_unit: "gram", urt_description: "2 buah sedang" },

  # SUSU (Milk/Dairy)
  { name: "Susu UHT Full Cream", code: "SS001", category: :susu, energy_per_100g: 61, protein_per_100g: 3.2, fat_per_100g: 3.5, carbohydrate_per_100g: 4.5, fiber_per_100g: 0.0, portion_size: 200, portion_unit: "ml", urt_description: "1 gelas" },
  { name: "Susu UHT Low Fat", code: "SS002", category: :susu, energy_per_100g: 42, protein_per_100g: 3.4, fat_per_100g: 1.0, carbohydrate_per_100g: 5.0, fiber_per_100g: 0.0, portion_size: 200, portion_unit: "ml", urt_description: "1 gelas" },
  { name: "Susu Bubuk Full Cream", code: "SS003", category: :susu, energy_per_100g: 496, protein_per_100g: 24.6, fat_per_100g: 25.0, carbohydrate_per_100g: 36.2, fiber_per_100g: 0.0, portion_size: 25, portion_unit: "gram", urt_description: "3 sdm" },
  { name: "Yoghurt Plain", code: "SS004", category: :susu, energy_per_100g: 52, protein_per_100g: 3.5, fat_per_100g: 1.5, carbohydrate_per_100g: 6.0, fiber_per_100g: 0.0, portion_size: 150, portion_unit: "gram", urt_description: "1 cup" }
]

food_items_data.each do |data|
  FoodItem.find_or_create_by!(code: data[:code]) do |fi|
    fi.assign_attributes(data)
  end
end

puts "Created #{FoodItem.count} food items"

# =============================================================================
# DEFAULT ADMIN USER
# =============================================================================
puts "Creating default admin user..."

admin = User.find_or_create_by!(email: "admin@mbg.go.id") do |user|
  user.name = "Administrator"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = :admin
end

puts "Admin user created: #{admin.email}"

# =============================================================================
# DEFAULT DIETITIAN USER
# =============================================================================
puts "Creating default dietitian user..."

dietitian = User.find_or_create_by!(email: "ahligizi@mbg.go.id") do |user|
  user.name = "Ahli Gizi"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = :dietitian
end

puts "Dietitian user created: #{dietitian.email}"

puts "Seeding completed!"
