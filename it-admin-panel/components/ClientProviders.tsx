"use client"

import type React from "react"
import { SWRConfig } from "swr"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n"
import { request } from "@/lib/api"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SWRConfig
        value={{
          fetcher: (key: string) => request(key),
          revalidateOnFocus: false,
          dedupingInterval: 5000,
          keepPreviousData: true,
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </SWRConfig>
    </I18nProvider>
  )
}

