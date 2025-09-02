"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Lang = "en" | "tr" | "tk" | "ru"
type Dict = Record<string, string>

const dictionaries: Record<Lang, Dict> = {
  en: {
    // App
    "app.name": "IT Admin Panel",
    "app.tagline": "Management System",

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

    // Consumables
    "consumables.title": "Consumables",
    "consumables.subtitle": "Manage consumable inventory and assignments",
    "consumables.add": "Add Consumable",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.subtitle": "View system notifications and alerts",

    // Reports
    "reports.title": "Reports",
    "reports.subtitle": "Inventory statistics and summaries",

    // Sidebar
    "sidebar.dashboard": "Dashboard",
    "sidebar.departments": "Departments",
    "sidebar.employees": "Employees",
    "sidebar.devices": "Devices",
    "sidebar.printers": "Printers & Cartridges",
    "sidebar.consumables": "Consumables",
    "sidebar.reports": "Reports",
    "sidebar.notifications": "Notifications",
    "sidebar.audit_logs": "Audit Logs",
    "sidebar.settings": "Settings",
    "sidebar.logout": "Logout",
  },
  tr: {
    // App
    "app.name": "BT Yönetim Paneli",
    "app.tagline": "Yönetim Sistemi",

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
    "devices.subtitle": "Bilgisayar, monitör, yazıcı ve diğer ekipmanları yönetin",
    "devices.add": "Cihaz Ekle",
    "devices.list_title": "Cihazlar",
    "devices.list_desc": "Kuruluşunuzun IT ekipmanlarını yönetin",
    "devices.search_placeholder": "Cihaz ara...",
    "devices.type": "Tür",
    "devices.status": "Durum",
    "devices.user": "Kullanıcı",

    "departments.title": "Departman Yönetimi",
    "departments.subtitle": "Departmanları ve kaynaklarını yönetin",
    "departments.add": "Departman Ekle",
    "departments.list_title": "Departmanlar",
    "departments.list_desc": "Departmanları yönetin",
    "departments.search_placeholder": "Departman ara...",

    "employees.title": "Çalışan Yönetimi",
    "employees.subtitle": "Çalışanları yönetin",
    "employees.add": "Çalışan Ekle",
    "employees.list_title": "Çalışanlar",
    "employees.list_desc": "Çalışanlarınızı yönetin",
    "employees.search_placeholder": "Çalışan ara...",
    "employees.role": "Rol",

    "printers.title": "Yazıcılar & Kartuşlar",
    "printers.subtitle": "Yazıcıları ve kartuş stoğunu yönetin",
    "printers.add": "Yazıcı Ekle",
    "printers.list_title": "Yazıcılar",
    "printers.list_desc": "Yazıcıları ve konumlarını yönetin",
    "printers.search_placeholder": "Yazıcı ara...",
    "printers.model": "Model",

    "consumables.title": "Sarf Malzemeleri",
    "consumables.subtitle": "Sarf malzemelerini ve atamaları yönetin",
    "consumables.add": "Sarf Ekle",

    "notifications.title": "Bildirimler",
    "notifications.subtitle": "Sistem bildirimlerini ve uyarıları görüntüle",

    "reports.title": "Raporlar",
    "reports.subtitle": "Envanter istatistikleri ve özetler",

    "sidebar.dashboard": "Kontrol Paneli",
    "sidebar.departments": "Departmanlar",
    "sidebar.employees": "Çalışanlar",
    "sidebar.devices": "Cihazlar",
    "sidebar.printers": "Yazıcılar & Kartuşlar",
    "sidebar.consumables": "Sarf Malzemeleri",
    "sidebar.reports": "Raporlar",
    "sidebar.notifications": "Bildirimler",
    "sidebar.audit_logs": "Denetim Kayıtları",
    "sidebar.settings": "Ayarlar",
    "sidebar.logout": "Çıkış",
  },
  tk: {
    // App
    "app.name": "IT Dolandyryş Paneli",
    "app.tagline": "Dolandyryş Ulgamy",

    "common.change_language": "Dili üýtget",
    "common.add": "Goş",
    "common.edit": "Redaktirle",
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
    "devices.subtitle": "Kompýuterleri, monitorlary, printerleri dolandyryň",
    "devices.add": "Enjam goş",
    "devices.list_title": "Enjamlar",
    "devices.list_desc": "IT enjamlaryny dolandyryň",
    "devices.search_placeholder": "Enjam gözle...",
    "devices.type": "Görnüşi",
    "devices.status": "Statusy",
    "devices.user": "Ulanyjy",

    "departments.title": "Bölüm Dolandyryşy",
    "departments.subtitle": "Bölümleri dolandyryň",
    "departments.add": "Bölüm goş",
    "departments.list_title": "Bölümler",
    "departments.list_desc": "Bölümleri dolandyryň",
    "departments.search_placeholder": "Bölüm gözle...",

    "employees.title": "Işçi Dolandyryşy",
    "employees.subtitle": "Işçileri dolandyryň",
    "employees.add": "Işçi goş",
    "employees.list_title": "Işçiler",
    "employees.list_desc": "Işçileri dolandyryň",
    "employees.search_placeholder": "Işçi gözle...",
    "employees.role": "Roly",

    "printers.title": "Printerler & Kartrijler",
    "printers.subtitle": "Printerleri we kartrijleri dolandyryň",
    "printers.add": "Printer goş",
    "printers.list_title": "Printerler",
    "printers.list_desc": "Printerleri dolandyryň",
    "printers.search_placeholder": "Printer gözle...",
    "printers.model": "Modeli",

    "consumables.title": "Sarf materiallary",
    "consumables.subtitle": "Sarf materiallaryny dolandyryň",
    "consumables.add": "Sarf goş",

    "notifications.title": "Bildirişler",
    "notifications.subtitle": "Sistem bildirişleri",

    "reports.title": "Hasabatlar",
    "reports.subtitle": "Statistikalar we gysgaça mazmun",

    "sidebar.dashboard": "Dolandyryş paneli",
    "sidebar.departments": "Bölümler",
    "sidebar.employees": "Işçiler",
    "sidebar.devices": "Enjamlar",
    "sidebar.printers": "Printerler & Kartrijler",
    "sidebar.consumables": "Sarf materiallary",
    "sidebar.reports": "Hasabatlar",
    "sidebar.notifications": "Bildirişler",
    "sidebar.audit_logs": "Audit žurnallary",
    "sidebar.settings": "Sazlamalar",
    "sidebar.logout": "Ulgamdan çyk",
  },
  ru: {
    // App
    "app.name": "Панель IT администратора",
    "app.tagline": "Система управления",

    "common.change_language": "Сменить язык",
    "common.add": "Добавить",
    "common.edit": "Изменить",
    "common.delete": "Удалить",
    "common.cancel": "Отмена",
    "common.actions": "Действия",
    "common.id": "ID",
    "common.department": "Отдел",
    "common.name": "Название",
    "common.export_to_excel": "Экспорт в Excel",
    "common.search": "Поиск",
    "common.view_details": "Подробнее",

    "devices.title": "Управление устройствами",
    "devices.subtitle": "Управляйте ПК, мониторами, принтерами и др.",
    "devices.add": "Добавить устройство",
    "devices.list_title": "Устройства",
    "devices.list_desc": "Управление IT‑оборудованием организации",
    "devices.search_placeholder": "Поиск устройств...",
    "devices.type": "Тип",
    "devices.status": "Статус",
    "devices.user": "Пользователь",

    "departments.title": "Управление отделами",
    "departments.subtitle": "Управляйте отделами и ресурсами",
    "departments.add": "Добавить отдел",
    "departments.list_title": "Отделы",
    "departments.list_desc": "Управление отделами",
    "departments.search_placeholder": "Поиск отделов...",

    "employees.title": "Управление сотрудниками",
    "employees.subtitle": "Управляйте сотрудниками",
    "employees.add": "Добавить сотрудника",
    "employees.list_title": "Сотрудники",
    "employees.list_desc": "Управление сотрудниками",
    "employees.search_placeholder": "Поиск сотрудников...",
    "employees.role": "Роль",

    "printers.title": "Принтеры и картриджи",
    "printers.subtitle": "Управление принтерами и картриджами",
    "printers.add": "Добавить принтер",
    "printers.list_title": "Принтеры",
    "printers.list_desc": "Управление принтерами",
    "printers.search_placeholder": "Поиск принтеров...",
    "printers.model": "Модель",

    "consumables.title": "Расходники",
    "consumables.subtitle": "Управление расходными материалами",
    "consumables.add": "Добавить расходник",

    "notifications.title": "Уведомления",
    "notifications.subtitle": "Системные уведомления и предупреждения",

    "reports.title": "Отчеты",
    "reports.subtitle": "Статистика и сводки",

    "sidebar.dashboard": "Панель управления",
    "sidebar.departments": "Отделы",
    "sidebar.employees": "Сотрудники",
    "sidebar.devices": "Устройства",
    "sidebar.printers": "Принтеры и картриджи",
    "sidebar.consumables": "Расходники",
    "sidebar.reports": "Отчеты",
    "sidebar.notifications": "Уведомления",
    "sidebar.audit_logs": "Журнал аудита",
    "sidebar.settings": "Настройки",
    "sidebar.logout": "Выход",
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

