import "./globals.css";
import { Providers } from "./provider";

export const metadata = {
  title: "Story Bubbles",
  description: "Interactive storytelling for children",
  icons: {
    icon: '/logo/StoryBubbles_Icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
