import { useState, useEffect } from 'react'

const COUNTRIES_DEMO = {
  jp: { flag: '🇯🇵', name: 'Japan', emergency: '110 / 119', rate: '149.2 JPY', food: 'Ramen & Sushi', scam: 'Overcharge taxis', color: '#ef4444' },
  th: { flag: '🇹🇭', name: 'Thailand', emergency: '191 / 1669', rate: '35.2 THB', food: 'Pad Kra Pao', scam: 'Tuk-tuk tours', color: '#3b82f6' },
  it: { flag: '🇮🇹', name: 'Italy', emergency: '113 / 118', rate: '0.92 EUR', food: 'Cacio e Pepe', scam: 'Friendship bracelet', color: '#22c55e' },
  mx: { flag: '🇲🇽', name: 'Mexico', emergency: '911', rate: '17.1 MXN', food: 'Tacos al Pastor', scam: 'ATM skimmers', color: '#f97316' },
}

const ALL_COUNTRIES = [
  { name: 'Afghanistan', code: 'AF' }, { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' }, { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' }, { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' }, { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' }, { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' }, { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' }, { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' }, { name: 'Cabo Verde', code: 'CV' },
  { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' },
  { name: 'Costa Rica', code: 'CR' }, { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' }, { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' }, { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' },
  { name: 'Eswatini', code: 'SZ' }, { name: 'Ethiopia', code: 'ET' },
  { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' }, { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' }, { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' }, { name: 'Guinea', code: 'GN' },
  { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' }, { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' }, { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' }, { name: 'South Korea', code: 'KR' },
  { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' }, { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' }, { name: 'Libya', code: 'LY' },
  { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' },
  { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' },
  { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' }, { name: 'Moldova', code: 'MD' },
  { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' }, { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' }, { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' }, { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' }, { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' },
  { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' }, { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' }, { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' }, { name: 'Russia', code: 'RU' },
  { name: 'Rwanda', code: 'RW' }, { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' }, { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' }, { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' }, { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' }, { name: 'South Sudan', code: 'SS' },
  { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' },
  { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' }, { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' }, { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' }, { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' }, { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' },
  { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Venezuela', code: 'VE' }, { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
]

const FEATURES_LIST = [
  { icon: '🚨', title: 'Emergency Contacts', desc: 'Police, ambulance, fire & tourist helplines for every country. Always accessible offline.', tag: 'Critical', tagColor: '#fef2f2', tagText: '#dc2626' },
  { icon: '💱', title: 'Live Currency', desc: 'Real-time exchange rates for 150+ currencies updated every hour. Never get ripped off.', tag: 'Live', tagColor: '#f0fdf4', tagText: '#16a34a' },
  { icon: '⚠️', title: 'Scam Alerts', desc: 'Local scams ranked by severity with exact tactics used. Know before you land.', tag: null, tagColor: '', tagText: '' },
  { icon: '🍜', title: 'Food Guides', desc: 'Must-try dishes, what to avoid, dietary tips and where to eat safely.', tag: null, tagColor: '', tagText: '' },
  { icon: '🚌', title: 'Transport Info', desc: 'Safe apps, taxi companies, train routes and local transport secrets.', tag: null, tagColor: '', tagText: '' },
  { icon: '🛂', title: 'Visa Requirements', desc: 'Entry rules, e-visa links, and passport requirements per nationality.', tag: 'Weekly updates', tagColor: '#eff6ff', tagText: '#2563eb' },
  { icon: '🗺️', title: 'Interactive Maps', desc: 'Explore attractions, hidden gems and points of interest on live maps.', tag: 'New', tagColor: '#fdf4ff', tagText: '#9333ea' },
  { icon: '💬', title: 'Travel Groups', desc: 'Chat with travelers going to the same destination. Share tips in real time.', tag: 'Pro+Chat', tagColor: '#fff7ed', tagText: '#ea580c' },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    sub: 'No credit card needed',
    badge: null,
    features: ['3 countries preview', 'Emergency contacts only', 'Basic currency rates'],
    locked: ['Food, scams, transport, visa', 'Maps & attractions', 'Travel group chats'],
    cta: 'Start free',
    href: '/register',
    style: 'outline',
  },
  {
    name: 'Pro',
    price: '$4.99',
    sub: '/month · cancel anytime',
    badge: 'Most Popular',
    features: ['All 194 countries', 'Emergency, food, scams, visa', 'Live currency rates', 'Maps + attractions', 'Weekly scam updates', 'Offline emergency access'],
    locked: ['Travel group chats'],
    cta: 'Get Pro →',
    href: '/register',
    style: 'dark',
  },
  {
    name: 'Pro + Chat',
    price: '$7.99',
    sub: '/month · cancel anytime',
    badge: '💬 Includes Chat',
    features: ['Everything in Pro', 'Travel group chats', 'Country chat rooms', 'Meet fellow travelers', 'Real-time messaging', 'Trip planning together'],
    locked: [],
    cta: 'Get Pro + Chat →',
    href: '/register',
    style: 'purple',
  },
]

const TESTIMONIALS = [
  { initials: 'AK', bg: '#dbeafe', color: '#1d4ed8', name: 'Arjun K.', loc: 'Mumbai → Morocco', tag: '🚨 Emergency', text: 'Had a medical emergency in Morocco at 2am. Found the ambulance number in 3 seconds. NomadKit genuinely saved my life.' },
  { initials: 'SL', bg: '#dcfce7', color: '#15803d', name: 'Sophie L.', loc: 'Paris → Thailand', tag: '⚠️ Scam avoided', text: 'The scam alerts for Bangkok saved me on day one. The tuk-tuk driver tried the EXACT scam listed. I just smiled and walked away.' },
  { initials: 'MT', bg: '#fce7f3', color: '#be185d', name: 'Marcus T.', loc: 'Toronto → Vietnam', tag: '💱 Saved money', text: 'Check the currency converter before every purchase now. Saved me from exchange booth rip-offs. Paid for itself in one transaction.' },
]

const FAQS = [
  { q: 'How current is the data?', a: 'Emergency numbers verified monthly. Currency rates update hourly. Scam alerts and visa requirements reviewed weekly across all 194 countries.' },
  { q: 'Can I use it offline?', a: 'Emergency contacts are always cached offline — no internet needed. Currency rates show the last cached rate when offline.' },
  { q: "What's in the travel groups?", a: 'Each country has a live chat room. Connect with travelers heading to the same destination, share tips, arrange meetups, and ask locals anything.' },
  { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade, downgrade or cancel anytime. No penalties. If you downgrade mid-cycle, you keep Pro features until the end of your billing period.' },
]

const INITIAL_COUNT = 52

export default function LandingPage() {
  const [activeCountry, setActiveCountry] = useState('jp')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAllCountries, setShowAllCountries] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const country = COUNTRIES_DEMO[activeCountry as keyof typeof COUNTRIES_DEMO]

  const filteredCountries = ALL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const isSearching = countrySearch.trim().length > 0
  const displayedCountries = isSearching
    ? filteredCountries
    : showAllCountries
      ? filteredCountries
      : filteredCountries.slice(0, INITIAL_COUNT)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#06060a', color: '#fff', overflowX: 'hidden', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .fade-up { opacity:0; animation: fadeUp 0.7s ease forwards; }
        .d1{animation-delay:0.05s} .d2{animation-delay:0.15s} .d3{animation-delay:0.25s} .d4{animation-delay:0.38s}
        .pulse-dot { animation: pulse 2.2s ease-in-out infinite; }
        .ticker { animation: ticker 28s linear infinite; }
        .btn-primary { background: linear-gradient(135deg,#7c3aed,#2563eb); color:#fff; border:none; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; display:inline-block; font-family:inherit; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(124,58,237,0.45); }
        .btn-ghost { background:transparent; border:1px solid rgba(255,255,255,0.12); color:rgba(255,255,255,0.6); cursor:pointer; transition:all 0.2s; font-family:inherit; }
        .btn-ghost:hover { border-color:rgba(255,255,255,0.3); color:#fff; background:rgba(255,255,255,0.04); }
        .nav-link { font-size:14px; font-weight:500; color:rgba(255,255,255,0.5); transition:color 0.2s; }
        .nav-link:hover { color:rgba(255,255,255,0.9); }
        .country-tab { cursor:pointer; transition:all 0.18s; border:1px solid transparent; font-family:inherit; }
        .country-tab:hover { background:rgba(255,255,255,0.08)!important; transform:scale(1.04); }
        .feat-card { transition:all 0.22s; }
        .feat-card:hover { background:rgba(124,58,237,0.07)!important; border-color:rgba(124,58,237,0.25)!important; transform:translateY(-3px); }
        .plan-card { transition:transform 0.25s,box-shadow 0.25s; }
        .plan-card:hover { transform:translateY(-5px); box-shadow:0 30px 70px rgba(0,0,0,0.4); }
        .review-card { transition:transform 0.25s,box-shadow 0.25s; }
        .review-card:hover { transform:translateY(-4px); }
        .faq-row { cursor:pointer; transition:background 0.15s; }
        .faq-row:hover { background:rgba(255,255,255,0.025)!important; }
        .country-card { transition:all 0.2s; cursor:pointer; }
        .country-card:hover { background:rgba(124,58,237,0.1)!important; border-color:rgba(124,58,237,0.3)!important; transform:translateY(-2px); }
        .show-more-btn { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); color:rgba(255,255,255,0.55); cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .show-more-btn:hover { background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.22); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#06060a; }
        ::-webkit-scrollbar-thumb { background:#2a2a3a; border-radius:3px; }
        input::placeholder { color:rgba(255,255,255,0.3); }
        input:focus { outline:none; border-color:rgba(124,58,237,0.5)!important; }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;gap:40px!important;}
          .features-grid{grid-template-columns:1fr 1fr!important;}
          .plans-grid{grid-template-columns:1fr!important;}
          .reviews-grid{grid-template-columns:1fr!important;}
          .stats-row{flex-wrap:wrap!important;}
          .nav-links{display:none!important;}
          .nav-actions{display:none!important;}
          .mobile-btn{display:flex!important;}
          .footer-grid{grid-template-columns:1fr 1fr!important;}
          .countries-header{flex-direction:column!important;align-items:flex-start!important;}
          .countries-header input{width:100%!important;}
        }
        @media(max-width:480px){
          .features-grid{grid-template-columns:1fr!important;}
          .footer-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* BG */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-15%', left:'-5%', width:'55%', height:'55%', background:'radial-gradient(ellipse,rgba(124,58,237,0.09) 0%,transparent 65%)' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:'45%', height:'45%', background:'radial-gradient(ellipse,rgba(37,99,235,0.07) 0%,transparent 65%)' }} />
      </div>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:200, padding:'0 clamp(16px,4vw,48px)', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', background:scrolled?'rgba(6,6,10,0.95)':'rgba(6,6,10,0.6)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)', transition:'background 0.3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✈️</div>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, letterSpacing:-0.3 }}>NomadKit</span>
          <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:'rgba(124,58,237,0.18)', color:'#c4b5fd', border:'1px solid rgba(124,58,237,0.28)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Beta</span>
        </div>
        <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:32 }}>
          {[['Features','#features'],['Countries','#countries'],['Pricing','#pricing']].map(([label,href]) => (
            <a key={label} href={href} className="nav-link">{label}{label==='Countries'&&<span style={{ marginLeft:5, fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:99, background:'rgba(251,191,36,0.13)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.22)' }}>194</span>}</a>
          ))}
        </div>
        <div className="nav-actions" style={{ display:'flex', alignItems:'center', gap:8 }}>
          <a href="/login" className="btn-ghost" style={{ fontSize:13, fontWeight:600, padding:'8px 18px', borderRadius:8 }}>Log in</a>
          <a href="/register" className="btn-primary" style={{ fontSize:13, fontWeight:700, padding:'9px 22px', borderRadius:8 }}>Get started →</a>
        </div>
        <button className="mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display:'none', flexDirection:'column', gap:5, background:'none', border:'none', cursor:'pointer', padding:'6px' }}>
          <span style={{ display:'block', width:22, height:2, background:'rgba(255,255,255,0.75)', borderRadius:2 }} />
          <span style={{ display:'block', width:22, height:2, background:'rgba(255,255,255,0.75)', borderRadius:2 }} />
          <span style={{ display:'block', width:14, height:2, background:'rgba(255,255,255,0.4)', borderRadius:2 }} />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:190, background:'rgba(6,6,10,0.98)', backdropFilter:'blur(28px)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'16px 24px 28px' }}>
          {[['Features','#features'],['Countries','#countries'],['Pricing','#pricing']].map(([label,href]) => (
            <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} style={{ display:'block', fontSize:16, fontWeight:500, color:'rgba(255,255,255,0.65)', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{label}</a>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <a href="/login" className="btn-ghost" style={{ flex:1, textAlign:'center', fontSize:14, fontWeight:600, padding:'12px 0', borderRadius:10 }}>Log in</a>
            <a href="/register" className="btn-primary" style={{ flex:1, textAlign:'center', fontSize:14, fontWeight:700, padding:'12px 0', borderRadius:10 }}>Get started →</a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ position:'relative', zIndex:1, maxWidth:1180, margin:'0 auto', padding:'clamp(48px,8vw,90px) clamp(16px,5vw,48px) clamp(60px,10vw,110px)' }}>
        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1.15fr 1fr', gap:56, alignItems:'center' }}>
          <div>
            <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.22)', borderRadius:40, marginBottom:28, fontSize:11, fontWeight:700, color:'#a78bfa', textTransform:'uppercase', letterSpacing:1.2 }}>
              <span className="pulse-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block' }} />
              Live data · 194 countries
            </div>
            <h1 className="fade-up d1" style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(42px,6vw,72px)', fontWeight:900, letterSpacing:-3, lineHeight:1.04, marginBottom:24 }}>
              Travel smarter.{' '}
              <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Worry less.</em>
            </h1>
            <p className="fade-up d2" style={{ fontSize:'clamp(15px,2vw,17px)', lineHeight:1.8, color:'rgba(255,255,255,0.5)', marginBottom:36, maxWidth:480 }}>
              Emergency contacts, live currency, scam alerts, food guides, visa info, interactive maps and travel chats — for every country on earth.
            </p>
            <div className="fade-up d3" style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:36 }}>
              <a href="/register" className="btn-primary" style={{ fontSize:15, fontWeight:700, padding:'14px 28px', borderRadius:11 }}>Start for $4.99/mo →</a>
              <a href="/login" className="btn-ghost" style={{ fontSize:15, fontWeight:500, padding:'14px 22px', borderRadius:11 }}>Sign in</a>
            </div>
            <div className="fade-up d4" style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ display:'flex' }}>
                {[['AK','#3b82f6'],['SL','#22c55e'],['MT','#ec4899'],['RJ','#f59e0b']].map(([init,bg],i) => (
                  <div key={i} style={{ width:29, height:29, borderRadius:'50%', background:bg, border:'2px solid #06060a', marginLeft:i>0?-9:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>{init}</div>
                ))}
              </div>
              <span style={{ color:'#fbbf24', fontSize:12, letterSpacing:1 }}>★★★★★</span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>2,400+ travelers trust NomadKit</span>
            </div>
          </div>

          {/* Hero Card */}
          <div className="float-anim fade-up d2" style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-24, background:`radial-gradient(ellipse,${country.color}18 0%,transparent 65%)`, borderRadius:32, transition:'background 0.5s', pointerEvents:'none' }} />
            <div style={{ position:'relative', background:'rgba(255,255,255,0.035)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:22, padding:'clamp(20px,3vw,28px)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:38 }}>{country.flag}</span>
                  <div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700 }}>{country.name}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600, letterSpacing:1, textTransform:'uppercase' }}>Live data</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#22c55e', fontWeight:600 }}>
                  <span className="pulse-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block' }} />
                  LIVE
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                {[
                  { label:'🚨 Emergency', val:country.emergency },
                  { label:'💱 1 USD =', val:country.rate },
                  { label:'🍜 Must try', val:country.food },
                  { label:'⚠️ Top scam', val:country.scam },
                ].map(item => (
                  <div key={item.label} style={{ background:'rgba(255,255,255,0.045)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:'12px 14px' }}>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.38)', marginBottom:5, fontWeight:600 }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                {Object.entries(COUNTRIES_DEMO).map(([code,c]) => (
                  <button key={code} className="country-tab" onClick={() => setActiveCountry(code)} style={{ fontFamily:'inherit', fontSize:12, fontWeight:600, padding:'6px 11px', borderRadius:7, cursor:'pointer', background:activeCountry===code?'rgba(124,58,237,0.22)':'rgba(255,255,255,0.04)', color:activeCountry===code?'#c4b5fd':'rgba(255,255,255,0.45)', border:`1px solid ${activeCountry===code?'rgba(124,58,237,0.4)':'transparent'}` }}>
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background:'rgba(255,255,255,0.025)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'13px 0', overflow:'hidden', position:'relative', zIndex:1 }}>
        <div className="ticker" style={{ display:'flex', width:'max-content' }}>
          {[...Array(2)].map((_,ri) => (
            ['🇺🇸 USD→EUR 0.921','🇬🇧 GBP→INR 107.4','🇯🇵 JPY→USD 0.0067','🇦🇺 AUD→USD 0.646','🇨🇭 CHF→USD 1.118','🇨🇦 CAD→USD 0.733','🇸🇬 SGD→USD 0.741','🇧🇷 BRL→USD 0.176','🇮🇳 INR→USD 0.012','🇰🇷 KRW→USD 0.00074'].map((t,i) => (
              <div key={`${ri}-${i}`} style={{ display:'flex', alignItems:'center', padding:'0 24px', fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.45)', borderRight:'1px solid rgba(255,255,255,0.05)', whiteSpace:'nowrap' }}>{t}</div>
            ))
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ position:'relative', zIndex:1, borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'center' }}>
        <div className="stats-row" style={{ display:'flex', width:'100%', maxWidth:900, justifyContent:'center' }}>
          {[['194','Countries covered'],['150+','Currency pairs'],['8','Features/country'],['24/7','Live updates']].map((s,i) => (
            <div key={i} style={{ flex:1, padding:'clamp(28px,4vw,44px) clamp(20px,4vw,56px)', textAlign:'center', borderLeft:i>0?'1px solid rgba(255,255,255,0.06)':'none' }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(36px,5vw,52px)', fontWeight:900, letterSpacing:-2, background:'linear-gradient(135deg,#fff,rgba(255,255,255,0.55))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:5 }}>{s[0]}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:500 }}>{s[1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ position:'relative', zIndex:1, maxWidth:1180, margin:'0 auto', padding:'clamp(60px,8vw,100px) clamp(16px,5vw,48px)' }}>
        <div style={{ marginBottom:56 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#7c3aed', marginBottom:14 }}>Everything included</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(34px,5vw,52px)', fontWeight:900, letterSpacing:-2, lineHeight:1.1, marginBottom:14 }}>
            One subscription.{' '}
            <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>Zero blind spots.</em>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', maxWidth:460, lineHeight:1.75 }}>Every feature, every country. Updated continuously so you're never caught off guard.</p>
        </div>
        <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:13 }}>
          {FEATURES_LIST.map(f => (
            <div key={f.title} className="feat-card" style={{ background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'22px 18px' }}>
              <div style={{ width:46, height:46, borderRadius:13, background:'rgba(255,255,255,0.055)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, marginBottom:14 }}>{f.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:7 }}>{f.title}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.42)', lineHeight:1.7, marginBottom:f.tag?12:0 }}>{f.desc}</div>
              {f.tag && <span style={{ display:'inline-block', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:4, background:f.tagColor, color:f.tagText }}>{f.tag}</span>}
            </div>
          ))}
        </div>
      </section>

      {/* COUNTRIES */}
      <section id="countries" style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,0.018)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'clamp(60px,8vw,100px) clamp(16px,5vw,48px)' }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>

          {/* Header */}
          <div className="countries-header" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20, marginBottom:40 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#7c3aed', marginBottom:14 }}>Full coverage</div>
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(34px,5vw,52px)', fontWeight:900, letterSpacing:-2, lineHeight:1.1 }}>
                194 countries.<br />
                <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>All covered.</em>
              </h2>
            </div>
            <input
              type="text"
              placeholder="Search countries..."
              value={countrySearch}
              onChange={e => { setCountrySearch(e.target.value); setShowAllCountries(false) }}
              style={{ fontFamily:'inherit', fontSize:14, padding:'12px 18px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'#fff', width:260, backdropFilter:'blur(10px)' }}
            />
          </div>

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(76px, 1fr))', gap:10 }}>
            {displayedCountries.map(c => (
              <a
                key={c.code}
                href="/register"
                title={c.name}
                className="country-card"
                style={{
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:12,
                  padding:'10px 6px 8px',
                  textAlign:'center',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  gap:6,
                  textDecoration:'none',
                }}
              >
                <img
                  src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png 2x`}
                  alt={c.name}
                  width={32}
                  height={22}
                  style={{ borderRadius:3, objectFit:'cover', display:'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <span style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.04em', lineHeight:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' }}>
                  {c.code}
                </span>
              </a>
            ))}
          </div>

          {/* Empty state */}
          {filteredCountries.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.3)', fontSize:14 }}>
              No countries found for "{countrySearch}"
            </div>
          )}

          {/* Show more / less */}
          {!isSearching && filteredCountries.length > INITIAL_COUNT && (
            <div style={{ textAlign:'center', marginTop:20 }}>
              <button
                onClick={() => setShowAllCountries(prev => !prev)}
                className="show-more-btn"
                style={{ fontSize:13, fontWeight:600, padding:'10px 28px', borderRadius:10, transition:'all 0.2s' }}
              >
                {showAllCountries
                  ? 'Show less ↑'
                  : `Show all ${filteredCountries.length} countries ↓`}
              </button>
            </div>
          )}

          {/* CTA */}
          <div style={{ textAlign:'center', marginTop:24 }}>
            <a href="/register" className="btn-primary" style={{ fontSize:14, fontWeight:700, padding:'12px 28px', borderRadius:10, display:'inline-block' }}>
              Access all 194 countries →
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ position:'relative', zIndex:1, padding:'clamp(60px,8vw,100px) clamp(16px,5vw,48px)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#7c3aed', marginBottom:14 }}>Real stories</div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(32px,5vw,48px)', fontWeight:900, letterSpacing:-2 }}>The app that saved their trip.</h2>
          </div>
          <div className="reviews-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="review-card" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'26px 22px' }}>
                <div style={{ display:'inline-block', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:5, background:'rgba(255,255,255,0.055)', color:'rgba(255,255,255,0.45)', marginBottom:14 }}>{t.tag}</div>
                <div style={{ color:'#fbbf24', fontSize:12, letterSpacing:1, marginBottom:13 }}>★★★★★</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:22, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:t.bg, color:t.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.36)' }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,0.018)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', maxWidth:'100%', padding:'clamp(60px,8vw,100px) clamp(16px,5vw,48px)', textAlign:'center' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#7c3aed', marginBottom:14 }}>Simple pricing</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(34px,5vw,52px)', fontWeight:900, letterSpacing:-2, marginBottom:14, lineHeight:1.1 }}>
            Less than a coffee.{' '}
            <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.35)' }}>Worth way more.</em>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', marginBottom:56 }}>All features, every country. No upsells, no hidden fees.</p>
          <div className="plans-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:15, maxWidth:920, margin:'0 auto 20px' }}>
            {PLANS.map(plan => {
              const isDark = plan.style === 'dark'
              const isPurple = plan.style === 'purple'
              return (
                <div key={plan.name} className="plan-card" style={{ background:isDark?'rgba(255,255,255,0.055)':isPurple?'linear-gradient(145deg,rgba(124,58,237,0.14),rgba(37,99,235,0.09))':'rgba(255,255,255,0.028)', border:`1px solid ${isDark?'rgba(255,255,255,0.1)':isPurple?'rgba(124,58,237,0.32)':'rgba(255,255,255,0.07)'}`, borderRadius:20, padding:'28px 22px', textAlign:'left', transform:isDark?'scale(1.03)':'none', position:'relative' }}>
                  {plan.badge && <div style={{ display:'inline-block', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, background:isPurple?'rgba(124,58,237,0.28)':'linear-gradient(135deg,#7c3aed,#2563eb)', color:isPurple?'#c4b5fd':'#fff', marginBottom:18, border:isPurple?'1px solid rgba(124,58,237,0.38)':'none' }}>{plan.badge}</div>}
                  <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'rgba(255,255,255,0.38)', marginBottom:7 }}>{plan.name}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(40px,6vw,52px)', fontWeight:900, letterSpacing:-2, lineHeight:1, marginBottom:4 }}>{plan.price}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', marginBottom:26 }}>{plan.sub}</div>
                  <ul style={{ listStyle:'none', marginBottom:26 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontSize:12, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.055)', color:'rgba(255,255,255,0.68)', display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ color:isPurple?'#a78bfa':'#22c55e', flexShrink:0 }}>✓</span>{f}
                      </li>
                    ))}
                    {plan.locked.map(f => (
                      <li key={f} style={{ fontSize:12, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.055)', color:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ flexShrink:0 }}>✗</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.href} className={isDark||isPurple?'btn-primary':'btn-ghost'} style={{ display:'block', textAlign:'center', padding:'12px 0', borderRadius:10, fontSize:13, fontWeight:700, width:'100%' }}>{plan.cta}</a>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.26)' }}>🔒 Secure checkout · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position:'relative', zIndex:1, maxWidth:700, margin:'0 auto', padding:'clamp(60px,8vw,100px) clamp(16px,5vw,48px)' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#7c3aed', marginBottom:14 }}>FAQ</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(32px,5vw,44px)', fontWeight:900, letterSpacing:-2 }}>Quick answers.</h2>
        </div>
        {FAQS.map((f,i) => (
          <div key={f.q} className="faq-row" onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'20px 14px', borderRadius:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:14, fontWeight:600 }}>{f.q}</span>
              <span style={{ fontSize:20, color:'rgba(255,255,255,0.28)', transform:openFaq===i?'rotate(45deg)':'none', transition:'transform 0.2s', flexShrink:0, lineHeight:1 }}>+</span>
            </div>
            {openFaq===i && <p style={{ marginTop:13, fontSize:13, color:'rgba(255,255,255,0.47)', lineHeight:1.8 }}>{f.a}</p>}
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <div style={{ position:'relative', margin:'0 clamp(12px,3vw,32px) clamp(48px,6vw,80px)', borderRadius:26, background:'linear-gradient(135deg,#160d2e 0%,#0a122a 50%,#0a1828 100%)', border:'1px solid rgba(124,58,237,0.18)', padding:'clamp(56px,6vw,80px) clamp(24px,5vw,64px)', textAlign:'center', overflow:'hidden', zIndex:1 }}>
        <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:360, height:360, background:'radial-gradient(ellipse,rgba(124,58,237,0.18) 0%,transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(38px,6vw,58px)', fontWeight:900, letterSpacing:-3, lineHeight:1.1, marginBottom:18 }}>
            Start exploring<br />
            <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>worry-free.</em>
          </h2>
          <p style={{ fontSize:16, color:'rgba(255,255,255,0.42)', marginBottom:36 }}>Join 2,400+ travelers who trust NomadKit every single trip.</p>
          <a href="/register" className="btn-primary" style={{ fontSize:15, fontWeight:700, padding:'15px 36px', borderRadius:13, display:'inline-block' }}>Get started for $4.99/month →</a>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'clamp(16px,4vw,32px)', marginTop:22, flexWrap:'wrap' }}>
            {['Cancel anytime','Instant access','All 194 countries'].map(p => (
              <div key={p} style={{ fontSize:12, color:'rgba(255,255,255,0.32)', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ color:'#22c55e' }}>✓</span>{p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'clamp(48px,6vw,72px) clamp(16px,5vw,48px) clamp(28px,3vw,40px)' }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>
          <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 1fr', gap:40, marginBottom:56 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>✈️</div>
                <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, letterSpacing:-0.3 }}>NomadKit</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.38)', lineHeight:1.75, maxWidth:260, marginBottom:24 }}>The traveler's safety net. Emergency info, currency, scam alerts and more — for every country on earth.</p>
            </div>
            {[['Product',['Features','Pricing','Changelog','Roadmap']],['Company',['About Us','Blog','Careers','Contact']],['Legal',['Privacy Policy','Terms of Service','Cookie Policy','Security']]].map(([title,links]) => (
              <div key={title as string}>
                <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'rgba(255,255,255,0.35)', marginBottom:18 }}>{title}</div>
                {(links as string[]).map(l => (
                  <a key={l} href="#" style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:11, transition:'color 0.18s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)' }}
                    onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)' }}
                  >{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom:28 }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>© 2026 NomadKit, Inc. All rights reserved.</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span className="pulse-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block' }} />
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>All systems operational</span>
            </div>
            <div style={{ display:'flex', gap:20 }}>
              {['Privacy','Terms','Cookies'].map(l => (
                <a key={l} href="#" style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}