import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign up / 註冊 — Flight Price Notifier" },
      { name: "description", content: "建立 Flight Price Notifier 帳號，開始追蹤機票降價。" },
      { property: "og:title", content: "Sign up / 註冊 — Flight Price Notifier" },
      { property: "og:description", content: "Create an account and start tracking fare drops." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
