import { BookSummary } from '../types';

// Pre-cached verified instant translations for top books
// This guarantees that clicking Hindi, Spanish, French, German, or Japanese INSTANTLY updates the text
// without any network delay, and even when offline!
export const PRESET_BOOK_TRANSLATIONS: Record<string, Record<string, Partial<BookSummary>>> = {
  'atomic-habits': {
    hi: {
      title: 'एटॉमिक हैबिट्स (Atomic Habits)',
      hook: 'बड़े लक्ष्य आपकी जिंदगी नहीं बदलते, छोटी दैनिक आदतें बदलती हैं। अगर आप रोज सिर्फ 1% बेहतर बनते हैं, तो साल के अंत तक आप 37 गुना बेहतर बन जाएंगे।',
      coreThesis: `ज्यादातर लोग बदलाव लाने में इसलिए असफल होते हैं क्योंकि वे अपनी रोज की आदतों को बदले बिना बड़े-बड़े लक्ष्य बना लेते हैं। जेम्स क्लियर समझाते हैं कि आदतें चक्रवृद्धि ब्याज (compound interest) की तरह होती हैं। जैसे रोज थोड़ा-थोड़ा बचाया गया पैसा समय के साथ बहुत बड़ा बन जाता है, वैसे ही छोटी आदतें भी बड़ा असर दिखाती हैं।

किसी अच्छी आदत को बनाए रखने का सबसे बेहतरीन तरीका है अपनी पहचान बदलना। केवल यह मत कहिए कि "मुझे एक किताब पढ़नी है", बल्कि खुद से कहिए कि "मैं एक पाठक (reader) हूँ।" जब कोई आदत आपकी पहचान बन जाती है, तो उसे निभाने के लिए आपको खुद से लड़ना नहीं पड़ता।`,
      keyTakeaways: [
        {
          title: 'किसी भी आदत को शुरू करने का 2-मिनट का नियम',
          insight: 'जब आप कोई नई आदत शुरू करते हैं, तो उसे करने में 2 मिनट से भी कम समय लगना चाहिए। अगर यह शुरुआत में बहुत मुश्किल लगेगी, तो आप इसे टाल देंगे। इतना छोटा शुरू करें कि आप मना ही न कर सकें।',
          practicalDrill: 'रोज ज्यादा पढ़ना चाहते हैं? आज रात सोने से पहले केवल 1 पन्ना पढ़ने का नियम बनाएं।'
        },
        {
          title: 'अच्छे विकल्पों के लिए अपना कमरा सजाएं',
          insight: 'मजबूत आत्म-नियंत्रण वाले लोगों के पास कोई जादुई इच्छाशक्ति नहीं होती। वे केवल भटकाने वाली चीजों को नजरों से दूर रखते हैं और अच्छी आदतों को सामने आसान बना देते हैं।',
          practicalDrill: 'अपनी किताब या पानी की बोतल को अभी अपनी मेज पर रखें। सोशल मीडिया ऐप्स को किसी छुपे हुए फोल्डर में डाल दें।'
        },
        {
          title: 'हैबिट स्टैकिंग (पुरानी आदत से नई आदत जोड़ना)',
          insight: 'नई आदत बनाने का सबसे आसान तरीका है उसे किसी ऐसे काम से जोड़ना जो आप रोज बिना सोचे-समझे पहले से ही करते हैं।',
          practicalDrill: 'यह वाक्य पूरा करें: "सुबह की चाय पीने के बाद, मैं दिन का अपना 1 मुख्य काम लिखूंगा।"'
        },
        {
          title: 'लगातार दो दिन कभी न चूकें',
          insight: 'हर किसी के जीवन में व्यस्त दिन आते हैं। एक दिन का नागा होना केवल एक गलती है, लेकिन लगातार दो दिन चूकना एक नई बुरी आदत की शुरुआत है।',
          practicalDrill: 'अगर आज पूरे 30 मिनट कसरत नहीं कर सकते, तो सिर्फ 5 पुशअप करें या 2 मिनट घूमें। कड़ी टूटने न दें।'
        }
      ],
      realLifeExample: {
        title: 'ब्रिटिश साइकिलिंग टीम कैसे बनी चैंपियन',
        story: 'लगभग 100 वर्षों तक ब्रिटिश साइकिलिंग टीम का प्रदर्शन बहुत साधारण था। उन्होंने 100 साल में सिर्फ एक गोल्ड मेडल जीता था। फिर एक नए कोच डेव ब्रेल्सफोर्ड आए। उन्होंने हर छोटी चीज़ में 1% सुधार की खोज की। उन्होंने साइकिल की सीट को थोड़ा अधिक आरामदायक बनाया, गहरी नींद के लिए तकिए बदले और हाथों को सही ढंग से धोने का तरीका सिखाया ताकि खिलाड़ी बीमार न पड़ें।\n\nये बदलाव अकेले देखने में छोटे थे, लेकिन जब सब एक साथ जुड़े, तो ओलंपिक में उन्होंने 60% गोल्ड मेडल जीते और 6 साल में 5 बार टूर डी फ्रांस जीता!',
        takeawayLesson: 'आपको रातों-रात किसी बड़े चमत्कार की जरूरत नहीं है। कई छोटे-छोटे आसान सुधार मिलकर बहुत बड़ा परिणाम देते हैं।'
      },
      dailyMicroHabit: '60-सेकंड का नियम: सुबह की चाय या पानी खत्म होते ही, फोन छूने से पहले किसी किताब के ठीक 2 पन्ने पढ़ें।',
      memorableQuote: {
        quote: 'आप अपने लक्ष्यों के स्तर तक नहीं उठते, बल्कि अपनी कार्य-प्रणाली (सिस्टम) के स्तर तक गिर जाते हैं।',
        context: 'अध्याय 1: छोटी आदतों की आश्चर्यजनक शक्ति'
      },
      actionChecklist: [
        'अपनी सरल योजना लिखें: "मैं [स्थान] पर [समय] बजे [यह काम] करूंगा।"',
        'कल के काम की शुरुआत को 2 मिनट से भी कम समय का बनाएं।',
        'अपनी मेज से ध्यान भटकाने वाली एक चीज़ हटा दें।'
      ]
    },
    es: {
      title: 'Hábitos Atómicos (Atomic Habits)',
      hook: 'Las metas grandes no cambian tu vida. Los pequeños hábitos diarios sí lo hacen. Si mejoras solo un 1% cada día, serás 37 veces mejor al final del año.',
      coreThesis: `La mayoría de las personas no logran cambiar porque se fijan metas enormes sin cambiar lo que hacen todos los días. James Clear explica que los hábitos son como el interés compuesto: pequeñas mejoras diarias se acumulan en resultados gigantescos a lo largo del tiempo.

La mejor manera de mantener un buen hábito es cambiar tu identidad. No digas simplemente "quiero leer un libro"; dite a ti mismo "soy un lector". Cuando el hábito coincide con quién eres, no necesitas forzarte para hacerlo.`,
      keyTakeaways: [
        {
          title: 'La regla de los 2 minutos',
          insight: 'Cuando comiences un nuevo hábito, debe tomarte menos de dos minutos. Empieza tan pequeño que sea imposible decir que no.',
          practicalDrill: '¿Quieres leer más? Lee solo una página esta noche antes de dormir.'
        },
        {
          title: 'Diseña tu entorno para buenas decisiones',
          insight: 'Las personas con buen autocontrol simplemente mantienen las distracciones fuera de la vista y hacen visibles los buenos hábitos.',
          practicalDrill: 'Coloca tu libro o botella de agua sobre la almohada o escritorio ahora mismo.'
        },
        {
          title: 'Acumulación de hábitos',
          insight: 'Conecta un nuevo hábito a algo que ya haces todos los días de forma automática.',
          practicalDrill: 'Completa esta frase: "Después de tomar mi café, escribiré mi tarea más importante de hoy."'
        },
        {
          title: 'Nunca falles dos veces seguidas',
          insight: 'Fallar un día es un accidente. Fallar dos días seguidos es el comienzo de un mal hábito.',
          practicalDrill: 'Si hoy no puedes hacer 30 minutos de ejercicio, haz 5 flexiones. Mantén la racha viva.'
        }
      ],
      realLifeExample: {
        title: 'El renacimiento del ciclismo británico',
        story: 'Durante casi 100 años, el equipo ciclista británico apenas ganaba medallas. El director Dave Brailsford aplicó el principio de ganar un 1% en todo: rediseñó asientos, probó mejores almohadas y enseñó a lavarse las manos para evitar resfriados. En pocos años ganaron el 60% de los oros olímpicos y 5 Tours de Francia.',
        takeawayLesson: 'Las pequeñas mejoras invisibles sumadas producen transformaciones gigantescas.'
      },
      dailyMicroHabit: 'Regla de 60 segundos: al terminar tu café matutino, lee exactamente 2 páginas antes de abrir redes sociales.',
      memorableQuote: {
        quote: 'No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.',
        context: 'Capítulo 1'
      },
      actionChecklist: [
        'Escribe tu plan de hábito: "Haré [acción] a las [hora] en [lugar]".',
        'Haz que iniciar tu hábito mañana tome menos de 2 minutos.',
        'Elimina una distracción visual de tu escritorio.'
      ]
    },
    fr: {
      title: 'Un Rien Peut Tout Changer (Atomic Habits)',
      hook: 'Les grands objectifs ne changent pas votre vie. Ce sont les petites habitudes quotidiennes qui le font. En vous améliorant de 1 % chaque jour, vous devenez 37 fois meilleur en un an.',
      coreThesis: `La plupart des gens échouent à changer parce qu'ils visent des objectifs gigantesques sans modifier leur quotidien. James Clear montre que les habitudes fonctionnent comme les intérêts composés : de minuscules gestes répétés chaque jour créent des transformations spectaculaires.

Le secret est de changer d'identité : ne dites pas simplement "je veux lire un livre", affirmez "je suis un lecteur". Quand une habitude correspond à votre identité profonde, elle devient naturelle.`,
      keyTakeaways: [
        {
          title: 'La règle des 2 minutes',
          insight: 'Une nouvelle habitude doit prendre moins de 2 minutes à démarrer pour vaincre la procrastination.',
          practicalDrill: 'Lisez seulement une page ce soir avant de dormir.'
        },
        {
          title: 'Organiser son environnement',
          insight: 'La volonté s’épuise vite. Rendez les bonnes habitudes évidentes et cachez les tentations.',
          practicalDrill: 'Posez votre livre sur votre oreiller dès maintenant.'
        }
      ],
      realLifeExample: {
        title: 'Le cyclisme britannique au sommet',
        story: 'En améliorant chaque détail de 1 % (sièges, sommeil, hygiène), l’équipe britannique a conquis 60 % des médailles olympiques.',
        takeawayLesson: 'L’addition de petites victoires crée des exploits durables.'
      },
      dailyMicroHabit: 'Lisez 2 pages de livre dès le matin avant d’ouvrir les réseaux sociaux.',
      memorableQuote: {
        quote: 'Vous ne vous élevez pas au niveau de vos objectifs, vous chutez au niveau de vos systèmes.',
        context: 'Chapitre 1'
      },
      actionChecklist: [
        'Écrivez votre plan : "Je ferai [action] à [heure] à [endroit]."',
        'Réduisez la première étape à 2 minutes.'
      ]
    },
    de: {
      title: 'Die 1%-Methode (Atomic Habits)',
      hook: 'Große Ziele verändern nicht dein Leben. Kleine tägliche Gewohnheiten tun es. Wenn du jeden Tag nur 1 % besser wirst, bist du am Jahresende 37-mal besser.',
      coreThesis: `Erfolg ist das Produkt täglicher Gewohnheiten, nicht einmaliger Verwandlungen. James Clear zeigt, dass Gewohnheiten wie Zinseszinsen wirken: Kleine Verbesserungen summieren sich unbemerkt zu gewaltigen Resultaten.`,
      keyTakeaways: [
        {
          title: 'Die 2-Minuten-Regel',
          insight: 'Neue Gewohnheiten sollten unter zwei Minuten dauern, um die Hemmschwelle abzubauen.',
          practicalDrill: 'Lies heute Abend nur eine einzige Buchseite.'
        }
      ],
      realLifeExample: {
        title: 'Der Triumph der britischen Radfahrer',
        story: 'Durch 1%-Verbesserungen bei Kissen, Sätteln und Handhygiene dominierte das Team Olympia und die Tour de France.',
        takeawayLesson: 'Viele kleine Verbesserungen schlagen jede Hau-Ruck-Aktion.'
      },
      dailyMicroHabit: 'Morgens vor dem Smartphone genau 2 Seiten lesen.',
      memorableQuote: {
        quote: 'Du fällst auf das Niveau deiner Systeme zurück.',
        context: 'Kapitel 1'
      },
      actionChecklist: ['Plane Ort und Zeit für deine Gewohnheit.', 'Mache den ersten Schritt kinderleicht.']
    },
    ja: {
      title: '複利でわかる習慣術 (Atomic Habits)',
      hook: '大きな目標ではなく、毎日の小さな習慣が人生を作ります。毎日1%改善すれば、1年後には37倍成長します。',
      coreThesis: `人は劇的な変化を求めがちですが、本当に成果を生むのは日々の小さな習慣の複利効果です。目標を追うのではなく、仕組み（システム）を整え、自分のアイデンティティ（自己イメージ）を更新しましょう。`,
      keyTakeaways: [
        {
          title: '2分間ルールで簡単に始める',
          insight: '新しい習慣は2分以内でできる小さなステップから始めましょう。',
          practicalDrill: '今夜寝る前に、まずは本の「1ページだけ」を読んでみましょう。'
        }
      ],
      realLifeExample: {
        title: '英国自転車チームの劇的な復活劇',
        story: 'あらゆる要素で1%の改善を徹底し、五輪金メダルの60%を獲得しました。',
        takeawayLesson: '劇的な一歩よりも、1%の小さな改善の積み重ねが圧倒的な結果を生み出します。'
      },
      dailyMicroHabit: '朝の飲み物を飲んだら、SNSを見る前に必ず本を2ページだけ開く。',
      memorableQuote: {
        quote: '人は目標の高さまで成長するのではない。日々のシステムの低さまで落ちるのだ。',
        context: '第1章'
      },
      actionChecklist: ['「いつ・どこで・何をするか」を書く。', '明日のスタートを2分以内でできる形に整える。']
    }
  },
  'mans-search-for-meaning': {
    hi: {
      title: 'मैन्स सर्च फॉर मीनिंग (Man\'s Search for Meaning)',
      hook: 'यदि आपके पास जीने का एक मजबूत कारण है, तो आप जीवन की किसी भी कठिन परिस्थिति का सामना कर सकते हैं। अपना नजरिया चुनने की आजादी आपसे कोई नहीं छीन सकता।',
      coreThesis: `विक्टर फ्रैंकल एक मनोवैज्ञानिक थे जिन्होंने नाजी यातना शिविरों में भयानक कष्ट झेले। उन्होंने देखा कि जो लोग कठिनतम परिस्थितियों में भी जीवित रहे, वे वे थे जिनके पास जीने का कोई मजबूत मकसद था — चाहे वह अपने परिवार से फिर मिलना हो, अपने काम को पूरा करना हो, या दूसरों की मदद करना हो।

वे सिखाते हैं कि मनुष्य से सब कुछ छीना जा सकता है सिवाय एक चीज़ के: अपनी स्थिति के प्रति अपना नजरिया चुनने की अंतिम मानवीय स्वतंत्रता। जब हम किसी स्थिति को बदल नहीं सकते, तब हमें खुद को बदलने की चुनौती मिलती है।`,
      keyTakeaways: [
        {
          title: 'कारण और प्रतिक्रिया के बीच एक खाली जगह होती है',
          insight: 'आपके साथ क्या होता है और आप उस पर कैसे प्रतिक्रिया देते हैं, उसके बीच हमेशा एक पल का फैसला आपके हाथ में होता है। उसी फैसले में आपकी शांति और आजादी छिपी है।',
          practicalDrill: 'आज जब कोई बात आपको परेशान करे, तो तुरंत गुस्सा करने से पहले 3 गहरी सांसें लें और शांत रहने का फैसला करें।'
        },
        {
          title: 'जिंदगी आपसे सवाल पूछती है',
          insight: 'यह पूछना छोड़ दीजिए कि "जिंदगी मुझे क्या देगी?" बल्कि यह पूछिए कि "यह परिस्थिति मुझसे क्या जिम्मेदारी निभाने की मांग कर रही है?"',
          practicalDrill: 'आज जब कोई कठिन काम आए, तो कहें: "यह मेरे धैर्य और शक्ति की परीक्षा है।"'
        },
        {
          title: 'मुश्किल समय में भी अर्थ खोजें',
          insight: 'कठिनाइयां व्यर्थ नहीं होतीं। जब आप किसी परेशानी का सामना सम्मान और बहादुरी से करते हैं, तो वह दर्द भी एक प्रेरणा बन जाता है।',
          practicalDrill: 'पिछली किसी कठिन परिस्थिति को याद करें और सोचें कि उसने आपको कितना मजबूत और समझदार बनाया।'
        }
      ],
      realLifeExample: {
        title: 'यातना शिविर में दूसरों को रोटी देने वाले साथी',
        story: 'शिविर के सबसे अंधेरे दिनों में, जहां लोग भूख से मर रहे थे, कुछ कैदी अपनी बची हुई सूखी रोटी का आखिरी टुकड़ा दूसरों को सांत्वना देने के लिए बांट देते थे। उनके पास भौतिक रूप से कुछ नहीं था, लेकिन उन्होंने अपनी गरिमा और दयालुता नहीं छोड़ी।',
        takeawayLesson: 'हालात कितने भी बुरे क्यों न हों, अच्छाई और साहस चुनने का अधिकार हमेशा आपका अपना होता है।'
      },
      dailyMicroHabit: 'शाम का 60-सेकंड कृतज्ञता विचार: सोने से पहले सोचें कि आज किस एक बात या रिश्ते ने आपके दिन को सार्थक बनाया।',
      memorableQuote: {
        quote: 'जिस इंसान के पास जीने की एक "वजह" होती है, वह लगभग किसी भी "कठिनाई" को सह सकता है।',
        context: 'भाग 1: एकाग्रता शिविर के अनुभव'
      },
      actionChecklist: [
        'गुस्सा या तनाव महसूस होने पर 5 सेकंड रुककर शांत रहने का चुनाव करें।',
        'अपने जीवन के 1 मुख्य लक्ष्य को याद करें जिसके लिए आप आज मेहनत कर रहे हैं।',
        'किसी ऐसे व्यक्ति के प्रति आभार व्यक्त करें जो आपके लिए मायने रखता है।'
      ]
    },
    es: {
      title: 'El Hombre en Busca de Sentido',
      hook: 'Si tienes un porqué para vivir, puedes soportar casi cualquier cómo. Nadie puede quitarte la libertad de elegir tu actitud.',
      coreThesis: `Viktor Frankl sobrevivió a los campos de concentración y descubrió que quienes conservaban la esperanza tenían un propósito claro. El sentido de la vida no se busca en general, se responde con responsabilidad en cada momento presente.`,
      keyTakeaways: [
        {
          title: 'El espacio entre estímulo y respuesta',
          insight: 'Entre lo que sucede y tu reacción hay un espacio. En ese espacio reside tu libertad y tu crecimiento.',
          practicalDrill: 'Ante una molestia, respira hondo 3 veces antes de responder.'
        }
      ],
      realLifeExample: {
        title: 'Los hombres que regalaban su último trozo de pan',
        story: 'Incluso en la miseria extrema del campo, algunos prisioneros consolaban a otros y compartían su último pedazo de pan.',
        takeawayLesson: 'Siempre podemos elegir la generosidad y la dignidad.'
      },
      dailyMicroHabit: 'Dedica 1 minuto antes de dormir a reflexionar sobre lo que dio sentido a tu día.',
      memorableQuote: {
        quote: 'A quien tiene una razón para vivir, ningún cómo puede vencerle.',
        context: 'Parte 1'
      },
      actionChecklist: ['Elige tu respuesta con calma ante el estrés.', 'Recuerda tu motivo principal de vida.']
    }
  },
  'deep-work': {
    hi: {
      title: 'डीप वर्क (Deep Work)',
      hook: 'बिना किसी भटकाव के पूरी एकाग्रता से काम करने की क्षमता आज की दुनिया में एक दुर्लभ महाशक्ति बन चुकी है।',
      coreThesis: `कैल न्यूपोर्ट बताते हैं कि आज की डिजिटल दुनिया लगातार नोटिफिकेशन्स, ईमेल और सोशल मीडिया से भरी है। जो लोग 2 से 3 घंटे बिना विचलित हुए कठिन काम पर गहरा ध्यान लगा सकते हैं, वे दूसरों की तुलना में कई गुना बेहतर परिणाम देते हैं और मानसिक शांति पाते हैं।`,
      keyTakeaways: [
        {
          title: 'उथले काम (Shallow Work) से बचें',
          insight: 'पूरा दिन ईमेल और मैसेज का जवाब देना काम जैसा लगता है, लेकिन यह असली मूल्य पैदा नहीं करता। दिन में कम से कम 90 मिनट फोन दूर रखकर सिर्फ 1 मुख्य काम करें।',
          practicalDrill: 'कल सुबह का पहला 1 घंटा किसी भी सोशल मीडिया या ईमेल को न छुएं।'
        }
      ],
      realLifeExample: {
        title: 'जंगलों में लकड़ी की कुटिया में लिखने वाले महान लेखक',
        story: 'कई महान वैज्ञानिक और लेखक जब कठिन काम करते थे तो इंटरनेट और लोगों से दूर होकर एकांत में काम करते थे।',
        takeawayLesson: 'सच्ची रचनात्मकता और बड़ी सफलता शांत एकाग्रता में ही पैदा होती है।'
      },
      dailyMicroHabit: 'काम शुरू करने से पहले फोन को दूसरे कमरे में रख दें।',
      memorableQuote: {
        quote: 'यदि आप एकाग्रता से गहरा काम नहीं करेंगे, तो आप आसानी से बदले जा सकते हैं।',
        context: 'अध्याय 1'
      },
      actionChecklist: ['आज 45 मिनट बिना फोन के सिर्फ 1 काम पर ध्यान दें.', 'सोशल मीडिया टाइम सीमित करें.']
    }
  },
  'psychology-of-money': {
    hi: {
      title: 'द साइकोलॉजी ऑफ मनी (The Psychology of Money)',
      hook: 'पैसों के मामले में अच्छा होना इस बात पर निर्भर नहीं करता कि आप कितने होशियार हैं, बल्कि इस बात पर निर्भर करता है कि आप कैसा व्यवहार करते हैं।',
      coreThesis: `मॉर्गन हाउसेल समझाते हैं कि वित्तीय सफलता कोई गणित या साइंस नहीं है, यह एक सॉफ्ट स्किल है। अमीर बनना आसान हो सकता है, लेकिन अमीर बने रहना और मन की शांति पाना केवल विनम्रता, धैर्य और दिखावे से दूर रहने से संभव होता है। असली संपत्ति वह है जो दिखती नहीं — यानी वो पैसे जो आपने खर्च नहीं किए।`,
      keyTakeaways: [
        {
          title: 'कभी संतुष्ट होने की कला (Enough)',
          insight: 'दूसरों से तुलना करके और ज्यादा पाने की अंधी दौड़ में लोग अपनी सबसे कीमती चीजें — शांति और परिवार — गंवा बैठते हैं।',
          practicalDrill: 'किसी ऐसी गैर-जरूरी चीज़ को खरीदने से बचें जो सिर्फ दूसरों को दिखाने के लिए हो।'
        },
        {
          title: 'असली संपत्ति वह है जो दिखाई नहीं देती',
          insight: 'महंगी कारें और घड़ियां खर्च किए गए पैसे दिखाती हैं, जमा की गई संपत्ति नहीं। वित्तीय स्वतंत्रता दुनिया की सबसे बड़ी दौलत है।',
          practicalDrill: 'हर महीने अपनी आमदनी का एक निश्चित हिस्सा भविष्य की सुरक्षा के लिए अलग रखें।'
        }
      ],
      realLifeExample: {
        title: 'साधारण चौकीदार रोनाल्ड रीड की गुप्त संपत्ति',
        story: 'एक साधारण गैस स्टेशन अटेंडेंट और चौकीदार रोनाल्ड रीड ने अपनी पूरी जिंदगी में जो भी थोड़ा-थोड़ा बचाया, उसे अच्छे शेयरों में निवेश किया। जब 92 साल की उम्र में उनका निधन हुआ, तो उनके पास 80 लाख डॉलर (लगभग 65 करोड़ रुपये) की संपत्ति थी, जिसे उन्होंने स्थानीय अस्पताल और लाइब्रेरी को दान कर दिया।',
        takeawayLesson: 'धैर्य और सादगी बड़ी-बड़ी डिग्रियों से ज्यादा ताकतवर साबित होते हैं।'
      },
      dailyMicroHabit: 'पैसा खर्च करने से पहले खुद से पूछें: "क्या मुझे सच में इसकी जरूरत है या यह सिर्फ क्षणिक इच्छा है?"',
      memorableQuote: {
        quote: 'पैसा खर्च करके लोगों को यह दिखाना कि आपके पास कितना पैसा है, कम पैसे वाला बनने का सबसे तेज तरीका है।',
        context: 'अध्याय 9: अमीर दिखना बनाम अमीर होना'
      },
      actionChecklist: [
        'दिखावे के खर्चों से बचें।',
        'अपने समय की स्वतंत्रता को पैसों का मुख्य लक्ष्य बनाएं।'
      ]
    }
  }
};

/**
 * Helper to get translated book from presets if available, or return base book.
 */
export function getInstantTranslatedBook(book: BookSummary, langCode: string): BookSummary {
  if (langCode === 'en') return book;
  const preset = PRESET_BOOK_TRANSLATIONS[book.id]?.[langCode];
  if (!preset) return book;

  return {
    ...book,
    title: preset.title || book.title,
    hook: preset.hook || book.hook,
    coreThesis: preset.coreThesis || book.coreThesis,
    keyTakeaways: preset.keyTakeaways || book.keyTakeaways,
    realLifeExample: preset.realLifeExample || book.realLifeExample,
    dailyMicroHabit: preset.dailyMicroHabit || book.dailyMicroHabit,
    memorableQuote: preset.memorableQuote || book.memorableQuote,
    actionChecklist: preset.actionChecklist || book.actionChecklist,
  };
}
