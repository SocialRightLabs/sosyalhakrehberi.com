export interface RoadmapStep {
  title: string;
  description: string;
}

export interface RoadmapDocument {
  category: string;
  items: string[];
}

export interface GuidanceRoadmap {
  title: string;
  caution: string;
  institution: string;
  steps: RoadmapStep[];
  documents: RoadmapDocument[];
}

export const ROADMAP_DATA: Record<string, GuidanceRoadmap> = {
  TR_HOME_CARE_ALLOWANCE: {
    title: 'Evde Bakım Maaşı Başvuru Yol Haritası',
    caution: 'Bu bilgiler ön değerlendirme amaçlıdır. Nihai karar ilgili kurum tarafından verilir.',
    institution: 'Aile ve Sosyal Hizmetler İl Müdürlüğü',
    steps: [
      {
        title: 'Evrak Hazırlığı',
        description: 'Kimlik, sağlık kurulu raporu ve gelir belgelerini temin edin.',
      },
      {
        title: 'Başvuru',
        description: 'İkamet ettiğiniz yerdeki Aile ve Sosyal Hizmetler İl Müdürlüğüne başvurun.',
      },
      {
        title: 'Yerinde İnceleme',
        description: 'Sosyal hizmet uzmanı hane ziyareti gerçekleştirir.',
      },
      {
        title: 'Sonuç Bildirimi',
        description: 'Başvuru sonucu yazılı olarak tarafınıza iletilir.',
      },
    ],
    documents: [
      {
        category: 'Kimlik Belgeleri',
        items: ['Nüfus cüzdanı fotokopisi', 'İkametgah belgesi'],
      },
      {
        category: 'Sağlık Belgeleri',
        items: ['Sağlık kurulu raporu (engel oranı %50 ve üzeri)', 'Güncel doktor raporu'],
      },
      {
        category: 'Gelir Belgeleri',
        items: ['SGK hizmet dökümü', 'Hane halkı gelir beyanı'],
      },
    ],
  },
  TR_GSS: {
    title: 'Genel Sağlık Sigortası Başvuru Yol Haritası',
    caution: 'Bu bilgiler ön değerlendirme amaçlıdır. Nihai karar ilgili kurum tarafından verilir.',
    institution: 'Sosyal Güvenlik Kurumu (SGK)',
    steps: [
      {
        title: 'Evrak Hazırlığı',
        description: 'Kimlik ve gelir belgelerinizi hazırlayın.',
      },
      {
        title: 'SGK Başvurusu',
        description: 'En yakın SGK İl/İlçe Müdürlüğüne başvurun veya e-Devlet üzerinden işlem yapın.',
      },
      {
        title: 'Gelir Tespiti',
        description: 'SGK tarafından gelir tespiti yapılır.',
      },
      {
        title: 'Aktivasyon',
        description: 'GSS primleriniz ödenir veya muafiyetiniz tanımlanır.',
      },
    ],
    documents: [
      {
        category: 'Kimlik Belgeleri',
        items: ['Nüfus cüzdanı', 'İkametgah belgesi'],
      },
      {
        category: 'Gelir Belgeleri',
        items: ['Vergi levhası veya muafiyet belgesi', 'SGK hizmet dökümü'],
      },
    ],
  },
  TR_OLD_AGE_PENSION: {
    title: '65 Yaş Aylığı Başvuru Yol Haritası',
    caution: 'Bu bilgiler ön değerlendirme amaçlıdır. Nihai karar ilgili kurum tarafından verilir.',
    institution: 'Aile ve Sosyal Hizmetler İl Müdürlüğü',
    steps: [
      {
        title: 'Yaş ve Gelir Kontrolü',
        description: '65 yaşını doldurduğunuzu ve gelir şartını karşıladığınızı doğrulayın.',
      },
      {
        title: 'Başvuru',
        description: 'İl Müdürlüğüne gerekli belgelerle başvurun.',
      },
      {
        title: 'İnceleme',
        description: 'Sosyal inceleme raporu hazırlanır.',
      },
      {
        title: 'Ödeme',
        description: 'Onaylanan aylık ödemeleri almaya başlarsınız.',
      },
    ],
    documents: [
      {
        category: 'Kimlik Belgeleri',
        items: ['Nüfus cüzdanı (65 yaş şartı)', 'İkametgah belgesi'],
      },
      {
        category: 'Gelir Belgeleri',
        items: ['Gelir beyanı', 'SGK hizmet dökümü'],
      },
    ],
  },
  TR_BIRTH_GRANT: {
    title: 'Doğum Yardımı Başvuru Yol Haritası',
    caution: 'Bu bilgiler ön değerlendirme amaçlıdır. Nihai karar ilgili kurum tarafından verilir.',
    institution: 'e-Devlet / Aile ve Sosyal Hizmetler Bakanlığı',
    steps: [
      {
        title: 'e-Devlet Başvurusu',
        description: 'e-Devlet üzerinden "Doğum Yardımı" uygulamasına girin.',
      },
      {
        title: 'Belge Yükleme',
        description: 'Doğum belgesi ve banka bilgilerini sisteme yükleyin.',
      },
      {
        title: 'Onay',
        description: 'Başvurunuz otomatik olarak değerlendirilir.',
      },
      {
        title: 'Ödeme',
        description: "Onaylanan yardım IBAN'ınıza aktarılır.",
      },
    ],
    documents: [
      {
        category: 'Kimlik Belgeleri',
        items: ['Anne/baba nüfus cüzdanı', 'Doğum belgesi veya hastane çıkış raporu'],
      },
      {
        category: 'Banka Bilgileri',
        items: ['IBAN numarası'],
      },
    ],
  },
  TR_DISABILITY_PENSION: {
    title: 'Engelli Maaşı Başvuru Yol Haritası',
    caution: 'Bu bilgiler ön değerlendirme amaçlıdır. Nihai karar ilgili kurum tarafından verilir.',
    institution: 'Aile ve Sosyal Hizmetler İl Müdürlüğü',
    steps: [
      {
        title: 'Rapor ve Gelir Belgeleri',
        description: 'Sağlık kurulu raporu ve gelir belgelerinizi hazırlayın.',
      },
      {
        title: 'Başvuru',
        description: 'İl Müdürlüğüne gerekli belgelerle başvurun.',
      },
      {
        title: 'Sosyal İnceleme',
        description: 'Hane ve belge incelemesi yapılır.',
      },
      {
        title: 'Sonuç',
        description: 'Karar yazılı olarak bildirilir.',
      },
    ],
    documents: [
      {
        category: 'Kimlik Belgeleri',
        items: ['Nüfus cüzdanı', 'İkametgah belgesi'],
      },
      {
        category: 'Sağlık Belgeleri',
        items: ['Sağlık kurulu raporu', 'Engellilik oranını gösteren belgeler'],
      },
      {
        category: 'Gelir Belgeleri',
        items: ['Hane gelir beyanı', 'SGK hizmet dökümü'],
      },
    ],
  },
};
