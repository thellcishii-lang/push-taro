'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import './contact.css';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: '導入のご相談',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '送信に失敗しました');
        setSending(false);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <nav className="c-nav">
        <div className="c-nav-inner">
          <BrandLogo />
          <Link href="/signup" className="c-nav-cta">今すぐ申し込む →</Link>
        </div>
      </nav>

      <main className="c-main">
        <div className="c-breadcrumb">
          <Link href="/">ホーム</Link>
          <span className="sep">/</span>
          <span className="current">お問い合わせ</span>
        </div>

        <div className="c-hero">
          <span className="c-badge">📩 Contact</span>
          <h1>お問い合わせ</h1>
          <p>
            導入のご相談、料金プラン、代理店プログラム、技術的なご質問など、<br />
            お気軽にお問い合わせください。
          </p>
        </div>

        <div className="c-content">

          {/* お急ぎの方 */}
          <div className="c-callout">
            <span className="c-callout-icon">💡</span>
            <div>
              <strong>お急ぎの方は、メールで直接ご連絡ください</strong>
              <p><a href="mailto:info@push-taro.com">info@push-taro.com</a></p>
            </div>
          </div>

          {/* フォーム */}
          {submitted ? (
            <div className="c-success">
              <div className="c-success-icon">✅</div>
              <h2>お問い合わせを受け付けました</h2>
              <p>
                内容を確認の上、<strong>2〜3営業日以内</strong>にご返信いたします。<br />
                しばらくお待ちくださいませ。
              </p>
              <Link href="/" className="c-success-btn">ホームに戻る</Link>
            </div>
          ) : (
            <form className="c-form" onSubmit={handleSubmit}>
              <h2>お問い合わせフォーム</h2>

              <div className="c-field">
                <label htmlFor="category">お問い合わせ種別 <span className="required">必須</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="導入のご相談">導入のご相談</option>
                  <option value="料金プランについて">料金プランについて</option>
                  <option value="代理店プログラムについて">代理店プログラムについて</option>
                  <option value="技術的なご質問">技術的なご質問</option>
                  <option value="取材・メディア">取材・メディア</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div className="c-field-row">
                <div className="c-field">
                  <label htmlFor="name">お名前 <span className="required">必須</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="山田 太郎"
                    required
                  />
                </div>

                <div className="c-field">
                  <label htmlFor="company">会社名・店舗名</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="株式会社サンプル / Patisserie Taro"
                  />
                </div>
              </div>

              <div className="c-field">
                <label htmlFor="email">メールアドレス <span className="required">必須</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="taro@example.com"
                  required
                />
              </div>

              <div className="c-field">
                <label htmlFor="message">お問い合わせ内容 <span className="required">必須</span></label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="ご質問・ご相談内容をご記入ください"
                  rows={6}
                  required
                />
              </div>

              <button type="submit" className="c-submit" disabled={sending}>
                {sending ? '送信中...' : '送信する'}
                {!sending && <i className="fas fa-arrow-right"></i>}
              </button>

              <p className="c-note">
                ※ 2〜3営業日以内にご返信いたします。<br />
                ※ 迷惑メールフォルダもご確認ください。
              </p>
            </form>
          )}

          {/* よくある質問 */}
          <div className="c-faq-link">
            <h3>よくあるご質問</h3>
            <p>お問い合わせ前に、こちらもご確認ください。</p>
            <Link href="/guide/faq" className="c-faq-btn">
              FAQ を見る →
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
