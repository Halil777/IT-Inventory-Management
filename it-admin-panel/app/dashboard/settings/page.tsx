"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { createDeviceType, getDeviceReports } from "@/lib/api"
import { toast } from "sonner"

export default function SettingsPage() {
  const { t, setLang } = useI18n()
  const [apiUrl, setApiUrl] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState<string>("")

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("api_url") : null
      setApiUrl(stored || "")
    } catch {}
  }, [])

  const saveApiUrl = () => {
    try {
      if (apiUrl.trim()) {
        localStorage.setItem("api_url", apiUrl.trim())
        toast.success(t("settings.toast.api_saved"))
      } else {
        localStorage.removeItem("api_url")
        toast.success(t("settings.toast.api_reset"))
      }
    } catch (e) {
      console.error(e)
      toast.error(t("settings.toast.api_save_failed"))
    }
  }

  const testConnection = async () => {
    setConnectionStatus(t("settings.api.testing"))
    try {
      const data = await getDeviceReports()
      setConnectionStatus(`${t("settings.api.ok")} (${Array.isArray(data) ? data.length : "success"})`)
      toast.success(t("settings.toast.backend_ok"))
    } catch (e: any) {
      setConnectionStatus(`${t("settings.api.error")}: ${e?.message || "Failed"}`)
      toast.error(t("settings.toast.backend_fail"))
    }
  }

  const seedDeviceTypes = async () => {
    const defaults = ["Computer", "Monitor", "Printer", "Peripheral", "Plotter"]
    try {
      for (const name of defaults) {
        await createDeviceType({ name })
      }
      toast.success(t("settings.toast.seed_ok"))
    } catch (e) {
      console.error(e)
      toast.error(t("settings.toast.seed_fail"))
    }
  }

  const resetUIState = () => {
    try {
      localStorage.removeItem("api_url")
      localStorage.removeItem("lang")
      // Expire sidebar cookie
      document.cookie = "sidebar_state=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
      toast.success(t("settings.toast.ui_reset_ok"))
      setApiUrl("")
    } catch (e) {
      console.error(e)
      toast.error(t("settings.toast.ui_reset_fail"))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.general.title")}</CardTitle>
          <CardDescription>{t("settings.general.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("settings.general.language")}</span>
            <LanguageToggle />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("settings.general.theme")}</span>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.api.title")}</CardTitle>
          <CardDescription>{t("settings.api.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2 max-w-xl">
            <div className="space-y-1">
              <Label htmlFor="api_url">{t("settings.api.label")}</Label>
              <Input
                id="api_url"
                placeholder={t("settings.api.placeholder")}
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("settings.api.hint")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={saveApiUrl}>{t("settings.api.save")}</Button>
            <Button variant="outline" onClick={testConnection}>{t("settings.api.test")}</Button>
            <span className="text-sm text-muted-foreground">{connectionStatus}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.utils.title")}</CardTitle>
          <CardDescription>{t("settings.utils.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={seedDeviceTypes}>{t("settings.utils.seed_device_types")}</Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="destructive" onClick={resetUIState}>{t("settings.utils.reset_ui")}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
