"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Lang = "en" | "tr" | "tk" | "ru"

type Dict = Record<string, string>

const dictionaries: Record<Lang, Dict> = {
  en: {
    // Common
    "common.change_language": "Change language",
    "common.add": "Add",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.cancel": "Cancel",
    "common.actions": "Actions",
    "common.id": "ID",
    "common.department": "Department",
    "common.name": "Name",
    "common.export_to_excel": "Export to Excel",
    "common.search": "Search",
    "common.view_details": "View Details",

    // Devices
    "devices.title": "Device Management",
    "devices.subtitle": "Manage computers, monitors, printers, and other IT equipment",
    "devices.add": "Add Device",
    "devices.list_title": "Devices",
    "devices.list_desc": "Manage your organization's IT equipment",
    "devices.search_placeholder": "Search devices...",
    "devices.type": "Type",
    "devices.status": "Status",
    "devices.user": "User",

    // Departments
    "departments.title": "Department Management",
    "departments.subtitle": "Manage organizational departments and their resources",
    "departments.add": "Add Department",
    "departments.list_title": "Departments",
    "departments.list_desc": "Manage your organization's departments",
    "departments.search_placeholder": "Search departments...",

    // Employees
    "employees.title": "Employee Management",
    "employees.subtitle": "Manage your organization's employees",
    "employees.add": "Add Employee",
    "employees.list_title": "Employees",
    "employees.list_desc": "Manage your organization's employees",
    "employees.search_placeholder": "Search employees...",
    "employees.role": "Role",

    // Printers
    "printers.title": "Printers & Cartridges",
    "printers.subtitle": "Manage printers and cartridge inventory",
    "printers.add": "Add Printer",
    "printers.list_title": "Printers",
    "printers.list_desc": "Manage printers and their locations",
    "printers.search_placeholder": "Search printers...",
    "printers.model": "Model",

    // Auth - Login
    "auth.login.title": "IT Admin Panel",
    "auth.login.subtitle": "Sign in to access the management system",
    "auth.login.email": "Email",
    "auth.login.email_placeholder": "admin@company.com",
    "auth.login.password": "Password",
    "auth.login.password_placeholder": "Enter your password",
    "auth.login.forgot_password": "Forgot password?",
    "auth.login.invalid_credentials": "Invalid email or password",
    "auth.login.signin": "Sign In",
    "auth.login.signing_in": "Signing in...",
    "auth.login.no_account": "Don't have an account?",
    "auth.login.signup": "Sign up",

    // Auth - Register
    "auth.register.title": "Create Account",
    "auth.register.subtitle": "Register for IT Admin Panel access",
    "auth.register.first_name": "First Name",
    "auth.register.first_name_placeholder": "John",
    "auth.register.last_name": "Last Name",
    "auth.register.last_name_placeholder": "Doe",
    "auth.register.email": "Email",
    "auth.register.email_placeholder": "john.doe@company.com",
    "auth.register.role": "Role",
    "auth.register.select_role": "Select your role",
    "auth.register.role_admin": "Admin",
    "auth.register.role_moderator": "Moderator",
    "auth.register.role_viewer": "Viewer",
    "auth.register.department": "Department",
    "auth.register.department_placeholder": "IT Department",
    "auth.register.password": "Password",
    "auth.register.password_placeholder": "Create a strong password",
    "auth.register.confirm_password": "Confirm Password",
    "auth.register.confirm_password_placeholder": "Confirm your password",
    "auth.register.passwords_no_match": "Passwords do not match",
    "auth.register.error": "Failed to create account. Please try again.",
    "auth.register.success": "Account created successfully! Please check your email for verification.",
    "auth.register.create_account": "Create Account",
    "auth.register.creating_account": "Creating account...",
    "auth.register.have_account": "Already have an account?",
    "auth.register.signin": "Sign in",

    // Auth - Forgot Password
    "auth.forgot.title": "Reset Password",
    "auth.forgot.subtitle": "Enter your email to receive a password reset link",
    "auth.forgot.email": "Email Address",
    "auth.forgot.email_placeholder": "Enter your email address",
    "auth.forgot.sending": "Sending...",
    "auth.forgot.send": "Send Reset Link",
    "auth.forgot.success": "Password reset link has been sent to your email address.",
    "auth.forgot.error": "Failed to send reset email. Please try again.",
    "auth.forgot.back_to_login": "Back to login",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Welcome to the IT Admin Panel. Here's an overview of your system.",
    "dashboard.stats.total_devices": "Total Devices",
    "dashboard.stats.active_printers": "Active Printers",
    "dashboard.stats.employees": "Employees",
    "dashboard.stats.departments": "Departments",
    "dashboard.stats.consumables": "Consumables",
    "dashboard.stats.alerts": "Alerts",
    "dashboard.stats.from_last_month": "from last month",

    // Consumables
    "consumables.title": "Consumables",
    "consumables.subtitle": "Manage consumable inventory and assignments",
    "consumables.add": "Add Consumable",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.subtitle": "View system notifications and alerts",
    "notifications.low_cartridge_stock": "Low cartridge stock",
    "notifications.low_cartridge_stock_desc": "HP LaserJet cartridges running low",
    "notifications.device_needs_repair": "Device needs repair",
    "notifications.device_needs_repair_desc": "Printer PRT-001 requires maintenance",
    "notifications.new_employee_added": "New employee added",
    "notifications.new_employee_added_desc": "John Smith joined Marketing",

    // Reports
    "reports.title": "Reports",
    "reports.subtitle": "Inventory statistics and summaries",
  },
  tr: {
    "common.change_language": "Dili değiştir",
    "common.add": "Ekle",
    "common.edit": "Düzenle",
    "common.delete": "Sil",
    "common.cancel": "İptal",
    "common.actions": "İşlemler",
    "common.id": "ID",
    "common.department": "Departman",
    "common.name": "Ad",
    "common.export_to_excel": "Excel'e aktar",
    "common.search": "Ara",
    "common.view_details": "Detayları Gör",

    "devices.title": "Cihaz Yönetimi",
    "devices.subtitle": "Bilgisayarları, monitörleri, yazıcıları ve diğer IT ekipmanını yönetin",
    "devices.add": "Cihaz Ekle",
    "devices.list_title": "Cihazlar",
    "devices.list_desc": "Kuruluşunuzun IT ekipmanını yönetin",
    "devices.search_placeholder": "Cihaz ara...",
    "devices.type": "Tür",
    "devices.status": "Durum",
    "devices.user": "Kullanıcı",

    "departments.title": "Departman Yönetimi",
    "departments.subtitle": "Departmanları ve kaynaklarını yönetin",
    "departments.add": "Departman Ekle",
    "departments.list_title": "Departmanlar",
    "departments.list_desc": "Kuruluşunuzun departmanlarını yönetin",
    "departments.search_placeholder": "Departman ara...",

    "employees.title": "Çalışan Yönetimi",
    "employees.subtitle": "Çalışanları yönetin",
    "employees.add": "Çalışan Ekle",
    "employees.list_title": "Çalışanlar",
    "employees.list_desc": "Kuruluşunuzun çalışanlarını yönetin",
    "employees.search_placeholder": "Çalışan ara...",
    "employees.role": "Rol",

    "printers.title": "Yazıcılar ve Kartuşlar",
    "printers.subtitle": "Yazıcıları ve kartuş stoklarını yönetin",
    "printers.add": "Yazıcı Ekle",
    "printers.list_title": "Yazıcılar",
    "printers.list_desc": "Yazıcıları ve konumlarını yönetin",
    "printers.search_placeholder": "Yazıcı ara...",
    "printers.model": "Model",

    // Auth - Login
    "auth.login.title": "IT Yönetim Paneli",
    "auth.login.subtitle": "Yönetim sistemine erişmek için giriş yapın",
    "auth.login.email": "E-posta",
    "auth.login.email_placeholder": "admin@sirket.com",
    "auth.login.password": "Şifre",
    "auth.login.password_placeholder": "Şifrenizi girin",
    "auth.login.forgot_password": "Şifrenizi mi unuttunuz?",
    "auth.login.invalid_credentials": "Geçersiz e-posta veya şifre",
    "auth.login.signin": "Giriş Yap",
    "auth.login.signing_in": "Giriş yapılıyor...",
    "auth.login.no_account": "Hesabınız yok mu?",
    "auth.login.signup": "Kayıt ol",

    // Auth - Register
    "auth.register.title": "Hesap Oluştur",
    "auth.register.subtitle": "IT Yönetim Paneli'ne kayıt olun",
    "auth.register.first_name": "Ad",
    "auth.register.first_name_placeholder": "Ahmet",
    "auth.register.last_name": "Soyad",
    "auth.register.last_name_placeholder": "Yılmaz",
    "auth.register.email": "E-posta",
    "auth.register.email_placeholder": "ahmet.yilmaz@sirket.com",
    "auth.register.role": "Rol",
    "auth.register.select_role": "Rolünüzü seçin",
    "auth.register.role_admin": "Admin",
    "auth.register.role_moderator": "Moderatör",
    "auth.register.role_viewer": "İzleyici",
    "auth.register.department": "Departman",
    "auth.register.department_placeholder": "IT Departmanı",
    "auth.register.password": "Şifre",
    "auth.register.password_placeholder": "Güçlü bir şifre oluşturun",
    "auth.register.confirm_password": "Şifreyi Onayla",
    "auth.register.confirm_password_placeholder": "Şifrenizi onaylayın",
    "auth.register.passwords_no_match": "Şifreler eşleşmiyor",
    "auth.register.error": "Hesap oluşturulamadı. Lütfen tekrar deneyin.",
    "auth.register.success": "Hesap başarıyla oluşturuldu! Lütfen doğrulama için e-postanızı kontrol edin.",
    "auth.register.create_account": "Hesap Oluştur",
    "auth.register.creating_account": "Hesap oluşturuluyor...",
    "auth.register.have_account": "Zaten hesabınız var mı?",
    "auth.register.signin": "Giriş yap",

    // Auth - Forgot Password
    "auth.forgot.title": "Şifreyi Sıfırla",
    "auth.forgot.subtitle": "Şifre sıfırlama bağlantısı almak için e-postanızı girin",
    "auth.forgot.email": "E-posta Adresi",
    "auth.forgot.email_placeholder": "E-posta adresinizi girin",
    "auth.forgot.sending": "Gönderiliyor...",
    "auth.forgot.send": "Sıfırlama Bağlantısı Gönder",
    "auth.forgot.success": "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
    "auth.forgot.error": "Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.",
    "auth.forgot.back_to_login": "Girişe dön",

    // Dashboard
    "dashboard.title": "Kontrol Paneli",
    "dashboard.subtitle": "IT Yönetim Paneline hoş geldiniz. İşte sisteminizin genel görünümü.",
    "dashboard.stats.total_devices": "Toplam Cihaz",
    "dashboard.stats.active_printers": "Aktif Yazıcılar",
    "dashboard.stats.employees": "Çalışanlar",
    "dashboard.stats.departments": "Departmanlar",
    "dashboard.stats.consumables": "Sarf Malzemeleri",
    "dashboard.stats.alerts": "Uyarılar",
    "dashboard.stats.from_last_month": "geçen aydan",

    // Consumables
    "consumables.title": "Sarf Malzemeleri",
    "consumables.subtitle": "Sarf malzemeleri envanterini ve atamalarını yönetin",
    "consumables.add": "Sarf Malzemesi Ekle",

    // Notifications
    "notifications.title": "Bildirimler",
    "notifications.subtitle": "Sistem bildirimlerini ve uyarılarını görüntüle",
    "notifications.low_cartridge_stock": "Düşük kartuş stoğu",
    "notifications.low_cartridge_stock_desc": "HP LaserJet kartuşları tükeniyor",
    "notifications.device_needs_repair": "Cihaz onarım gerektiriyor",
    "notifications.device_needs_repair_desc": "PRT-001 yazıcısı bakım gerektiriyor",
    "notifications.new_employee_added": "Yeni çalışan eklendi",
    "notifications.new_employee_added_desc": "John Smith Pazarlama'ya katıldı",

    // Reports
    "reports.title": "Raporlar",
    "reports.subtitle": "Envanter istatistikleri ve özetleri",
  },
  tk: {
    "common.change_language": "Dili üýtget",
    "common.add": "Goş",
    "common.edit": "Düzet",
    "common.delete": "Poz",
    "common.cancel": "Elten",
    "common.actions": "Hereketler",
    "common.id": "ID",
    "common.department": "Bölüm",
    "common.name": "Ady",
    "common.export_to_excel": "Excel-e eksport et",
    "common.search": "Gözleg",
    "common.view_details": "Jikme-jik gör",

    "devices.title": "Enjam Dolandyryşy",
    "devices.subtitle": "Kompýuterleri, monitorlary, printerleri we beýleki enjamlary dolandyryň",
    "devices.add": "Enjam Goş",
    "devices.list_title": "Enjamlar",
    "devices.list_desc": "Guramaňyzyň IT enjamlaryny dolandyryň",
    "devices.search_placeholder": "Enjam gözle...",
    "devices.type": "Görnüşi",
    "devices.status": "Statusy",
    "devices.user": "Ulanjy",

    "departments.title": "Bölüm Dolandyryşy",
    "departments.subtitle": "Bölümleri we serişdeleri dolandyryň",
    "departments.add": "Bölüm Goş",
    "departments.list_title": "Bölümler",
    "departments.list_desc": "Guramaňyzyň bölümlerini dolandyryň",
    "departments.search_placeholder": "Bölüm gözle...",

    "employees.title": "Işgär Dolandyryşy",
    "employees.subtitle": "Işgärleri dolandyryň",
    "employees.add": "Işgär Goş",
    "employees.list_title": "Işgärler",
    "employees.list_desc": "Guramaňyzyň işgärlerini dolandyryň",
    "employees.search_placeholder": "Işgär gözle...",
    "employees.role": "Wezipäsi",

    "printers.title": "Printerler we Kartrişler",
    "printers.subtitle": "Printerleri we kartriş ammarlaryny dolandyryň",
    "printers.add": "Printer Goş",
    "printers.list_title": "Printerler",
    "printers.list_desc": "Printerleri we ýerleşişini dolandyryň",
    "printers.search_placeholder": "Printer gözle...",
    "printers.model": "Model",

    // Auth - Login
    "auth.login.title": "IT Dolandyryş Paneli",
    "auth.login.subtitle": "Ulgama girmek üçin ulgamdan peýdalanyň",
    "auth.login.email": "E-poçta",
    "auth.login.email_placeholder": "admin@kompaniya.com",
    "auth.login.password": "Parol",
    "auth.login.password_placeholder": "Parolyňyzy giriziň",
    "auth.login.forgot_password": "Paroly ýatdan çykardyňyzmy?",
    "auth.login.invalid_credentials": "Nädogry e-poçta ýa-da parol",
    "auth.login.signin": "Giriş et",
    "auth.login.signing_in": "Giriş edilýär...",
    "auth.login.no_account": "Hasabyňyz ýokmy?",
    "auth.login.signup": "Hasap aç",

    // Auth - Register
    "auth.register.title": "Hasap Döret",
    "auth.register.subtitle": "IT Dolandyryş Paneline ýazylyň",
    "auth.register.first_name": "Ady",
    "auth.register.first_name_placeholder": "Ahmet",
    "auth.register.last_name": "Familiýasy",
    "auth.register.last_name_placeholder": "Ahmedow",
    "auth.register.email": "E-poçta",
    "auth.register.email_placeholder": "ahmet.ahmedow@kompaniya.com",
    "auth.register.role": "Roly",
    "auth.register.select_role": "Rolyňyzy saýlaň",
    "auth.register.role_admin": "Admin",
    "auth.register.role_moderator": "Moderator",
    "auth.register.role_viewer": "Görüji",
    "auth.register.department": "Bölüm",
    "auth.register.department_placeholder": "IT Bölümi",
    "auth.register.password": "Parol",
    "auth.register.password_placeholder": "Kuvvatly parol dörediň",
    "auth.register.confirm_password": "Paroly Tassyklamak",
    "auth.register.confirm_password_placeholder": "Parolyňyzy tassyklaň",
    "auth.register.passwords_no_match": "Parollar gabat gelmeýär",
    "auth.register.error": "Hasap döretmek başa barmady. Täzeden synanyşyň.",
    "auth.register.success": "Hasap üstünlikli döredildi! Barlamak üçin e-poçtaňyzy barlaň.",
    "auth.register.create_account": "Hasap Döret",
    "auth.register.creating_account": "Hasap döredilýär...",
    "auth.register.have_account": "Öň hasabyňyz barmy?",
    "auth.register.signin": "Giriş et",

    // Auth - Forgot Password
    "auth.forgot.title": "Paroly Täzele",
    "auth.forgot.subtitle": "Paroly täzeden almak üçin e-poçtaňyzy giriziň",
    "auth.forgot.email": "E-poçta Adresi",
    "auth.forgot.email_placeholder": "E-poçtaňyzy giriziň",
    "auth.forgot.sending": "Ugradylýar...",
    "auth.forgot.send": "Täzeden Ugradylýan Baglanyşyk",
    "auth.forgot.success": "Paroly täzeden dikeltmek baglanyşygy e-poçtaňyza ugradyldy.",
    "auth.forgot.error": "Paroly täzeden ugratmak başa barmady. Täzeden synanyşyň.",
    "auth.forgot.back_to_login": "Girişe dolan",

    // Dashboard
    "dashboard.title": "Dolandyryş paneli",
    "dashboard.subtitle": "IT Dolandyryş Paneline hoş geldiňiz. Ine, siziň ulgamanyň gysgaça syny.",
    "dashboard.stats.total_devices": "Jemi enjam",
    "dashboard.stats.active_printers": "Işjeň printerler",
    "dashboard.stats.employees": "Işgärler",
    "dashboard.stats.departments": "Bölümler",
    "dashboard.stats.consumables": "Sarp edilýänler",
    "dashboard.stats.alerts": "Duýduryşlar",
    "dashboard.stats.from_last_month": "geçen aydan",

    // Consumables
    "consumables.title": "Sarp edilýänler",
    "consumables.subtitle": "Sarp edilýän önümleriň skladyny we berkidilişini dolandyryň",
    "consumables.add": "Sarp edilýäni goş",

    // Notifications
    "notifications.title": "Bildirişler",
    "notifications.subtitle": "Ulgam bildirişlerini we duýduryşlaryny gör",
    "notifications.low_cartridge_stock": "Kartriş stoogy pes",
    "notifications.low_cartridge_stock_desc": "HP LaserJet kartrişleri azalýar",
    "notifications.device_needs_repair": "Enjam abatlamaga mätäç",
    "notifications.device_needs_repair_desc": "PRT-001 printerine hyzmat gerek",
    "notifications.new_employee_added": "Täze işgär goşuldy",
    "notifications.new_employee_added_desc": "John Smith Marketinge goşuldy",

    // Reports
    "reports.title": "Hasabatlar",
    "reports.subtitle": "Envanter statistikasy we gysgaça mazmuny",
  },
  ru: {
    "common.change_language": "Сменить язык",
    "common.add": "Добавить",
    "common.edit": "Редактировать",
    "common.delete": "Удалить",
    "common.cancel": "Отмена",
    "common.actions": "Действия",
    "common.id": "ID",
    "common.department": "Отдел",
    "common.name": "Имя",
    "common.export_to_excel": "Экспорт в Excel",
    "common.search": "Поиск",
    "common.view_details": "Подробнее",

    "devices.title": "Управление устройствами",
    "devices.subtitle": "Управляйте компьютерами, мониторами, принтерами и другим оборудованием",
    "devices.add": "Добавить устройство",
    "devices.list_title": "Устройства",
    "devices.list_desc": "Управляйте ИТ-оборудованием организации",
    "devices.search_placeholder": "Поиск устройств...",
    "devices.type": "Тип",
    "devices.status": "Статус",
    "devices.user": "Пользователь",

    "departments.title": "Управление отделами",
    "departments.subtitle": "Управляйте отделами и их ресурсами",
    "departments.add": "Добавить отдел",
    "departments.list_title": "Отделы",
    "departments.list_desc": "Управляйте отделами вашей организации",
    "departments.search_placeholder": "Поиск отделов...",

    "employees.title": "Управление сотрудниками",
    "employees.subtitle": "Управляйте сотрудниками",
    "employees.add": "Добавить сотрудника",
    "employees.list_title": "Сотрудники",
    "employees.list_desc": "Управляйте сотрудниками вашей организации",
    "employees.search_placeholder": "Поиск сотрудников...",
    "employees.role": "Роль",

    "printers.title": "Принтеры и картриджи",
    "printers.subtitle": "Управляйте принтерами и запасами картриджей",
    "printers.add": "Добавить принтер",
    "printers.list_title": "Принтеры",
    "printers.list_desc": "Управляйте принтерами и их расположением",
    "printers.search_placeholder": "Поиск принтеров...",
    "printers.model": "Модель",

    // Auth - Login
    "auth.login.title": "IT Админ Панель",
    "auth.login.subtitle": "Войдите, чтобы получить доступ к системе управления",
    "auth.login.email": "Email",
    "auth.login.email_placeholder": "admin@company.com",
    "auth.login.password": "Пароль",
    "auth.login.password_placeholder": "Введите пароль",
    "auth.login.forgot_password": "Забыли пароль?",
    "auth.login.invalid_credentials": "Неверный email или пароль",
    "auth.login.signin": "Войти",
    "auth.login.signing_in": "Вход...",
    "auth.login.no_account": "Нет аккаунта?",
    "auth.login.signup": "Зарегистрироваться",

    // Auth - Register
    "auth.register.title": "Создать аккаунт",
    "auth.register.subtitle": "Зарегистрируйтесь для доступа к IT Админ Панели",
    "auth.register.first_name": "Имя",
    "auth.register.first_name_placeholder": "Иван",
    "auth.register.last_name": "Фамилия",
    "auth.register.last_name_placeholder": "Иванов",
    "auth.register.email": "Email",
    "auth.register.email_placeholder": "ivan.ivanov@company.com",
    "auth.register.role": "Роль",
    "auth.register.select_role": "Выберите вашу роль",
    "auth.register.role_admin": "Админ",
    "auth.register.role_moderator": "Модератор",
    "auth.register.role_viewer": "Наблюдатель",
    "auth.register.department": "Отдел",
    "auth.register.department_placeholder": "IT Отдел",
    "auth.register.password": "Пароль",
    "auth.register.password_placeholder": "Придумайте надежный пароль",
    "auth.register.confirm_password": "Подтвердите пароль",
    "auth.register.confirm_password_placeholder": "Подтвердите пароль",
    "auth.register.passwords_no_match": "Пароли не совпадают",
    "auth.register.error": "Не удалось создать аккаунт. Пожалуйста, попробуйте еще раз.",
    "auth.register.success": "Аккаунт успешно создан! Проверьте почту для подтверждения.",
    "auth.register.create_account": "Создать аккаунт",
    "auth.register.creating_account": "Создание аккаунта...",
    "auth.register.have_account": "Уже есть аккаунт?",
    "auth.register.signin": "Войти",

    // Auth - Forgot Password
    "auth.forgot.title": "Сброс пароля",
    "auth.forgot.subtitle": "Введите email, чтобы получить ссылку для сброса пароля",
    "auth.forgot.email": "Email адрес",
    "auth.forgot.email_placeholder": "Введите ваш email",
    "auth.forgot.sending": "Отправка...",
    "auth.forgot.send": "Отправить ссылку",
    "auth.forgot.success": "Ссылка для сброса пароля отправлена на ваш email.",
    "auth.forgot.error": "Не удалось отправить письмо. Пожалуйста, попробуйте еще раз.",
    "auth.forgot.back_to_login": "Назад к входу",

    // Dashboard
    "dashboard.title": "Панель управления",
    "dashboard.subtitle": "Добро пожаловать в IT панель администратора. Здесь обзор вашей системы.",
    "dashboard.stats.total_devices": "Всего устройств",
    "dashboard.stats.active_printers": "Активных принтеров",
    "dashboard.stats.employees": "Сотрудники",
    "dashboard.stats.departments": "Отделы",
    "dashboard.stats.consumables": "Расходники",
    "dashboard.stats.alerts": "Оповещения",
    "dashboard.stats.from_last_month": "с прошлого месяца",

    // Consumables
    "consumables.title": "Расходники",
    "consumables.subtitle": "Управляйте складом расходных материалов и их назначениями",
    "consumables.add": "Добавить расходник",

    // Notifications
    "notifications.title": "Уведомления",
    "notifications.subtitle": "Просмотр системных уведомлений и предупреждений",
    "notifications.low_cartridge_stock": "Низкий запас картриджей",
    "notifications.low_cartridge_stock_desc": "Картриджи HP LaserJet заканчиваются",
    "notifications.device_needs_repair": "Устройство требует ремонта",
    "notifications.device_needs_repair_desc": "Принтер PRT-001 нуждается в обслуживании",
    "notifications.new_employee_added": "Добавлен новый сотрудник",
    "notifications.new_employee_added_desc": "Джон Смит присоединился к маркетингу",

    // Reports
    "reports.title": "Отчеты",
    "reports.subtitle": "Статистика и сводки по инвентарю",
  },
}

type I18nContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as Lang) || "en"
    }
    return "en"
  })

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang)
    } catch {}
  }, [lang])

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en
    return (key: string) => dict[key] || dictionaries.en[key] || key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
