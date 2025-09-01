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
