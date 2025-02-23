import type { Config } from "tailwindcss";

const config = {
  // ダークモードはクラスベースで管理
  darkMode: ["class"],
  // Tailwind が適用される対象ファイル
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}", // 追加
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // グローバルなフォントファミリーの設定（Noto Sans JP を使用）
      fontFamily: {
        sans: ['"Noto Sans JP"', "sans-serif"],
      },
      // カスタムカラーの設定（指定のカラーコードを適用）
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#16a34a", // 指定されたカラーコード
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#3f3f46", // 指定されたカラーコード
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#b91c1c", // 指定されたカラーコード
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#a1a1aa", // 指定されたカラーコード
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // カスタムのボーダー半径設定
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // アコーディオン用のキーフレームアニメーション
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      // キーフレームを利用したアニメーションの定義
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // tailwindcss-animate プラグインの追加
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
