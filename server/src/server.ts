import app from './app';
import { env } from './config/env';
import { sequelize } from './models';
import User from './models/User';
import SiteSetting from './models/SiteSetting';
import PageContent from './models/PageContent';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  const queryInterface = sequelize.getQueryInterface();

  // Seed admin user if not exists
  const adminExists = await User.findOne({ where: { email: 'admin@ahmedfares.com' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    await User.create({
      name: 'Ahmed Fares',
      email: 'admin@ahmedfares.com',
      password: hashedPassword,
      phone: '01144258565',
      role: 'admin',
      language: 'ar',
      theme: 'light',
      isVerified: true,
    } as any);
    console.log('Admin user seeded');
  }

  // Seed site settings if empty
  const settingsCount = await SiteSetting.count();
  if (settingsCount === 0) {
    const settings = [
      { key: 'site_name', value: JSON.stringify({ en: 'Ahmed Fares English Academy', ar: 'أكاديمية أ/احمد فارس للإنجليزية' }), created_at: new Date(), updated_at: new Date() },
      { key: 'site_name_short', value: JSON.stringify({ en: 'Ahmed Fares Academy', ar: 'أكاديمية أ/احمد فارس' }), created_at: new Date(), updated_at: new Date() },
      { key: 'site_description', value: JSON.stringify({ en: 'Premium English learning platform for Egyptian Thanaweya Amma students', ar: 'منصة تعليم إنجليزي متميزة لطلاب الثانوية العامة المصرية' }), created_at: new Date(), updated_at: new Date() },
      { key: 'phone', value: JSON.stringify({ en: '01144258565', ar: '01144258565' }), created_at: new Date(), updated_at: new Date() },
      { key: 'whatsapp', value: JSON.stringify({ en: '201144258565', ar: '201144258565' }), created_at: new Date(), updated_at: new Date() },
      { key: 'address', value: JSON.stringify({ en: 'Behind Khatem Al-Morsaleen School, Beni Suef', ar: 'خلف مدرسة ختم المرسلين، بني سويف' }), created_at: new Date(), updated_at: new Date() },
      { key: 'map_coordinates', value: JSON.stringify({ lat: 29.07338889, lng: 31.11063889 }), created_at: new Date(), updated_at: new Date() },
      { key: 'social_facebook', value: JSON.stringify({ url: '' }), created_at: new Date(), updated_at: new Date() },
      { key: 'social_instagram', value: JSON.stringify({ url: '' }), created_at: new Date(), updated_at: new Date() },
      { key: 'social_youtube', value: JSON.stringify({ url: '' }), created_at: new Date(), updated_at: new Date() },
      { key: 'footer_description', value: JSON.stringify({ en: 'Premium English learning platform for Egyptian Thanaweya Amma students - 28 years of experience', ar: 'منصة تعليم إنجليزي متميزة لطلاب الثانوية العامة المصرية - 28 سنة خبرة' }), created_at: new Date(), updated_at: new Date() },
      { key: 'hero_title', value: JSON.stringify({ en: 'Learn English with 28 Years of Experience', ar: 'تعلم الإنجليزية مع 28 عامًا من الخبرة' }), created_at: new Date(), updated_at: new Date() },
      { key: 'hero_subtitle', value: JSON.stringify({ en: 'Ahmed Fares - Diploma in Teaching English from Scotland', ar: 'أ/احمد فارس - دبلومة تدريس الإنجليزية من اسكتلندا' }), created_at: new Date(), updated_at: new Date() },
      { key: 'primary_color', value: JSON.stringify('#1e40af'), created_at: new Date(), updated_at: new Date() },
      { key: 'secondary_color', value: JSON.stringify('#f59e0b'), created_at: new Date(), updated_at: new Date() },
      { key: 'contact_phone', value: JSON.stringify('01144258565'), created_at: new Date(), updated_at: new Date() },
      { key: 'contact_location', value: JSON.stringify({ en: 'Behind Khatem Al-Morsaleen School, Beni Suef', ar: 'خلف مدرسة ختم المرسلين، بني سويف' }), created_at: new Date(), updated_at: new Date() },
      { key: 'coordinates', value: JSON.stringify({ lat: '29.07338889', lng: '31.11063889' }), created_at: new Date(), updated_at: new Date() },
    ];
    await queryInterface.bulkInsert('site_settings', settings);
    console.log('Site settings seeded');
  }

  // Seed page content if empty
  const contentCount = await PageContent.count();
  if (contentCount === 0) {
    await seedPageContent(queryInterface);
    console.log('Page content seeded');
  }
};

const seedPageContent = async (queryInterface: any) => {
  const now = new Date();
  const data = [
    { page: 'home', section: 'hero', key: 'title', value_en: 'Learn English with 28 Years of Experience', value_ar: 'اتعلم إنجليزي مع 28 سنة خبرة', created_at: now, updated_at: now },
    { page: 'home', section: 'hero', key: 'subtitle', value_en: 'Ahmed Fares - Diploma in Teaching English from Scotland', value_ar: 'أ/احمد فارس - دبلومة تدريس اللغة الإنجليزية من اسكتلندا', created_at: now, updated_at: now },
    { page: 'home', section: 'hero', key: 'cta', value_en: 'Start Learning Now', value_ar: 'ابدأ التعلم الآن', created_at: now, updated_at: now },
    { page: 'home', section: 'hero', key: 'badge', value_en: 'Ahmed Fares - 28 Years Experience', value_ar: 'أ/احمد فارس - 28 سنة خبرة', created_at: now, updated_at: now },
    { page: 'home', section: 'hero', key: 'rating', value_en: '4.9/5 Student Rating', value_ar: 'تقييم الطلاب 4.9/5', created_at: now, updated_at: now },
    { page: 'home', section: 'stats', key: 'years', value_en: '28+', value_ar: '+28', metadata: JSON.stringify({ labelEn: 'Years Experience', labelAr: 'سنة خبرة', order: 1 }), created_at: now, updated_at: now },
    { page: 'home', section: 'stats', key: 'students', value_en: '10K+', value_ar: '+10 آلاف', metadata: JSON.stringify({ labelEn: 'Students', labelAr: 'طالب', order: 2 }), created_at: now, updated_at: now },
    { page: 'home', section: 'stats', key: 'courses', value_en: '50+', value_ar: '+50', metadata: JSON.stringify({ labelEn: 'Courses', labelAr: 'كورس', order: 3 }), created_at: now, updated_at: now },
    { page: 'home', section: 'stats', key: 'success', value_en: '95%', value_ar: '95%', metadata: JSON.stringify({ labelEn: 'Success Rate', labelAr: 'نسبة النجاح', order: 4 }), created_at: now, updated_at: now },
    { page: 'home', section: 'testimonials', key: 'testimonial1', value_en: 'Mohamed Ahmed', value_ar: 'محمد أحمد', metadata: JSON.stringify({ roleEn: 'Student', roleAr: 'طالب', contentEn: 'Ahmed Fares completely changed my approach to English. His methods are unique and effective.', contentAr: 'أ/احمد فارس غير تماماً من نظرتي للإنجليزي. أساليبه فريدة وفعالة.', rating: 5, order: 1 }), created_at: now, updated_at: now },
    { page: 'home', section: 'testimonials', key: 'testimonial2', value_en: 'Sara Ali', value_ar: 'سارة علي', metadata: JSON.stringify({ roleEn: 'Student', roleAr: 'طالبة', contentEn: 'Thanks to Ahmed Fares, I scored 98% in my Thanaweya Amma English exam.', contentAr: 'بفضلك أ/احمد فارس, جبت 95% في امتحان الإنجليزي في الثانوية العامة.', rating: 5, order: 2 }), created_at: now, updated_at: now },
    { page: 'home', section: 'testimonials', key: 'testimonial3', value_en: 'Omar Hassan', value_ar: 'عمر حسن', metadata: JSON.stringify({ roleEn: 'Student', roleAr: 'طالب', contentEn: 'The live sessions and personal attention made all the difference.', contentAr: 'الجلسات المباشرة والاهتمام الشخصي أحدثا فرقا كبيرا.', rating: 5, order: 3 }), created_at: now, updated_at: now },
    { page: 'home', section: 'whyChooseUs', key: 'experience', value_en: '28 Years Experience', value_ar: '28 سنة خبرة', metadata: JSON.stringify({ icon: 'Award', descriptionEn: 'Over 28 years of teaching English', descriptionAr: 'أكثر من 28 سنة تدريس الإنجليزي', order: 1 }), created_at: now, updated_at: now },
    { page: 'home', section: 'whyChooseUs', key: 'diploma', value_en: 'International Diploma', value_ar: 'دبلومة دولية', metadata: JSON.stringify({ icon: 'GraduationCap', descriptionEn: 'Diploma in Teaching English from Scotland', descriptionAr: 'دبلومة تدريس اللغة الإنجليزية من اسكتلندا', order: 2 }), created_at: now, updated_at: now },
    { page: 'home', section: 'whyChooseUs', key: 'students_count', value_en: '10,000+ Students', value_ar: '+10 آلاف طالب', metadata: JSON.stringify({ icon: 'Users', descriptionEn: 'Trained over 10,000 students', descriptionAr: 'درّب أكثر من 10 آلاف طالب', order: 3 }), created_at: now, updated_at: now },
    { page: 'home', section: 'whyChooseUs', key: 'support', value_en: 'Personal Support', value_ar: 'دعم شخصي', metadata: JSON.stringify({ icon: 'Headphones', descriptionEn: 'Direct WhatsApp support for all students', descriptionAr: 'دعم مباشر عبر واتساب لجميع الطلاب', order: 4 }), created_at: now, updated_at: now },
    { page: 'home', section: 'whyChooseUs', key: 'live', value_en: 'Live & Offline Sessions', value_ar: 'جلسات مباشرة وأوفلاين', metadata: JSON.stringify({ icon: 'Video', descriptionEn: 'Online and in-person classes available', descriptionAr: 'دروس أونلاين وأوفلاين متاحة', order: 5 }), created_at: now, updated_at: now },
    { page: 'home', section: 'whyChooseUs', key: 'ai', value_en: 'AI-Powered Learning', value_ar: 'تعلم بالذكاء الاصطناعي', metadata: JSON.stringify({ icon: 'Brain', descriptionEn: 'Modern AI tools for personalized learning', descriptionAr: 'أدوات ذكاء اصطناعي حديثة للتعلم الشخصي', order: 6 }), created_at: now, updated_at: now },
    { page: 'home', section: 'teacher', key: 'name', value_en: 'Ahmed Fares', value_ar: 'أ/احمد فارس', created_at: now, updated_at: now },
    { page: 'home', section: 'teacher', key: 'title', value_en: 'English Language Teacher', value_ar: 'مدرس اللغة الإنجليزية', created_at: now, updated_at: now },
    { page: 'home', section: 'teacher', key: 'bio', value_en: 'With over 28 years of teaching experience and a diploma in teaching English from Scotland, Ahmed Fares has helped thousands of students achieve their academic goals.', value_ar: 'مع أكثر من 28 سنة من خبرة التدريس ودبلومة في تدريس اللغة الإنجليزية من اسكتلندا، ساعد أ/احمد فارس آلاف الطلاب في تحقيق أهدافهم الأكاديمية.', created_at: now, updated_at: now },
    { page: 'home', section: 'cta', key: 'heading', value_en: 'Ready to Start Your Learning Journey?', value_ar: 'مستعد تبدأ رحلة التعلم بتاعتك؟', created_at: now, updated_at: now },
    { page: 'home', section: 'cta', key: 'description', value_en: 'Join thousands of students who have achieved their dreams with Ahmed Fares Academy.', value_ar: 'انضم لآلاف الطلاب اللي حققوا أحلامهم مع أكاديمية أ/احمد فارس.', created_at: now, updated_at: now },
    { page: 'home', section: 'cta', key: 'cta_primary', value_en: 'Register Now Free', value_ar: 'سجل الآن مجاناً', created_at: now, updated_at: now },
    { page: 'home', section: 'cta', key: 'cta_secondary', value_en: 'Browse Courses', value_ar: 'تصفح الكورسات', created_at: now, updated_at: now },
    { page: 'about', section: 'hero', key: 'title', value_en: 'About Us', value_ar: 'من نحن', created_at: now, updated_at: now },
    { page: 'about', section: 'hero', key: 'subtitle', value_en: 'Learn about Ahmed Fares and his journey in English education', value_ar: 'تعرّف على أ/احمد فارس ورحلته في تعليم الإنجليزي', created_at: now, updated_at: now },
    { page: 'about', section: 'teacher', key: 'name', value_en: 'Ahmed Fares', value_ar: 'أ/احمد فارس', created_at: now, updated_at: now },
    { page: 'about', section: 'teacher', key: 'title', value_en: 'English Language Teacher', value_ar: 'مدرس اللغة الإنجليزية', created_at: now, updated_at: now },
    { page: 'about', section: 'teacher', key: 'location', value_en: 'Beni Suef, Egypt', value_ar: 'بني سويف، مصر', created_at: now, updated_at: now },
    { page: 'about', section: 'teacher', key: 'phone', value_en: '01144258565', value_ar: '01144258565', created_at: now, updated_at: now },
    { page: 'about', section: 'biography', key: 'title', value_en: 'A Journey Full of Success', value_ar: 'رحلة مليئة بالنجاح', created_at: now, updated_at: now },
    { page: 'about', section: 'biography', key: 'paragraph1', value_en: 'With over 28 years of teaching English, Ahmed Fares has dedicated his life to helping Egyptian students master the English language. Starting his career at Nile Secondary School and later at El Shorouk Experimental Languages School, he has consistently delivered outstanding results.', value_ar: 'مع أكثر من 28 سنة من تدريس اللغة الإنجليزية، كرّس أ/احمد فارس حياته لمساعدة الطلاب المصريين على إتقان اللغة الإنجليزية. بدأ مسيرته المهنية في مدرسة النيل الثانوية ولاحقاً في مدرسة الشروق التجريبية للغات، وقد قدم دائماً نتائج مبهرة.', created_at: now, updated_at: now },
    { page: 'about', section: 'biography', key: 'paragraph2', value_en: 'His diploma in teaching English from Scotland has equipped him with world-class teaching methodologies that he brings to every classroom. His commitment to excellence has made him one of the most respected English teachers in Beni Suef and beyond.', value_ar: 'دبلومته في تدريس اللغة الإنجليزية من اسكتلندا أهّنته بمنهجيات تدريس عالمية يقدمها في كل حصة. التزامه بالتميز جعله واحداً من أكثر مدربي الإنجليزية احتراماً في بني سويف وخارجها.', created_at: now, updated_at: now },
    { page: 'about', section: 'experience', key: 'exp1', value_en: '28 Years Teaching Experience', value_ar: '28 سنة خبرة في التدريس', metadata: JSON.stringify({ year: '1996-Present', order: 1 }), created_at: now, updated_at: now },
    { page: 'about', section: 'experience', key: 'exp2', value_en: 'Diploma in Teaching English from Scotland', value_ar: 'دبلومة تدريس اللغة الإنجليزية من اسكتلندا', metadata: JSON.stringify({ year: '2005', order: 2 }), created_at: now, updated_at: now },
    { page: 'about', section: 'schools', key: 'school1', value_en: 'Nile Secondary School', value_ar: 'المرحلة الثانوية - مدرسة النيل', metadata: JSON.stringify({ order: 1 }), created_at: now, updated_at: now },
    { page: 'about', section: 'schools', key: 'school2', value_en: 'El Shorouk Experimental Languages School', value_ar: 'مدرسة الشروق التجريبية للغات', metadata: JSON.stringify({ order: 2 }), created_at: now, updated_at: now },
    { page: 'about', section: 'values', key: 'passion', value_en: 'Passion for Teaching', value_ar: 'شغف بالتدريس', metadata: JSON.stringify({ icon: 'Heart', descriptionEn: 'Every lesson is delivered with genuine love for teaching', descriptionAr: 'كل درس يُقدّم بحب حقيقي للتدريس', order: 1 }), created_at: now, updated_at: now },
    { page: 'about', section: 'values', key: 'student_focus', value_en: 'Student-Focused', value_ar: 'التركيز على الطالب', metadata: JSON.stringify({ icon: 'Users', descriptionEn: 'Every student receives personalized attention', descriptionAr: 'كل طالب يحصل على اهتمام شخصي', order: 2 }), created_at: now, updated_at: now },
    { page: 'about', section: 'values', key: 'quality', value_en: 'Quality & Excellence', value_ar: 'الجودة والتميز', metadata: JSON.stringify({ icon: 'Star', descriptionEn: 'Committed to the highest standards of education', descriptionAr: 'ملتزم بأعلى معايير التعليم', order: 3 }), created_at: now, updated_at: now },
    { page: 'about', section: 'stats', key: 'years', value_en: '28+', value_ar: '+28', metadata: JSON.stringify({ labelEn: 'Years Experience', labelAr: 'سنة خبرة' }), created_at: now, updated_at: now },
    { page: 'about', section: 'stats', key: 'students', value_en: '10K+', value_ar: '+10 آلاف', metadata: JSON.stringify({ labelEn: 'Students Trained', labelAr: 'طالب تدربوا' }), created_at: now, updated_at: now },
    { page: 'contact', section: 'hero', key: 'title', value_en: 'Contact Us', value_ar: 'اتصل بنا', created_at: now, updated_at: now },
    { page: 'contact', section: 'hero', key: 'subtitle', value_en: 'We are here to help you. Reach out to us anytime.', value_ar: ' إحنا هنا عشان نساعدك. تواصل معانا في أي وقت.', created_at: now, updated_at: now },
    { page: 'contact', section: 'contactInfo', key: 'phone', value_en: '01144258565', value_ar: '01144258565', metadata: JSON.stringify({ icon: 'Phone', labelEn: 'Phone', labelAr: 'التليفون', link: 'tel:01144258565', order: 1 }), created_at: now, updated_at: now },
    { page: 'contact', section: 'contactInfo', key: 'address', value_en: 'Behind Khatem Al-Morsaleen School, Beni Suef', value_ar: 'خلف مدرسة ختم المرسلين، بني سويف', metadata: JSON.stringify({ icon: 'MapPin', labelEn: 'Address', labelAr: 'العنوان', lat: 29.07338889, lng: 31.11063889, order: 2 }), created_at: now, updated_at: now },
    { page: 'contact', section: 'contactInfo', key: 'hours', value_en: 'Saturday - Thursday: 10:00 AM - 8:00 PM', value_ar: 'السبت - الخميس: 10 صباحاً - 8 مساءً', metadata: JSON.stringify({ icon: 'Clock', labelEn: 'Working Hours', labelAr: 'ساعات العمل', order: 3 }), created_at: now, updated_at: now },
    { page: 'contact', section: 'map', key: 'coordinates', value_en: '29.07338889,31.11063889', value_ar: '29.07338889,31.11063889', created_at: now, updated_at: now },
    { page: 'contact', section: 'whatsapp', key: 'number', value_en: '201144258565', value_ar: '201144258565', created_at: now, updated_at: now },
    { page: 'contact', section: 'whatsapp', key: 'link', value_en: 'https://wa.me/201144258565', value_ar: 'https://wa.me/201144258565', created_at: now, updated_at: now },
  ];
  await queryInterface.bulkInsert('page_content', data);
};

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Auto-create tables and seed in production
    if (env.NODE_ENV === 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database tables synced');
      await seedDatabase();
    }

    // Start server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();
