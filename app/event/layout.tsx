// app/event/layout.tsx
import Footer from '../components/Footer';
import '../lp.css'; // フッターのデザイン用

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
