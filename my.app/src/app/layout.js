import AppProviders from "./AppProviders";
import "../index.css";
import "../App.css";

export const metadata = {
  title: "Verdant | Plantas y Deco",
  description:
    "Verdant, tienda de plantas y macetas para transformar tus espacios.",
  icons: {
    icon: "/Logo verdant .png",
    apple: "/Logo verdant .png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
