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
# Default Achievements for Gamification
# ===========================================
puts "Creating default achievements..."

achievements = [
  # XP Milestones
  { title: "First Steps", description: "Earn your first 10 XP!", criteria_type: :total_xp, criteria_value: 10, xp_reward: 5, icon_key: "first_steps" },
  { title: "XP Beginner", description: "Earn 50 XP total!", criteria_type: :total_xp, criteria_value: 50, xp_reward: 10, icon_key: "xp_beginner" },
  { title: "XP Collector", description: "Earn 100 XP total!", criteria_type: :total_xp, criteria_value: 100, xp_reward: 25, icon_key: "xp_collector" },
  { title: "XP Hunter", description: "Earn 500 XP total!", criteria_type: :total_xp, criteria_value: 500, xp_reward: 50, icon_key: "xp_hunter" },
  { title: "XP Master", description: "Earn 1000 XP total!", criteria_type: :total_xp, criteria_value: 1000, xp_reward: 100, icon_key: "xp_master" },

  # Course Completions
  { title: "Course Graduate", description: "Complete your first course!", criteria_type: :courses_completed, criteria_value: 1, xp_reward: 50, icon_key: "course_graduate" },
  { title: "Dedicated Learner", description: "Complete 3 courses!", criteria_type: :courses_completed, criteria_value: 3, xp_reward: 150, icon_key: "dedicated_learner" },
  { title: "Knowledge Seeker", description: "Complete 5 courses!", criteria_type: :courses_completed, criteria_value: 5, xp_reward: 300, icon_key: "knowledge_seeker" },
  { title: "Course Champion", description: "Complete 10 courses!", criteria_type: :courses_completed, criteria_value: 10, xp_reward: 500, icon_key: "course_champion" },

  # Login Streaks
  { title: "Getting Started", description: "Login for 2 days in a row!", criteria_type: :login_streak, criteria_value: 2, xp_reward: 10, icon_key: "getting_started" },
  { title: "Consistent Learner", description: "Login for 5 days in a row!", criteria_type: :login_streak, criteria_value: 5, xp_reward: 30, icon_key: "consistent_learner" },
  { title: "Week Warrior", description: "Login for 7 days in a row!", criteria_type: :login_streak, criteria_value: 7, xp_reward: 70, icon_key: "week_warrior" },
  { title: "Monthly Champion", description: "Login for 30 days in a row!", criteria_type: :login_streak, criteria_value: 30, xp_reward: 300, icon_key: "monthly_champion" }
]

achievements.each do |achievement_data|
  Achievement.find_or_create_by!(title: achievement_data[:title]) do |achievement|
    achievement.description = achievement_data[:description]
    achievement.criteria_type = achievement_data[:criteria_type]
    achievement.criteria_value = achievement_data[:criteria_value]
    achievement.xp_reward = achievement_data[:xp_reward]
    achievement.icon_key = achievement_data[:icon_key]
  end
end

puts "Created #{Achievement.count} achievements"

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
  instructor.instructor_profile&.update!(bio: "Pengajar coding dan robotik berpengalaman 10 tahun", expertise: [ "Scratch", "Python", "Arduino" ])
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
    user.name = "Malika"
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

    # Create quizzes for lessons
    puts "Creating sample quizzes..."
    course.lessons.each_with_index do |lesson, index|
      quiz = lesson.create_quiz!(
        title: "Kuis: #{lesson.title}",
        description: "Uji pemahamanmu tentang #{lesson.title}",
        passing_score: 70,
        time_limit_minutes: 10,
        max_attempts: 3,
        xp_reward: 25
      )

      # Question 1: Multiple choice
      q1 = quiz.questions.create!(
        content: index == 0 ? "Siapa yang mengembangkan Scratch?" : "Apa langkah pertama membuat proyek Scratch?",
        question_type: :multiple_choice,
        points: 10,
        position: 0
      )

      if index == 0
        q1.answers.create!(content: "MIT (Massachusetts Institute of Technology)", is_correct: true, position: 0)
        q1.answers.create!(content: "Google", is_correct: false, position: 1)
        q1.answers.create!(content: "Microsoft", is_correct: false, position: 2)
        q1.answers.create!(content: "Apple", is_correct: false, position: 3)
      else
        q1.answers.create!(content: "Klik 'Create' di halaman utama", is_correct: true, position: 0)
        q1.answers.create!(content: "Download aplikasi", is_correct: false, position: 1)
        q1.answers.create!(content: "Beli lisensi", is_correct: false, position: 2)
        q1.answers.create!(content: "Hubungi admin", is_correct: false, position: 3)
      end

      # Question 2: True/False
      q2 = quiz.questions.create!(
        content: index == 0 ? "Scratch adalah bahasa pemrograman berbasis teks." : "Proyek Scratch bisa dibagikan ke komunitas online.",
        question_type: :true_false,
        points: 10,
        position: 1
      )
      q2.answers.create!(content: "Benar", is_correct: index != 0, position: 0)
      q2.answers.create!(content: "Salah", is_correct: index == 0, position: 1)

      # Question 3: Multiple choice
      q3 = quiz.questions.create!(
        content: index == 0 ? "Untuk usia berapa Scratch cocok digunakan?" : "Apa yang disebut 'sprite' di Scratch?",
        question_type: :multiple_choice,
        points: 10,
        position: 2
      )

      if index == 0
        q3.answers.create!(content: "8-16 tahun", is_correct: true, position: 0)
        q3.answers.create!(content: "18+ tahun saja", is_correct: false, position: 1)
        q3.answers.create!(content: "Hanya untuk dewasa", is_correct: false, position: 2)
        q3.answers.create!(content: "Tidak ada batasan usia", is_correct: false, position: 3)
      else
        q3.answers.create!(content: "Karakter atau objek yang bisa diprogram", is_correct: true, position: 0)
        q3.answers.create!(content: "Jenis minuman", is_correct: false, position: 1)
        q3.answers.create!(content: "Nama perusahaan", is_correct: false, position: 2)
        q3.answers.create!(content: "Tombol keyboard", is_correct: false, position: 3)
      end

      puts "  Created quiz: #{quiz.title} with #{quiz.questions.count} questions"
    end
  end
end

puts "Seed completed!"
