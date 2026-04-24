/* ============================================================
   I18N.JS — Translation System (Swahili / English)
   ============================================================ */

const I18N = {

  current: 'en',

  /* ── Translations ─────────────────────────────────────── */
  translations: {

    sw: {
      /* Sidebar */
      nav_main:       'KAZI',
      nav_account:    'AKAUNTI',
      nav_overview:   'Muhtasari',
      nav_users:      'Watumiaji',
      nav_profile:    'Wasifu Wangu',
      nav_security:   'Usalama',
      nav_settings:   'Mipangilio',
      nav_logout:     'Toka',

      /* Page titles */
      page_overview:  'Muhtasari',
      page_users:     'Watumiaji',
      page_profile:   'Wasifu Wangu',
      page_security:  'Usalama',
      page_settings:  'Mipangilio',

      /* Greetings */
      greet_morning:  'Habari za asubuhi',
      greet_afternoon:'Habari za mchana',
      greet_evening:  'Habari za jioni',
      greet_night:    'Habari za usiku',
      welcome_badge:  'Umeingia leo',

      /* Stats */
      stat_total:     'Watumiaji Wote',
      stat_active:    'Wanaotumia',
      stat_logins:    'Wageni wa Leo',
      stat_new:       'Wapya Wiki Hii',

      /* Chart */
      chart_title:    'Shughuli za Wiki',
      chart_range:    'Siku 7 zilizopita',
      chart_logins:   'Kuingia',
      chart_regs:     'Usajili',
      chart_updates:  'Mabadiliko',

      /* Profile card */
      card_my_info:   'Taarifa Zangu',
      card_activity:  'Shughuli za Hivi Karibuni',
      field_email:    'Barua Pepe',
      field_joined:   'Mwanachama Tangu',
      field_logins:   'Idadi ya Kuingia',
      field_last:     'Mara ya Mwisho',
      no_activity:    'Hakuna shughuli bado.',

      /* Profile page */
      pg_profile_title:    'Wasifu Wangu',
      pg_profile_sub:      'Sasisha taarifa zako za kibinafsi',
      sec_basic:           'Taarifa za Msingi',
      lbl_avatar:          'Picha ya Wasifu',
      hint_avatar:         'Bandika URL ya picha yako kutoka Google, LinkedIn, au tovuti nyingine',
      lbl_name:            'Jina Kamili',
      lbl_email:           'Barua Pepe',
      lbl_role:            'Jukumu',
      btn_save:            'Hifadhi Mabadiliko',
      btn_cancel:          'Ghairi',
      role_admin:          'Msimamizi',
      role_user:           'Mtumiaji',
      ph_name:             'Jina lako kamili',
      ph_email:            'barua@pepe.com',
      ph_avatar_url:       'Bandika URL ya picha (https://...)',

      /* Security page */
      pg_security_title:   'Usalama',
      pg_security_sub:     'Badilisha nywila yako ili kulinda akaunti',
      sec_change_pass:     'Badilisha Nywila',
      lbl_cur_pass:        'Nywila ya Sasa',
      lbl_new_pass:        'Nywila Mpya',
      lbl_confirm_pass:    'Thibitisha Nywila Mpya',
      btn_change_pass:     'Badilisha Nywila',
      ph_cur_pass:         'Weka nywila ya sasa',
      ph_new_pass:         'Angalau herufi 8',
      ph_confirm_pass:     'Rudia nywila mpya',
      sec_session:         'Kipindi cha Sasa',
      sess_status:         'Hali',
      sess_active:         'Unaendelea',
      sess_logged_in:      'Umeingia',
      sess_expires:        'Inaisha',
      sess_remember:       'Kumbuka Mimi',
      sess_rem_yes:        'Ndiyo (Siku 30)',
      sess_rem_no:         'Hapana (Siku 1)',

      /* Settings page */
      pg_settings_title:   'Mipangilio',
      pg_settings_sub:     'Dhibiti mapendeleo ya mfumo wako',
      sec_appearance:      'Mwonekano',
      setting_dark:        'Hali ya Giza',
      setting_dark_desc:   'Badilisha rangi ya mfumo hadi giza',
      sec_notifs:          'Arifa',
      setting_notif:       'Arifa za Mfumo',
      setting_notif_desc:  'Pokea arifa za shughuli za akaunti',
      sec_language:        'Lugha',
      setting_lang:        'Lugha ya Mfumo',
      setting_lang_desc:   'Chagua lugha unayoipenda',
      sec_about:           'Kuhusu Mfumo',
      about_version:       'Toleo',
      about_storage:       'Hifadhi ya Data',

      /* Danger zone */
      sec_danger:          'Eneo la Hatari',
      danger_clear_title:  'Futa Data ya Shughuli',
      danger_clear_desc:   'Futa historia yote ya kuingia na matendo. Hii haiwezi kurejeshwa.',
      danger_clear_btn:    'Futa Historia',
      danger_logout_title: 'Toka Kwa Mara Moja',
      danger_logout_desc:  'Funga kikao cha sasa na utoke haraka bila uthibitisho.',
      danger_logout_btn:   'Toka Sasa',

      /* Users page */
      pg_users_title:      'Watumiaji',
      pg_users_sub:        'Orodha ya watumiaji wote waliojisajili kwenye mfumo',
      users_search_ph:     'Tafuta kwa jina au barua pepe...',
      users_loading:       'Inapakia...',
      users_count:         'Watumiaji',
      users_of:            'kati ya',
      col_user:            'Mtumiaji',
      col_email:           'Barua Pepe',
      col_role:            'Jukumu',
      col_status:          'Hali',
      col_joined:          'Alijiunga',
      col_last:            'Mara ya Mwisho',
      badge_admin:         'Msimamizi',
      badge_user:          'Mtumiaji',
      badge_active:        'Amilifu',
      badge_offline:       'Nje ya Mtandao',
      badge_you:           'Mimi',
      users_empty_msg:     'Hakuna watumiaji wanaolingana na utafutaji wako.',
      users_count:         'Watumiaji {n} kati ya {total}',
      users_table_actions: 'Vitendo',
      sess_status_active:  'Unaendelea',
      action_activate:     'Wezesha',
      action_deactivate:   'Zima',
      action_delete:       'Futa',
      confirm_delete_user: 'Una uhakika? Mtumiaji huyu atafutwa kabisa.',
      confirm_clear_activity: 'Una uhakika? Historia yote itafutwa na haiwezi kurejeshwa.',
      toast_user_activated:   'Mtumiaji amewezeshwa.',
      toast_user_deactivated: 'Mtumiaji amezimwa.',
      toast_user_deleted:     'Mtumiaji amefutwa.',
      toast_error:            'Hitilafu imetokea. Jaribu tena.',
      settings_storage_description: 'Firebase Firestore',

      /* Notifications */
      notif_title:         'Arifa',
      notif_clear:         'Futa Zote',
      notif_empty:         'Hakuna arifa leo.',

      /* HTML data-i18n aliases */
      profile_title:            'Taarifa Zangu',
      profile_subtitle:         'Sasisha taarifa zako za kibinafsi',
      profile_basic_info:       'Taarifa za Msingi',
      profile_avatar:           'Picha ya Wasifu',
      profile_name:             'Jina Kamili',
      profile_name_ar:          'Jina kwa Kiarabu (Hiari)',
      profile_role:             'Jukumu',
      profile_save:             'Hifadhi Mabadiliko',
      profile_cancel:           'Ghairi',
      profile_last_login:       'Mara ya Mwisho',
      profile_logins:           'Idadi ya Kuingia',
      profile_joined:           'Mwanachama Tangu',
      users_title:              'Watumiaji',
      users_subtitle:           'Orodha ya watumiaji wote waliojisajili kwenye mfumo',
      users_total:              'Inapakia...',
      users_table_user:         'Mtumiaji',
      users_table_email:        'Barua Pepe',
      users_table_role:         'Jukumu',
      users_table_status:       'Hali',
      users_table_joined:       'Alijiunga',
      users_table_last_login:   'Mara ya Mwisho',
      users_empty:              'Hakuna watumiaji wanaolingana na utafutaji wako.',
      activity_title:           'Shughuli za Hivi Karibuni',
      activity_empty:           'Hakuna shughuli bado.',
      security_title:           'Usalama wa Akaunti',
      security_subtitle:        'Badilisha nywila yako ili kulinda akaunti',
      security_change_password: 'Badilisha Nywila',
      security_current_password:'Nywila ya Sasa',
      security_new_password:    'Nywila Mpya',
      security_confirm_password:'Thibitisha Nywila Mpya',
      security_save_password:   'Badilisha Nywila',
      security_session_info:    'Kipindi cha Sasa',
      security_session_status:  'Hali',
      security_session_created: 'Umeingia',
      security_session_expires: 'Inaisha',
      security_session_remember:'Kumbuka Mimi',
      settings_title:           'Mipangilio',
      settings_subtitle:        'Dhibiti mapendeleo ya mfumo wako',
      settings_appearance:      'Muonekano',
      settings_dark_mode:       'Hali ya Giza (Dark Mode)',
      settings_dark_mode_description: 'Badilisha kati ya mwanga na giza',
      settings_notifications:   'Arifa za Mfumo',
      settings_notifications_description: 'Pokea arifa kuhusu shughuli za akaunti',
      settings_about:           'Kuhusu Mfumo',
      settings_version:         'Toleo',
      settings_version_description: 'AuthSystem v1.0.0',
      settings_storage:         'Hifadhi ya Data',
      settings_storage_description: 'LocalStorage (Browser)',
      settings_storage_status:  'Active',
      settings_danger_zone:     'Eneo la Hatari',
      settings_clear_activity:  'Futa Data ya Shughuli',
      settings_clear_activity_description: 'Futa historia yote ya kuingia na matendo.',
      settings_clear_activity_button: 'Futa Historia',
      settings_force_logout:    'Toka Kwa Mara Moja',
      settings_force_logout_description: 'Funga kikao cha sasa na utoke haraka.',
      settings_force_logout_button: 'Toka Sasa',

      /* Toasts */
      toast_profile_saved:      'Wasifu umehifadhiwa kwa mafanikio.',
      toast_pass_changed:       'Nywila imebadilishwa kwa mafanikio.',
      toast_activity_cleared:   'Historia ya shughuli imefutwa.',
      toast_dark_on:            'Hali ya giza imewashwa.',
      toast_dark_off:           'Hali ya mwanga imewashwa.',
      toast_notif_on:           'Arifa zimewashwa.',
      toast_notif_off:          'Arifa zimezimwa.',
      toast_name_min:           'Jina lazima liwe na angalau herufi 3.',
      toast_fill_all:           'Jaza sehemu zote tatu.',
      toast_cur_pass_wrong:     'Nywila ya sasa si sahihi.',
      toast_pass_min:           'Nywila mpya lazima iwe na herufi 8 au zaidi.',
      toast_pass_mismatch:      'Nywila mpya hazilingani — ziandike tena sawa.',
      toast_lang_sw:            'Lugha imebadilishwa: Kiswahili.',
      toast_lang_en:            'Language changed: English.',
      toast_lang_ar:            'Lugha imebadilishwa: Kiarabu.',
    },

    en: {
      /* Sidebar */
      nav_main:       'MAIN',
      nav_account:    'ACCOUNT',
      nav_overview:   'Overview',
      nav_users:      'Users',
      nav_profile:    'My Profile',
      nav_security:   'Security',
      nav_settings:   'Settings',
      nav_logout:     'Logout',

      /* Page titles */
      page_overview:  'Overview',
      page_users:     'Users',
      page_profile:   'My Profile',
      page_security:  'Security',
      page_settings:  'Settings',

      /* Greetings */
      greet_morning:  'Good morning',
      greet_afternoon:'Good afternoon',
      greet_evening:  'Good evening',
      greet_night:    'Good night',
      welcome_badge:  'Logged in today',

      /* Stats */
      stat_total:     'Total Users',
      stat_active:    'Active Users',
      stat_logins:    "Today's Logins",
      stat_new:       'New This Week',

      /* Chart */
      chart_title:    'Weekly Activity',
      chart_range:    'Last 7 days',
      chart_logins:   'Logins',
      chart_regs:     'Registrations',
      chart_updates:  'Updates',

      /* Profile card */
      card_my_info:   'My Information',
      card_activity:  'Recent Activity',
      field_email:    'Email',
      field_joined:   'Member Since',
      field_logins:   'Total Logins',
      field_last:     'Last Login',
      no_activity:    'No activity yet.',

      /* Profile page */
      pg_profile_title:    'My Profile',
      pg_profile_sub:      'Update your personal information',
      sec_basic:           'Basic Information',
      lbl_avatar:          'Profile Photo',
      hint_avatar:         'Paste your photo URL from Google, LinkedIn, or any website',
      lbl_name:            'Full Name',
      lbl_email:           'Email Address',
      lbl_role:            'Role',
      btn_save:            'Save Changes',
      btn_cancel:          'Cancel',
      role_admin:          'Administrator',
      role_user:           'User',
      ph_name:             'Your full name',
      ph_email:            'email@example.com',
      ph_avatar_url:       'Paste your photo URL (https://...)',

      /* Security page */
      pg_security_title:   'Security',
      pg_security_sub:     'Change your password to secure your account',
      sec_change_pass:     'Change Password',
      lbl_cur_pass:        'Current Password',
      lbl_new_pass:        'New Password',
      lbl_confirm_pass:    'Confirm New Password',
      btn_change_pass:     'Change Password',
      ph_cur_pass:         'Enter current password',
      ph_new_pass:         'At least 8 characters',
      ph_confirm_pass:     'Repeat new password',
      sec_session:         'Current Session',
      sess_status:         'Status',
      sess_active:         'Active',
      sess_logged_in:      'Logged In',
      sess_expires:        'Expires',
      sess_remember:       'Remember Me',
      sess_rem_yes:        'Yes (30 days)',
      sess_rem_no:         'No (1 day)',

      /* Settings page */
      pg_settings_title:   'Settings',
      pg_settings_sub:     'Manage your app preferences',
      sec_appearance:      'Appearance',
      setting_dark:        'Dark Mode',
      setting_dark_desc:   'Switch the app to a dark color scheme',
      sec_notifs:          'Notifications',
      setting_notif:       'System Notifications',
      setting_notif_desc:  'Receive notifications about account activity',
      sec_language:        'Language',
      setting_lang:        'System Language',
      setting_lang_desc:   'Choose your preferred language',
      sec_about:           'About',
      about_version:       'Version',
      about_storage:       'Data Storage',

      /* Danger zone */
      sec_danger:          'Danger Zone',
      danger_clear_title:  'Clear Activity Data',
      danger_clear_desc:   'Delete all login history and actions. This cannot be undone.',
      danger_clear_btn:    'Clear History',
      danger_logout_title: 'Force Logout',
      danger_logout_desc:  'Close the current session and logout immediately without confirmation.',
      danger_logout_btn:   'Logout Now',

      /* Users page */
      pg_users_title:      'Users',
      pg_users_sub:        'All users registered in the system',
      users_search_ph:     'Search by name or email...',
      users_loading:       'Loading...',
      users_count:         'Users',
      users_of:            'of',
      col_user:            'User',
      col_email:           'Email',
      col_role:            'Role',
      col_status:          'Status',
      col_joined:          'Joined',
      col_last:            'Last Seen',
      badge_admin:         'Admin',
      badge_user:          'User',
      badge_active:        'Active',
      badge_offline:       'Offline',
      badge_you:           'You',
      users_empty_msg:     'No users match your search.',
      users_count:         '{n} of {total} users',
      users_table_actions: 'Actions',
      sess_status_active:  'Active',
      action_activate:     'Activate',
      action_deactivate:   'Deactivate',
      action_delete:       'Delete',
      confirm_delete_user: 'Are you sure? This user will be permanently deleted.',
      confirm_clear_activity: 'Are you sure? All history will be deleted and cannot be recovered.',
      toast_user_activated:   'User has been activated.',
      toast_user_deactivated: 'User has been deactivated.',
      toast_user_deleted:     'User has been deleted.',
      toast_error:            'An error occurred. Please try again.',
      settings_storage_description: 'Firebase Firestore',

      /* Notifications */
      notif_title:         'Notifications',
      notif_clear:         'Clear All',
      notif_empty:         'No notifications today.',

      /* HTML data-i18n aliases */
      profile_title:            'My Information',
      profile_subtitle:         'Update your personal information',
      profile_basic_info:       'Basic Information',
      profile_avatar:           'Profile Photo',
      profile_name:             'Full Name',
      profile_name_ar:          'Arabic Name (Optional)',
      profile_role:             'Role',
      profile_save:             'Save Changes',
      profile_cancel:           'Cancel',
      profile_last_login:       'Last Login',
      profile_logins:           'Total Logins',
      profile_joined:           'Member Since',
      users_title:              'Users',
      users_subtitle:           'All users registered in the system',
      users_total:              'Loading...',
      users_table_user:         'User',
      users_table_email:        'Email',
      users_table_role:         'Role',
      users_table_status:       'Status',
      users_table_joined:       'Joined',
      users_table_last_login:   'Last Seen',
      users_empty:              'No users match your search.',
      activity_title:           'Recent Activity',
      activity_empty:           'No activity yet.',
      security_title:           'Account Security',
      security_subtitle:        'Change your password to protect your account',
      security_change_password: 'Change Password',
      security_current_password:'Current Password',
      security_new_password:    'New Password',
      security_confirm_password:'Confirm New Password',
      security_save_password:   'Change Password',
      security_session_info:    'Current Session',
      security_session_status:  'Status',
      security_session_created: 'Logged In',
      security_session_expires: 'Expires',
      security_session_remember:'Remember Me',
      settings_title:           'Settings',
      settings_subtitle:        'Manage your app preferences',
      settings_appearance:      'Appearance',
      settings_dark_mode:       'Dark Mode',
      settings_dark_mode_description: 'Switch between light and dark theme',
      settings_notifications:   'System Notifications',
      settings_notifications_description: 'Receive notifications about account activity',
      settings_about:           'About',
      settings_version:         'Version',
      settings_version_description: 'AuthSystem v1.0.0',
      settings_storage:         'Data Storage',
      settings_storage_description: 'LocalStorage (Browser)',
      settings_storage_status:  'Active',
      settings_danger_zone:     'Danger Zone',
      settings_clear_activity:  'Clear Activity Data',
      settings_clear_activity_description: 'Delete all login history and actions.',
      settings_clear_activity_button: 'Clear History',
      settings_force_logout:    'Force Logout',
      settings_force_logout_description: 'Close current session and logout immediately.',
      settings_force_logout_button: 'Logout Now',

      /* Toasts */
      toast_profile_saved:      'Profile saved successfully.',
      toast_pass_changed:       'Password changed successfully.',
      toast_activity_cleared:   'Activity history cleared.',
      toast_dark_on:            'Dark mode enabled.',
      toast_dark_off:           'Light mode enabled.',
      toast_notif_on:           'Notifications enabled.',
      toast_notif_off:          'Notifications disabled.',
      toast_name_min:           'Name must be at least 3 characters.',
      toast_fill_all:           'Please fill in all three fields.',
      toast_cur_pass_wrong:     'Current password is incorrect.',
      toast_pass_min:           'New password must be at least 8 characters.',
      toast_pass_mismatch:      'Passwords do not match — please re-enter.',
      toast_lang_sw:            'Lugha imebadilishwa: Kiswahili.',
      toast_lang_en:            'Language changed: English.',
      toast_lang_ar:            'Language changed: Arabic.',
    },

    ar: {
      /* Sidebar */
      nav_main:       'الرئيسية',
      nav_account:    'الحساب',
      nav_overview:   'نظرة عامة',
      nav_users:      'المستخدمون',
      nav_profile:    'ملفي الشخصي',
      nav_security:   'الأمان',
      nav_settings:   'الإعدادات',
      nav_logout:     'تسجيل الخروج',

      /* Page titles */
      page_overview:  'نظرة عامة',
      page_users:     'المستخدمون',
      page_profile:   'ملفي الشخصي',
      page_security:  'الأمان',
      page_settings:  'الإعدادات',

      /* Greetings */
      greet_morning:  'صباح الخير',
      greet_afternoon:'مساء الخير',
      greet_evening:  'مساء الخير',
      greet_night:    'تصبح على خير',
      welcome_badge:  'سجّلت الدخول اليوم',

      /* Stats */
      stat_total:     'إجمالي المستخدمين',
      stat_active:    'المستخدمون النشطون',
      stat_logins:    'تسجيلات اليوم',
      stat_new:       'جدد هذا الأسبوع',

      /* Chart */
      chart_title:    'النشاط الأسبوعي',
      chart_range:    'آخر 7 أيام',
      chart_logins:   'تسجيلات الدخول',
      chart_regs:     'التسجيلات',
      chart_updates:  'التحديثات',

      /* Profile card */
      card_my_info:   'معلوماتي',
      card_activity:  'النشاط الأخير',
      field_email:    'البريد الإلكتروني',
      field_joined:   'عضو منذ',
      field_logins:   'إجمالي تسجيلات الدخول',
      field_last:     'آخر دخول',
      no_activity:    'لا توجد أنشطة بعد.',

      /* Profile page */
      pg_profile_title:    'ملفي الشخصي',
      pg_profile_sub:      'تحديث بياناتك الشخصية',
      sec_basic:           'المعلومات الأساسية',
      lbl_avatar:          'صورة الملف الشخصي',
      hint_avatar:         'الصق رابط صورتك من Google أو LinkedIn',
      lbl_name:            'الاسم الكامل',
      lbl_email:           'البريد الإلكتروني',
      lbl_role:            'الدور',
      btn_save:            'حفظ التغييرات',
      btn_cancel:          'إلغاء',
      role_admin:          'مشرف',
      role_user:           'مستخدم',
      ph_name:             'اسمك الكامل',
      ph_email:            'email@example.com',
      ph_avatar_url:       'ألصق رابط صورتك (https://...)',

      /* Security page */
      pg_security_title:   'الأمان',
      pg_security_sub:     'غيّر كلمة المرور لحماية حسابك',
      sec_change_pass:     'تغيير كلمة المرور',
      lbl_cur_pass:        'كلمة المرور الحالية',
      lbl_new_pass:        'كلمة المرور الجديدة',
      lbl_confirm_pass:    'تأكيد كلمة المرور الجديدة',
      btn_change_pass:     'تغيير كلمة المرور',
      ph_cur_pass:         'أدخل كلمة المرور الحالية',
      ph_new_pass:         '8 أحرف على الأقل',
      ph_confirm_pass:     'أعد إدخال كلمة المرور الجديدة',
      sec_session:         'الجلسة الحالية',
      sess_status:         'الحالة',
      sess_active:         'نشطة',
      sess_logged_in:      'تسجيل الدخول',
      sess_expires:        'تنتهي',
      sess_remember:       'تذكرني',
      sess_rem_yes:        'نعم (30 يوماً)',
      sess_rem_no:         'لا (يوم واحد)',

      /* Settings page */
      pg_settings_title:   'الإعدادات',
      pg_settings_sub:     'إدارة تفضيلات التطبيق',
      sec_appearance:      'المظهر',
      setting_dark:        'الوضع الداكن',
      setting_dark_desc:   'التبديل بين الوضع الفاتح والداكن',
      sec_notifs:          'الإشعارات',
      setting_notif:       'إشعارات النظام',
      setting_notif_desc:  'تلقي إشعارات حول نشاط الحساب',
      sec_language:        'اللغة',
      setting_lang:        'لغة النظام',
      setting_lang_desc:   'اختر لغتك المفضلة',
      sec_about:           'حول',
      about_version:       'الإصدار',
      about_storage:       'تخزين البيانات',

      /* Danger zone */
      sec_danger:          'منطقة الخطر',
      danger_clear_title:  'مسح بيانات النشاط',
      danger_clear_desc:   'حذف جميع سجلات تسجيل الدخول. لا يمكن التراجع.',
      danger_clear_btn:    'مسح السجل',
      danger_logout_title: 'تسجيل الخروج الفوري',
      danger_logout_desc:  'إغلاق الجلسة وتسجيل الخروج فوراً.',
      danger_logout_btn:   'تسجيل الخروج الآن',

      /* Users page */
      pg_users_title:      'المستخدمون',
      pg_users_sub:        'جميع المستخدمين المسجلين في النظام',
      users_search_ph:     'البحث بالاسم أو البريد...',
      users_loading:       'جاري التحميل...',
      users_count:         'مستخدمون',
      users_of:            'من',
      col_user:            'المستخدم',
      col_email:           'البريد الإلكتروني',
      col_role:            'الدور',
      col_status:          'الحالة',
      col_joined:          'تاريخ الانضمام',
      col_last:            'آخر دخول',
      badge_admin:         'مشرف',
      badge_user:          'مستخدم',
      badge_active:        'نشط',
      badge_offline:       'غير متصل',
      badge_you:           'أنا',
      users_empty_msg:     'لا يوجد مستخدمون يطابقون بحثك.',
      users_count:         '{n} من أصل {total} مستخدم',
      users_table_actions: 'الإجراءات',
      sess_status_active:  'نشط',
      action_activate:     'تفعيل',
      action_deactivate:   'تعطيل',
      action_delete:       'حذف',
      confirm_delete_user: 'هل أنت متأكد؟ سيتم حذف هذا المستخدم نهائياً.',
      confirm_clear_activity: 'هل أنت متأكد؟ سيتم حذف جميع السجلات.',
      toast_user_activated:   'تم تفعيل المستخدم.',
      toast_user_deactivated: 'تم تعطيل المستخدم.',
      toast_user_deleted:     'تم حذف المستخدم.',
      toast_error:            'حدث خطأ. حاول مرة أخرى.',
      settings_storage_description: 'Firebase Firestore',

      /* Notifications */
      notif_title:         'الإشعارات',
      notif_clear:         'مسح الكل',
      notif_empty:         'لا توجد إشعارات اليوم.',

      /* HTML data-i18n aliases */
      profile_title:            'معلوماتي',
      profile_subtitle:         'تحديث بياناتك الشخصية',
      profile_basic_info:       'المعلومات الأساسية',
      profile_avatar:           'صورة الملف الشخصي',
      profile_name:             'الاسم الكامل',
      profile_name_ar:          'الاسم بالعربية',
      profile_role:             'الدور',
      profile_save:             'حفظ التغييرات',
      profile_cancel:           'إلغاء',
      profile_last_login:       'آخر دخول',
      profile_logins:           'إجمالي تسجيلات الدخول',
      profile_joined:           'عضو منذ',
      users_title:              'المستخدمون',
      users_subtitle:           'جميع المستخدمين المسجلين في النظام',
      users_total:              'جاري التحميل...',
      users_table_user:         'المستخدم',
      users_table_email:        'البريد الإلكتروني',
      users_table_role:         'الدور',
      users_table_status:       'الحالة',
      users_table_joined:       'تاريخ الانضمام',
      users_table_last_login:   'آخر دخول',
      users_empty:              'لا يوجد مستخدمون يطابقون بحثك.',
      activity_title:           'النشاط الأخير',
      activity_empty:           'لا توجد أنشطة بعد.',
      security_title:           'أمان الحساب',
      security_subtitle:        'غيّر كلمة المرور لحماية حسابك',
      security_change_password: 'تغيير كلمة المرور',
      security_current_password:'كلمة المرور الحالية',
      security_new_password:    'كلمة المرور الجديدة',
      security_confirm_password:'تأكيد كلمة المرور الجديدة',
      security_save_password:   'تغيير كلمة المرور',
      security_session_info:    'الجلسة الحالية',
      security_session_status:  'الحالة',
      security_session_created: 'تسجيل الدخول',
      security_session_expires: 'تنتهي',
      security_session_remember:'تذكرني',
      settings_title:           'الإعدادات',
      settings_subtitle:        'إدارة تفضيلات التطبيق',
      settings_appearance:      'المظهر',
      settings_dark_mode:       'الوضع الداكن',
      settings_dark_mode_description: 'التبديل بين الوضع الفاتح والداكن',
      settings_notifications:   'إشعارات النظام',
      settings_notifications_description: 'تلقي إشعارات حول نشاط الحساب',
      settings_about:           'حول',
      settings_version:         'الإصدار',
      settings_version_description: 'AuthSystem v1.0.0',
      settings_storage:         'تخزين البيانات',
      settings_storage_description: 'Firebase Firestore',
      settings_storage_status:  'نشط',
      settings_danger_zone:     'منطقة الخطر',
      settings_clear_activity:  'مسح بيانات النشاط',
      settings_clear_activity_description: 'حذف جميع سجلات تسجيل الدخول والإجراءات.',
      settings_clear_activity_button: 'مسح السجل',
      settings_force_logout:    'تسجيل الخروج الفوري',
      settings_force_logout_description: 'إغلاق الجلسة الحالية وتسجيل الخروج فوراً.',
      settings_force_logout_button: 'تسجيل الخروج الآن',

      /* Toasts */
      toast_profile_saved:      'تم حفظ الملف الشخصي بنجاح.',
      toast_pass_changed:       'تم تغيير كلمة المرور بنجاح.',
      toast_activity_cleared:   'تم مسح سجل النشاط.',
      toast_dark_on:            'تم تفعيل الوضع الداكن.',
      toast_dark_off:           'تم تفعيل الوضع الفاتح.',
      toast_notif_on:           'تم تفعيل الإشعارات.',
      toast_notif_off:          'تم تعطيل الإشعارات.',
      toast_name_min:           'يجب أن يكون الاسم 3 أحرف على الأقل.',
      toast_fill_all:           'يرجى تعبئة جميع الحقول الثلاثة.',
      toast_cur_pass_wrong:     'كلمة المرور الحالية غير صحيحة.',
      toast_pass_min:           'يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.',
      toast_pass_mismatch:      'كلمتا المرور غير متطابقتين — أعد الإدخال.',
      toast_lang_sw:            'تم تغيير اللغة: السواحيلية.',
      toast_lang_en:            'تم تغيير اللغة: الإنجليزية.',
      toast_lang_ar:            'تم تغيير اللغة: العربية.',
    },
  },

  /* ── Helpers ──────────────────────────────────────────── */
  t(key) {
    return (this.translations[this.current] || {})[key]
        || (this.translations['en']         || {})[key]
        || key;
  },

  init() {
    /* Use FB.Settings first (Firebase), fall back to DB.Settings (localStorage) */
    const lang =
      (typeof FB !== 'undefined' ? FB.Settings.get().language : null) ||
      (typeof DB !== 'undefined' ? DB.Settings.get().language : null) || 'en';
    this.current = this.translations[lang] ? lang : 'en';
    this.applyStatic();
    this._updateBtn();
  },

  setLang(lang) {
    if (!this.translations[lang]) return;
    this.current = lang;
    /* Persist — prefer Firebase, fallback to localStorage */
    if (typeof FB !== 'undefined') FB.Settings.set({ language: lang });
    else if (typeof DB !== 'undefined') DB.Settings.set({ language: lang });

    /* RTL support for Arabic */
    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);

    /* 1 — Static translations: run instantly (just textContent swaps) */
    this.applyStatic();
    this._updateBtn();

    /* Update current page topbar title */
    const activePage = document.querySelector('.page.active');
    if (activePage && typeof setText === 'function' && typeof _pageTitles === 'function') {
      const pageId = activePage.id.replace('page-', '');
      setText('pageTitle', _pageTitles()[pageId] || pageId);
    }

    /* 2 — Dynamic JS sections: next animation frame so UI feels instant */
    requestAnimationFrame(() => {
      if (typeof populateUserUI      === 'function') populateUserUI();
      if (typeof setWelcomeDate      === 'function') setWelcomeDate();
      if (typeof populateStats       === 'function') populateStats();
      if (typeof populateActivity    === 'function') populateActivity();
      if (typeof populateProfilePage === 'function') populateProfilePage();
      if (typeof populateSessionCard === 'function') populateSessionCard();
      if (typeof populateUsers       === 'function') populateUsers();

      /* 3 — Chart is heaviest — defer 80ms so page feels responsive first */
      setTimeout(() => {
        if (typeof drawWeeklyChart === 'function') drawWeeklyChart();
      }, 80);
    });
  },

  /* Apply translations to all data-i18n elements */
  applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key  = el.dataset.i18n;
      const text = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPh);
    });
  },

  _updateBtn() {
    const btn = document.getElementById('langBtn');
    if (!btn) return;

    const map = {
      en: { flag: '🇬🇧', lbl: 'EN', title: 'Badilisha lugha' },
      sw: { flag: '🇹🇿', lbl: 'SW', title: 'Change language' },
      ar: { flag: '🇸🇦', lbl: 'AR', title: 'Change language' },
    };
    const info = map[this.current] || map.en;

    btn.setAttribute('data-lang', this.current);
    btn.innerHTML = `<span class="lang-flag">${info.flag}</span><span class="lang-lbl">${info.lbl}</span><span class="lang-caret">▾</span>`;
    btn.title = info.title;

    /* Flash animation */
    btn.classList.remove('lang-switched');
    void btn.offsetWidth;
    btn.classList.add('lang-switched');
  },

  toggle() {
    /* 3-way cycle: en → sw → ar → en */
    const cycle = { en: 'sw', sw: 'ar', ar: 'en' };
    const next  = cycle[this.current] || 'en';
    this.setLang(next);
    const toastKey = next === 'sw' ? 'toast_lang_sw'
                   : next === 'ar' ? 'toast_lang_ar'
                   : 'toast_lang_en';
    if (typeof showToast === 'function') showToast(this.t(toastKey), 'info');
  },
};

/* Global shorthand */
function t(key) { return I18N.t(key); }

window.I18N = I18N;
window.t    = t;
