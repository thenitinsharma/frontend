import "./globals.css";

export const metadata = {
  title: "SukoonAI – Mental Health Support",
  description: "AI-powered mental health support chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
