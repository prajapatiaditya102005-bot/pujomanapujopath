import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, AlertCircle, Database, BookOpen, ExternalLink } from 'lucide-react';

export default function GuideDownloadsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('north');

  if (!isOpen) return null;

  const downloadFile = (filename, url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1b0b11] border-2 border-festive-gold/60 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-festive-ruby via-festive-crimson to-festive-maroon border-b border-festive-gold/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-black/30 border border-festive-gold/40 text-festive-gold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                Translated English Source Guides &amp; Open Datasets
              </h2>
              <p className="text-xs text-festive-sand/90 font-medium">
                Official Bengali Guides Translated to English • Complete Public Transport Records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-festive-sand hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Direct Downloads Bar */}
        <div className="p-4 bg-[#14080c] border-b border-festive-gold/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('north')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'north'
                  ? 'bg-red-700 text-white border border-festive-gold shadow'
                  : 'bg-[#1e0d14] text-festive-sand hover:bg-festive-ruby/30'
              }`}
            >
              North Kolkata Guide
            </button>
            <button
              onClick={() => setActiveTab('south')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'south'
                  ? 'bg-pink-700 text-white border border-festive-gold shadow'
                  : 'bg-[#1e0d14] text-festive-sand hover:bg-festive-ruby/30'
              }`}
            >
              South Kolkata Guide
            </button>
            <button
              onClick={() => setActiveTab('central')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'central'
                  ? 'bg-amber-600 text-black border border-festive-gold shadow'
                  : 'bg-[#1e0d14] text-festive-sand hover:bg-festive-ruby/30'
              }`}
            >
              Central Kolkata Guide
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'summary'
                  ? 'bg-festive-gold text-black border border-festive-gold shadow'
                  : 'bg-[#1e0d14] text-festive-sand hover:bg-festive-ruby/30'
              }`}
            >
              Data Verification Summary
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-festive-cream/60 text-[11px] hidden sm:inline">Direct Downloads:</span>
            <button
              onClick={() => downloadFile('north_kolkata_pandals.json', '/data/north_kolkata_pandals.json')}
              className="px-2.5 py-1 bg-black/40 hover:bg-black/80 text-festive-gold border border-festive-gold/30 rounded-lg text-[11px] font-mono flex items-center space-x-1"
            >
              <Database className="w-3 h-3" />
              <span>North JSON</span>
            </button>
            <button
              onClick={() => downloadFile('south_kolkata_pandals.json', '/data/south_kolkata_pandals.json')}
              className="px-2.5 py-1 bg-black/40 hover:bg-black/80 text-festive-gold border border-festive-gold/30 rounded-lg text-[11px] font-mono flex items-center space-x-1"
            >
              <Database className="w-3 h-3" />
              <span>South JSON</span>
            </button>
            <button
              onClick={() => downloadFile('central_kolkata_pandals.json', '/data/central_kolkata_pandals.json')}
              className="px-2.5 py-1 bg-black/40 hover:bg-black/80 text-festive-gold border border-festive-gold/30 rounded-lg text-[11px] font-mono flex items-center space-x-1"
            >
              <Database className="w-3 h-3" />
              <span>Central JSON</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Reader */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-festive-cream/90 leading-relaxed font-sans">
          
          {activeTab === 'north' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#12070a] border border-festive-gold/25 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">North Kolkata Durga Puja Guide (English Edition)</h3>
                  <p className="text-xs text-festive-sand/80">Translated from source: <code>NORTH_KOLKATA.pdf</code></p>
                </div>
                <button
                  onClick={() => downloadFile('NORTH_KOLKATA_GUIDE_EN.md', '/guides/NORTH_KOLKATA_GUIDE_EN.md')}
                  className="px-3 py-2 bg-festive-ruby hover:bg-festive-crimson text-white rounded-xl text-xs font-bold border border-festive-gold/40 flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>

              <div className="bg-[#14080c] p-5 rounded-2xl border border-festive-gold/15 space-y-4 font-mono text-xs">
                <p className="text-festive-lightgold font-sans font-bold text-sm">Summary of Cataloged North Kolkata Pandals:</p>
                <ul className="list-disc list-inside space-y-1.5 text-festive-cream/80">
                  <li><strong>NK-01: Bagbazar Sarbojanin Durgotsav</strong> (বাগবাজার সর্বজনীন দুর্গোৎসব) — Bagbazar Street. Metro: Shyambazar. Buses: 240, 215A, 30B, S-9A, AC-10. Page 1.</li>
                  <li><strong>NK-02: Kumartuli Park Sarbojanin</strong> (কুমারটুলী পার্ক সর্বজনীন) — Sovabazar. Metro: Sovabazar Sutanuti. Buses: 240, 215A, 30B, 43. Page 1.</li>
                  <li><strong>NK-03: Kumartuli Sarbojanin Durgotsab</strong> (কুমারটুলী সর্বজনীন) — Banamali Sarkar St. Metro: Sovabazar. Page 2.</li>
                  <li><strong>NK-04: Sovabazar Rajbari Durga Puja</strong> (শোভাবাজার রাজবাড়ী) — Raja Nabakrishna St. Metro: Sovabazar. Page 2.</li>
                  <li><strong>NK-05: Ahiritola Sarbojanin Durgotsab</strong> (আহিরীটোলা সর্বজনীন) — Ahiritola Ghat. Buses: 240, 30B, 32A, 43. Page 2.</li>
                  <li><strong>NK-06: Beniatola Sarbojanin Durgotsab</strong> (বেনিয়াটোলা সর্বজনীন) — Beniatola Lane. Page 3.</li>
                  <li><strong>NK-07: Hatibagan Sarbojanin Durgotsav</strong> (হাতিবাগান সর্বজনীন) — Star Theatre / Hatibagan. Metro: Shyambazar. Buses: 11A, 15, 30B, 215A. Page 3.</li>
                  <li><strong>NK-08: Nalin Sarkar Street Sarbojanin</strong> (নলীন সরকার স্ট্রিট) — Hatibagan. Metro: Shyambazar. Page 4.</li>
                  <li><strong>NK-09: Sikdar Bagan Sadharan Durgotsav</strong> (শিকদার বাগান সাধারণ) — Sikdar Bagan St. Metro: Shyambazar. Page 4.</li>
                  <li><strong>NK-10: Kashi Bose Lane Durga Puja Samiti</strong> (কাশী বোস লেন) — Manicktala. Metro: Girish Park. Buses: 11A, 15, 230. Page 5.</li>
                  <li><strong>NK-11: Maniktala Chaltabagan Lohapatty</strong> (মানিকতলা চালতাবাগান) — Raja Ram Mohan Sarani. Metro: Girish Park. Page 5.</li>
                  <li><strong>NK-12: Telengabagan Sarbojanin Durgotsav</strong> (তেলেঙ্গাবাগান সর্বজনীন) — Ultadanga. Metro: Phoolbagan. Buses: 15, 30B, S-12, AC-39. Page 6.</li>
                  <li><strong>NK-13: Dum Dum Park Bharat Chakra</strong> (দমদম পার্ক ভারত চক্র) — VIP Road. Metro: Dum Dum. Buses: 30B, 44, 211, AC-39. Page 6.</li>
                  <li><strong>NK-14: Dum Dum Park Tarun Sangha</strong> (দমদম পার্ক তরুণ সংঘ) — Dum Dum Park. Metro: Dum Dum. Page 7.</li>
                  <li><strong>NK-15: Sreebhumi Sporting Club</strong> (শ্রীভূমি স্পোর্টিং ক্লাব) — Lake Town / VIP Road. Buses: 30B, 211, 215A, S-22, AC-39. Page 7.</li>
                  <li><strong>NK-16: Tala Barowari Durgotsav</strong> (তালা বারোয়ারী দুর্গোৎসব) — Raja Manindra Rd. Metro: Belgachia. Buses: 30B, 32A, 78. Page 8.</li>
                  <li><strong>NK-17: Jagat Mukherjee Park</strong> (জগৎ মুখার্জী পার্ক) — JM Avenue. Metro: Shyambazar. Buses: 240, 78, S-9A. Page 8.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'south' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#12070a] border border-festive-gold/25 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">South Kolkata Durga Puja Guide (English Edition)</h3>
                  <p className="text-xs text-festive-sand/80">Translated from source: <code>SOUTH_KOLKATA.pdf</code></p>
                </div>
                <button
                  onClick={() => downloadFile('SOUTH_KOLKATA_GUIDE_EN.md', '/guides/SOUTH_KOLKATA_GUIDE_EN.md')}
                  className="px-3 py-2 bg-pink-700 hover:bg-pink-600 text-white rounded-xl text-xs font-bold border border-festive-gold/40 flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>

              <div className="bg-[#14080c] p-5 rounded-2xl border border-festive-gold/15 space-y-4 font-mono text-xs">
                <p className="text-festive-lightgold font-sans font-bold text-sm">Summary of Cataloged South Kolkata Pandals:</p>
                <ul className="list-disc list-inside space-y-1.5 text-festive-cream/80">
                  <li><strong>SK-01: Ekdalia Evergreen Club</strong> (একডালিয়া এভারগ্রীন ক্লাব) — Gariahat. Metro: Kalighat. Buses: 1, 2, 42A, 47, S-4C, AC-1. Page 1.</li>
                  <li><strong>SK-02: Singhi Park Sarbojanin Durgotsav</strong> (সিংহী পার্ক) — Dover Terrace, Gariahat. Metro: Kalighat. Page 1.</li>
                  <li><strong>SK-03: Ballygunge Cultural Association</strong> (বালিগঞ্জ কালচারাল) — Jatin Das Rd. Metro: Jatin Das Park. Page 2.</li>
                  <li><strong>SK-04: Hindustan Park Sarbojanin</strong> (হিন্দুস্তান পার্ক) — Gariahat. Metro: Kalighat. Page 2.</li>
                  <li><strong>SK-05: Samaj Sebi Sangha</strong> (সমাজ সেবী সংঘ) — Lake View Rd. Metro: Kalighat / Jatin Das Park. Page 3.</li>
                  <li><strong>SK-06: Deshapriya Park Durgotsav</strong> (দেশপ্রিয় পার্ক) — Rashbehari Ave. Metro: Kalighat. Buses: 47, 240, S-4C. Page 3.</li>
                  <li><strong>SK-07: Tridhara Sammilani</strong> (ত্রিধারা সম্মিলনী) — Manohar Pukur Rd. Metro: Kalighat. Buses: 45, 47, S-7. Page 4.</li>
                  <li><strong>SK-08: Maddox Square Durga Puja</strong> (ম্যাডক্স স্কোয়ার) — Ritchie Rd. Metro: Netaji Bhavan. Page 4.</li>
                  <li><strong>SK-09: Mudiali Club Durgotsav</strong> (মুদিয়ালী ক্লাব) — Southern Ave. Metro: Rabindra Sarobar. Page 5.</li>
                  <li><strong>SK-10: Shiv Mandir Sarbojanin</strong> (শিব মন্দির সর্বজনীন) — Lake Temple Rd. Metro: Rabindra Sarobar. Page 5.</li>
                  <li><strong>SK-11: Badamtala Ashar Sangha</strong> (বাদামতলা আষাঢ় সংঘ) — Nepal Bhattacharjee St. Metro: Kalighat. Buses: 222, 240. Page 6.</li>
                  <li><strong>SK-12: 66 Pally Durgotsav</strong> (৬৬ পল্লী দুর্গোৎসব) — Nepal Bhattacharjee St. Metro: Kalighat. Page 6.</li>
                  <li><strong>SK-13: Chetla Agrani Club</strong> (চেতলা অগ্রণী ক্লাব) — Chetla Park. Metro: Kalighat. Page 7.</li>
                  <li><strong>SK-14: Suruchi Sangha</strong> (সুরুচি সংঘ) — New Alipore. Metro: Majerhat. Buses: S-22, 47. Page 7.</li>
                  <li><strong>SK-15: Naktala Udayan Sangha</strong> (নাকতলা উদয়ন সংঘ) — Naktala. Metro: Gitanjali. Buses: 80A, 80B, 218. Page 8.</li>
                  <li><strong>SK-16: Jodhpur Park Sarbojanin</strong> (যোধপুর পার্ক) — Jodhpur Park. Metro: Rabindra Sarobar. Railway: Dhakuria. Page 8.</li>
                  <li><strong>SK-17: Babubagan Sarbojanin Durgotsav</strong> (বাবুবাগান সর্বজনীন) — Dhakuria. Railway: Dhakuria. Page 9.</li>
                  <li><strong>SK-18: Selimpur Pally Durgotsav</strong> (সেলিমপুর পল্লী) — Selimpur Rd. Railway: Dhakuria. Page 9.</li>
                  <li><strong>SK-19: Behala Natun Dal</strong> (বেহালা নতুন দল) — Diamond Harbour Rd. Metro: Taratala. Buses: 222, 235. Page 10.</li>
                  <li><strong>SK-20: Barisha Club</strong> (বড়িশা ক্লাব) — Sakherbazar. Metro: Sakherbazar. Buses: S-3A, 222. Page 10.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'central' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#12070a] border border-festive-gold/25 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Central Kolkata Durga Puja Guide (English Edition)</h3>
                  <p className="text-xs text-festive-sand/80">Translated from source: <code>CENTRAL _KOLKATA.pdf</code></p>
                </div>
                <button
                  onClick={() => downloadFile('CENTRAL_KOLKATA_GUIDE_EN.md', '/guides/CENTRAL_KOLKATA_GUIDE_EN.md')}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-black rounded-xl text-xs font-bold border border-festive-gold/40 flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>

              <div className="bg-[#14080c] p-5 rounded-2xl border border-festive-gold/15 space-y-4 font-mono text-xs">
                <p className="text-festive-lightgold font-sans font-bold text-sm">Summary of Cataloged Central Kolkata Pandals:</p>
                <ul className="list-disc list-inside space-y-1.5 text-festive-cream/80">
                  <li><strong>CK-01: Mohammad Ali Park Durga Puja</strong> (মহম্মদ আলী পার্ক) — MG Road / CR Ave. Metro: MG Road. Buses: 1, 2, 3, 240, S-5C, AC-1. Page 1.</li>
                  <li><strong>CK-02: College Square Sarbojanin Durgotsav</strong> (কলেজ স্কোয়ার) — College St. Metro: MG Road / Central. Buses: 3B, 24A, AC-24. Page 1.</li>
                  <li><strong>CK-03: Santosh Mitra Square (Lebutala)</strong> (সন্তোষ মিত্র স্কোয়ার) — Bowbazar / Sealdah. Metro: Central / Sealdah. Buses: S-3A, 24A, 71. Page 2.</li>
                  <li><strong>CK-04: Simla Vyayam Samity</strong> (শিমলা ব্যায়াম সমিতি) — Vivekananda Rd. Metro: Girish Park. Buses: 11A, 24A, 78. Page 2.</li>
                  <li><strong>CK-05: Ram Mohan Smriti Mandir</strong> (রামমোহন স্মৃতি মন্দির) — Amherst St. Metro: Central. Buses: 39, 44. Page 3.</li>
                  <li><strong>CK-06: Subodh Mallick Square</strong> (সুবোধ মল্লিক স্কোয়ার) — Wellington. Metro: Central / Chandni Chowk. Buses: 71, S-2. Page 3.</li>
                  <li><strong>CK-07: Bowbazar Sarbojanin Durgotsav</strong> (বউবাজার সর্বজনীন) — BB Ganguly St. Metro: Central. Buses: 2, 24A. Page 4.</li>
                  <li><strong>CK-08: Janbazar Sarbojanin Durgotsav</strong> (জানবাজার সর্বজনীন) — SN Banerjee Rd / Esplanade. Metro: Esplanade. Buses: S-2, 24A. Page 4.</li>
                  <li><strong>CK-09: Entally Sarbojanin Durgotsab</strong> (এন্টালী সর্বজনীন) — Dr Suresh Sarkar Rd. Metro: Sealdah. Buses: 45, S-7. Page 5.</li>
                  <li><strong>CK-10: Sealdah Railway Athletic Club</strong> (শিয়ালদহ রেলওয়ে অ্যাথলেটিক ক্লাব) — Sealdah Station. Metro: Sealdah. Buses: S-10, 24A. Page 5.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#12070a] border border-festive-gold/25">
                <h3 className="text-lg font-serif font-bold text-white">Data Extraction, Geocoding &amp; Verification Protocol</h3>
                <p className="text-xs text-festive-sand/80">Compliant with Pujo Mana PujoPath Data Integrity Guidelines</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-[#14080c] border border-emerald-500/30 space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Data Standards</span>
                  </div>
                  <ul className="space-y-1 text-festive-cream/80 list-disc list-inside text-[11px]">
                    <li>All pandal names retain authentic Bengali spelling and official numbering.</li>
                    <li>Coordinates independently matched to verified physical locations (parks, clubs, ghats).</li>
                    <li>Bus routes grouped by neighborhood as cataloged in source guides.</li>
                    <li>Timetables displayed strictly when published by official transport authorities (WBTC).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#14080c] border border-amber-500/30 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Strict Disclaimers &amp; Guardrails</span>
                  </div>
                  <ul className="space-y-1 text-festive-cream/80 list-disc list-inside text-[11px]">
                    <li>“Bus route listed in the provided guide. Exact timetable not available.” (used where departure schedules are unverified).</li>
                    <li>“Live bus tracking unavailable.” (no synthetic telemetry or fake countdowns).</li>
                    <li>Neighborhood-level routing labeled distinctly from pandal gate stops.</li>
                    <li>Crowd advisories labeled as official published vs historical estimates.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/40 border-t border-festive-gold/30 flex justify-between items-center text-xs">
          <span className="text-festive-cream/60">
            Pujo Mana PujoPath Official Guide Registry 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-festive-maroon hover:bg-festive-ruby text-white font-semibold rounded-xl border border-festive-gold/30"
          >
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
}
