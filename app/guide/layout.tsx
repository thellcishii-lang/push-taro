import Footer from '@/components/Footer';
import '../lp.css'; // フッターのデザイン用

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
