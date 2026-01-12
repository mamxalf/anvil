# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# ===========================================
# Default Badges for Gamification
# ===========================================
puts "Creating default badges..."

badges = [
  # First achievements
  { name: "Penjelajah Pertama", name_en: "First Explorer", description: "Mendaftar kursus pertamamu!", icon: "🚀", criteria_type: :first_course, criteria_value: 1, points_reward: 50, rarity: :common },
  { name: "Langkah Pertama", name_en: "First Steps", description: "Menyelesaikan pelajaran pertamamu!", icon: "👣", criteria_type: :first_lesson, criteria_value: 1, points_reward: 25, rarity: :common },

  # Course completions
  { name: "Lulusan", name_en: "Graduate", description: "Menyelesaikan 1 kursus!", icon: "🎓", criteria_type: :course_completed, criteria_value: 1, points_reward: 100, rarity: :common },
  { name: "Pembelajar Rajin", name_en: "Dedicated Learner", description: "Menyelesaikan 5 kursus!", icon: "📚", criteria_type: :course_completed, criteria_value: 5, points_reward: 500, rarity: :rare },
  { name: "Master STEM", name_en: "STEM Master", description: "Menyelesaikan 10 kursus!", icon: "🏆", criteria_type: :course_completed, criteria_value: 10, points_reward: 1000, rarity: :epic },

  # Lesson completions
  { name: "Pekerja Keras", name_en: "Hard Worker", description: "Menyelesaikan 10 pelajaran!", icon: "💪", criteria_type: :lessons_completed, criteria_value: 10, points_reward: 100, rarity: :common },
  { name: "Super Learner", name_en: "Super Learner", description: "Menyelesaikan 50 pelajaran!", icon: "⭐", criteria_type: :lessons_completed, criteria_value: 50, points_reward: 500, rarity: :rare },
  { name: "Legend Pelajar", name_en: "Learning Legend", description: "Menyelesaikan 100 pelajaran!", icon: "👑", criteria_type: :lessons_completed, criteria_value: 100, points_reward: 1500, rarity: :legendary },

  # Streak badges
  { name: "Konsisten", name_en: "Consistent", description: "Streak 3 hari berturut-turut!", icon: "🔥", criteria_type: :streak_days, criteria_value: 3, points_reward: 50, rarity: :common },
  { name: "Semangat Minggu", name_en: "Week Warrior", description: "Streak 7 hari berturut-turut!", icon: "🌟", criteria_type: :streak_days, criteria_value: 7, points_reward: 150, rarity: :rare },
  { name: "Pahlawan Bulan", name_en: "Monthly Hero", description: "Streak 30 hari berturut-turut!", icon: "🦸", criteria_type: :streak_days, criteria_value: 30, points_reward: 500, rarity: :epic },
  { name: "Legenda Streak", name_en: "Streak Legend", description: "Streak 100 hari berturut-turut!", icon: "💎", criteria_type: :streak_days, criteria_value: 100, points_reward: 2000, rarity: :legendary },

  # Quiz badges
  { name: "Quiz Master", name_en: "Quiz Master", description: "Lulus 5 kuis!", icon: "✅", criteria_type: :quizzes_passed, criteria_value: 5, points_reward: 100, rarity: :common },
  { name: "Otak Jenius", name_en: "Quiz Genius", description: "Lulus 25 kuis!", icon: "🧠", criteria_type: :quizzes_passed, criteria_value: 25, points_reward: 500, rarity: :rare },
  { name: "Nilai Sempurna", name_en: "Perfect Score", description: "Dapat nilai 100 di kuis!", icon: "💯", criteria_type: :perfect_quiz, criteria_value: 1, points_reward: 200, rarity: :rare },
  { name: "Perfectionist", name_en: "Perfectionist", description: "Dapat nilai 100 di 10 kuis!", icon: "🎯", criteria_type: :perfect_quiz, criteria_value: 10, points_reward: 1000, rarity: :legendary },

  # Points milestones
  { name: "Kolektor Poin", name_en: "Point Collector", description: "Kumpulkan 1000 XP!", icon: "💰", criteria_type: :total_points, criteria_value: 1000, points_reward: 100, rarity: :common },
  { name: "XP Hunter", name_en: "XP Hunter", description: "Kumpulkan 5000 XP!", icon: "💎", criteria_type: :total_points, criteria_value: 5000, points_reward: 300, rarity: :rare },
  { name: "XP Legend", name_en: "XP Legend", description: "Kumpulkan 25000 XP!", icon: "🌈", criteria_type: :total_points, criteria_value: 25000, points_reward: 1000, rarity: :legendary }
]

