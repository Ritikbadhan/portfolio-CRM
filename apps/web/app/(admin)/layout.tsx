export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          {/* Admin Sidebar and Header placeholders */}
          {children}
        </main>
      </body>
    </html>
  );
}
