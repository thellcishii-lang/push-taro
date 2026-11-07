// app/mountain/layout.tsx
import Footer from '../components/Footer';
import '../lp.css'; // フッターのデザイン用

export default function MountainLayout({
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