badges.each do |badge_data|
  Badge.find_or_create_by!(name: badge_data[:name]) do |badge|
    badge.description = badge_data[:description]
    badge.icon = badge_data[:icon]
    badge.criteria_type = badge_data[:criteria_type]
    badge.criteria_value = badge_data[:criteria_value]
    badge.points_reward = badge_data[:points_reward]
    badge.rarity = badge_data[:rarity]
  end
end

puts "Created #{Badge.count} badges"

# ===========================================
# Sample Admin User (Development Only)
# ===========================================
if Rails.env.development?
  puts "Creating sample users..."

  # Admin
  admin = User.find_or_create_by!(email: "admin@kodilearn.id") do |user|
    user.name = "Admin Kodilearn"
    user.password = "password123"
    user.password_confirmation = "password123"
    user.role = :admin
  end
  puts "Admin created: #{admin.email}"

  # Instructor
  instructor = User.find_or_create_by!(email: "instructor@kodilearn.id") do |user|
    user.name = "Pak Guru Kodi"
    user.password = "password123"
    user.password_confirmation = "password123"
    user.role = :instructor
  end
  instructor.instructor_profile&.update!(bio: "Pengajar coding dan robotik berpengalaman 10 tahun", expertise: ["Scratch", "Python", "Arduino"])
  puts "Instructor created: #{instructor.email}"

  # Parent
  parent = User.find_or_create_by!(email: "parent@kodilearn.id") do |user|
    user.name = "Budi Santoso"
    user.password = "password123"
    user.password_confirmation = "password123"
    user.role = :parent
  end
  puts "Parent created: #{parent.email}"

  # Student
  student = User.find_or_create_by!(email: "student@kodilearn.id") do |user|
    user.name = "Anisa"
    user.password = "password123"
    user.password_confirmation = "password123"
    user.role = :student
  end
  student.student_profile&.update!(birth_date: 10.years.ago.to_date, grade_level: "5 SD")
  puts "Student created: #{student.email}"

  # Link parent to student
  ParentChild.find_or_create_by!(parent: parent, child: student) do |pc|
    pc.relationship_type = "parent"
    pc.notifications_enabled = true
    pc.email_frequency = :both
  end
  puts "Linked parent #{parent.name} to student #{student.name}"

  # Sample course
  if instructor.instructor_profile && Course.count == 0
    course = Course.create!(
      instructor: instructor.instructor_profile,
      title: "Belajar Scratch untuk Pemula",
      description: "Kursus pengenalan pemrograman visual dengan Scratch. Cocok untuk anak usia 6-12 tahun.",
      level: :beginner,
      subject: :coding,
      status: :published,
      enrollment_type: :free,
      min_age: 6,
      max_age: 12,
      estimated_hours: 5
    )

    # Create a module
    mod = course.course_modules.create!(
      title: "Pengenalan Scratch",
      description: "Modul pertama untuk mengenal antarmuka Scratch",
      position: 0
    )

    # Create lessons
    mod.lessons.create!(
      title: "Apa itu Scratch?",
      content: "Scratch adalah bahasa pemrograman visual yang dikembangkan oleh MIT...",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration_minutes: 10,
      position: 0,
      xp_reward: 15
    )

    mod.lessons.create!(
      title: "Membuat Proyek Pertama",
      content: "Mari kita buat proyek Scratch pertama kita...",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration_minutes: 15,
      position: 1,
      xp_reward: 20
    )

    puts "Created sample course: #{course.title}"
  end
end

puts "Seed completed!"
