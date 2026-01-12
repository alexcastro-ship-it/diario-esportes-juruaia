export const metadata = {
  title: "Diário Digital do Esporte - Juruaia",
  description: "Sistema de gerenciamento do Departamento Municipal de Esportes"
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
