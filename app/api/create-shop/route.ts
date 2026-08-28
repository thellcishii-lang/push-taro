import { NextResponse } from 'next/server';
import { db, authAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await authAdmin.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch (err: any) {
    return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, referralCode } = body; // 👈 referralCode を受け取る

    const existing = await db.collection('shops').where('ownerUid', '==', uid).limit(1).get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      return NextResponse.json({ 
        success: true, 
        shopId: doc.id,
        exists: true,
        shop: doc.data()
      }, { status: 200 });
    }

    const shopName = name || '未設定の店舗';
    let referrerInfo = null;

    // 紹介コードが存在する場合、所有者（代理店またはProユーザー）を検索
    if (referralCode) {
      const referralQuery = await db.collection('referrals')
        .where('code', '==', referralCode.trim())
        .limit(1)
        .get();

      if (!referralQuery.empty) {
        const refDoc = referralQuery.docs[0].data();
        referrerInfo = {
          referrerId: refDoc.userId,
          referredByCode: referralCode.trim(),
          referrerType: refDoc.type, // 'agency' | 'pro'
          referrerEmail: refDoc.email,
        };
      }
    }

    const shopRef = db.collection('shops').doc();
    const shopData: any = {
      name: shopName,
      ownerUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      coupon: { enabled: false, title: '', description: '', discountRate: 0 },
      linkUrl: '',
      iconUrl: '',
    };

    // 紹介者が特定できた場合のみ店舗データに付与
    if (referrerInfo) {
      shopData.referrerId = referrerInfo.referrerId;
      shopData.referredByCode = referrerInfo.referredByCode;
      shopData.referrerType = referrerInfo.referrerType;
    }

    await shopRef.set(shopData);

    // 紹介者が存在する場合、ダッシュボード通知とメール通知を実行
    if (referrerInfo) {
      // 1. ダッシュボード通知（notifications）作成
      await db.collection('notifications').add({
        targetUserId: referrerInfo.referrerId,
        type: 'new_referral',
        shopId: shopRef.id,
        shopName: shopName,
        referralCode: referrerInfo.referredByCode,
        isRead: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      // 2. メール通知（外部メールAPIやNodemailer呼び出し用のフック）
      if (referrerInfo.referrerEmail) {
        try {
          // ※必要に応じてメール送信APIをここで実行します
          console.log(`[MAIL] Send notification to ${referrerInfo.referrerEmail}: ${shopName} registered with code ${referrerInfo.referredByCode}`);
        } catch (mailError) {
          console.error('[MAIL ERROR]', mailError);
        }
      }
    }

    return NextResponse.json({ success: true, shopId: shopRef.id, exists: false }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'サーバーエラー',
      detail: error.message 
    }, { status: 500 });
  }
}
