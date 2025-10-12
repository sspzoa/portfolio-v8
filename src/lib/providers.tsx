"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "jotai"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
}
