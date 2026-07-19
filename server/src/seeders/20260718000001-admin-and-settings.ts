import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

module.exports = {
  async up(queryInterface: QueryInterface) {
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Ahmed Fares',
        email: 'admin@ahmedfares.com',
        password: hashedPassword,
        phone: '01144258565',
        role: 'admin',
        language: 'ar',
        theme: 'light',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('site_settings', [
      { key: 'site_name', value: JSON.stringify({ en: 'Ahmed Fares English Academy', ar: 'أكاديمية أحمد فارس للإنجليزية' }), created_at: new Date(), updated_at: new Date() },
      { key: 'site_description', value: JSON.stringify({ en: 'Premium English learning platform for Egyptian Thanaweya Amma students', ar: 'منصة تعليم إنجليزي متميزة لطلاب الثانوية العامة المصرية' }), created_at: new Date(), updated_at: new Date() },
      { key: 'site_name_short', value: JSON.stringify({ en: 'Ahmed Fares Academy', ar: 'أكاديمية أحمد فارس' }), created_at: new Date(), updated_at: new Date() },
      { key: 'phone', value: JSON.stringify({ en: '01144258565', ar: '01144258565' }), created_at: new Date(), updated_at: new Date() },
      { key: 'whatsapp', value: JSON.stringify({ en: '201144258565', ar: '201144258565' }), created_at: new Date(), updated_at: new Date() },
      { key: 'address', value: JSON.stringify({ en: 'Behind Khatem Al-Morsaleen School, Beni Suef', ar: 'خلف مدرسة ختم المرسلين، بني سويف' }), created_at: new Date(), updated_at: new Date() },
      { key: 'map_coordinates', value: JSON.stringify({ lat: 29.07338889, lng: 31.11063889 }), created_at: new Date(), updated_at: new Date() },
      { key: 'social_facebook', value: JSON.stringify({ url: '' }), created_at: new Date(), updated_at: new Date() },
      { key: 'social_instagram', value: JSON.stringify({ url: '' }), created_at: new Date(), updated_at: new Date() },
      { key: 'social_youtube', value: JSON.stringify({ url: '' }), created_at: new Date(), updated_at: new Date() },
      { key: 'footer_description', value: JSON.stringify({ en: 'Premium English learning platform for Egyptian Thanaweya Amma students - 28 years of experience', ar: 'منصة تعليم إنجليزي متميزة لطلاب الثانوية العامة المصرية - 28 سنة خبرة' }), created_at: new Date(), updated_at: new Date() },
      { key: 'primary_color', value: JSON.stringify('#1e40af'), created_at: new Date(), updated_at: new Date() },
      { key: 'secondary_color', value: JSON.stringify('#f59e0b'), created_at: new Date(), updated_at: new Date() },
      { key: 'contact_phone', value: JSON.stringify('01144258565'), created_at: new Date(), updated_at: new Date() },
      { key: 'contact_location', value: JSON.stringify({ en: 'Behind Khatem Al-Morsaleen School, Beni Suef', ar: 'خلف مدرسة ختم المرسلين، بني سويف' }), created_at: new Date(), updated_at: new Date() },
      { key: 'coordinates', value: JSON.stringify({ lat: '29.07338889', lng: '31.11063889' }), created_at: new Date(), updated_at: new Date() },
      { key: 'hero_title', value: JSON.stringify({ en: 'Learn English with 28 Years of Experience', ar: 'تعلم الإنجليزية مع 28 عامًا من الخبرة' }), created_at: new Date(), updated_at: new Date() },
      { key: 'hero_subtitle', value: JSON.stringify({ en: 'Ahmed Fares - Diploma in Teaching English from Scotland', ar: 'أحمد فارس - دبلومة تدريس الإنجليزية من اسكتلندا' }), created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('site_settings', {});
    await queryInterface.bulkDelete('users', { email: 'admin@ahmedfares.com' });
  },
};
