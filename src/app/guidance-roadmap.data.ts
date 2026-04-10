export interface ActionStep {
  title: string;
  description: string;
}

export interface DocumentGroup {
  category: string;
  items: string[];
}

export interface GuidanceRoadmap {
  benefitType: string;
  title: string;
  institution: string;
  caution: string;
  steps: ActionStep[];
  documents: DocumentGroup[];
}

export const ROADMAP_DATA: Record<string, GuidanceRoadmap> = {
  'TR_HOME_CARE_ALLOWANCE': {
    benefitType: 'TR_HOME_CARE_ALLOWANCE',
    title: 'Evde Bakım Maaşı Başvuru Yol Haritası',
    institution: 'Aile ve Sosyal Hizmetler İl Müdürlüğü / SHM',
    caution: 'Bu ekran resmî karar vermez. Belgeleri toplamadan önce resmî kanallardan güncel listeyi mutlaka doğrulayın.',
    steps: [
      { title: 'Başvuru kanalını teyit edin', description: 'İlinizde veya ilçenizde hangi Sosyal Hizmet Merkezi\'nin başvuru aldığını öğrenin. Telefonla teyit etmek süreç kaybını önler.' },
      { title: 'Bakım ihtiyacını belgeleyin', description: 'Sağlık kurulu raporu ve bakım ihtiyacı tespiti belgelerini güncel hâliyle asıl veya e-imzalı olarak hazırlayın.' },
      { title: 'Hane gelirini dosyalayın', description: 'Hanede yaşayan kişi sayısı ve toplam hane gelirini (varsa maaş bordroları, diğer destek kayıtları) açıklayan belgeleri toplayın.' },
      { title: 'Başvuruyu iletin', description: 'İkamet durumunuz ve belgelerinizle birlikte ilgili merkeze şahsen başvurunuzu gerçekleştirin.' }
    ],
    documents: [
      { category: 'Kimlik ve İkamet', items: ['T.C. Kimlik Kartı fotokopisi', 'Güncel ikametgah belgesi (e-Devlet)'] },
      { category: 'Sağlık ve Bakım', items: ['Geçerli Sağlık Kurulu Raporu (Ağır Engelli / Tam Bağımlı ibareli)', 'Bakım veren kişinin kimlik bilgileri'] },
      { category: 'Gelir Bilgisi', items: ['Hanedeki 18 yaş üstü bireylerin gelir durumunu gösterir belgeler'] }
    ]
  },
  'TR_BIRTH_GRANT': {
    benefitType: 'TR_BIRTH_GRANT',
    title: 'Doğum Yardımı Başvuru Yol Haritası',
    institution: 'Aile ve Sosyal Hizmetler Bakanlığı (e-Devlet veya SHM)',
    caution: 'Ödeme takvimi ve kesin onay için kurum incelemesi esastır. Ekranda gördüğünüz uygunluk ön değerlendirme niteliğindedir.',
    steps: [
      { title: 'KPS Nüfus kaydını tamamlayın', description: 'Çocuğunuzun nüfus müdürlüğünde KPS (Kimlik Paylaşım Sistemi) kaydının yapıldığından ve kimliğinin çıkarıldığından emin olun.' },
      { title: 'Başvuru yöntemini seçin', description: 'Başvurunuzu e-Devlet üzerinden (Doğum Yardımı Başvurusu) veya şahsen Aile ve Sosyal Hizmetler İl Müdürlüklerine yapabilirsiniz.' },
      { title: 'Bilgilerinizi teyit edin', description: 'Başvuru sırasında canlı doğum bilgisi, çocuk sırası ve anne/baba vatandaşlık durumları otomatik sorgulanacaktır.' },
      { title: 'Ödeme takvimini izleyin', description: 'Onaylanan yardımlar genellikle başvuru sonrası PTT üzerinden anne adına yatırılmaktadır. e-Devlet üzerinden takibini yapabilirsiniz.' }
    ],
    documents: [
      { category: 'Zorunlu Kayıtlar', items: ['Çocuğun Nüfus Cüzdanı / T.C. Kimlik Kartı', 'Annenin Kimlik Belgesi'] },
      { category: 'Alternatif Kanallar', items: ['e-Devlet şifresi (Online başvuru için)', 'Şahsen başvuru için doldurulmuş Doğum Yardımı Başvuru Dilekçesi'] }
    ]
  }
};