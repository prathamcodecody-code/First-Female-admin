import "./globals.css";

export const metadata = {
  title: "Admin Panel | FirstFemale",
  description: "Admin Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
        {/* App wrapper */}
        
          {children}
        
      </body>
    </html>
  );
}
