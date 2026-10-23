import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Box,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Eye,
  Facebook,
  FileText,
  Flower2,
  Heart,
  Image,
  Instagram,
  Link2,
  Mail,
  LayoutDashboard,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  PackagePlus,
  PanelTop,
  Plus,
  Save,
  Search,
  Send,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  Tag,
  Truck,
  Users,
  X,
} from 'lucide-react'
import './styles.css'

type View = 'home' | 'shop' | 'product' | 'references' | 'about' | 'cart' | 'privacy' | 'imprint' | 'accessibility' | 'admin'
type AdminSection = 'dashboard' | 'orders' | 'customers' | 'products' | 'inventory' | 'references' | 'popup' | 'newsletter'
type PopupTarget = 'startseite' | 'shop' | 'alle'
type PopupFrequency = 'einmalig' | 'sitzung' | 'taeglich' | 'immer'
type ConsentSettings = { preferences: boolean; savedAt: string; version: string }
const consentVersion = '2026-10-23'
function assetUrl(path: string) {
  return path.startsWith('/assets/') ? `${basePath}${path}` : path
}

function assetSourceSet(sources: string) {
  return sources.split(',').map((entry) => {
    const [source, descriptor] = entry.trim().split(/\s+/, 2)
    return descriptor ? `${assetUrl(source)} ${descriptor}` : assetUrl(source)
  }).join(', ')
}


type Product = {
  id: string
  slug: string
  name: string
  latin: string
  category: string
  price: number
  image: string
  imageSet: string
  badge?: string
  height: string
  traits: string[]
  description: string
  variants: string[]
  stock: number
}

type PopupConfig = {
  active: boolean
  title: string
  text: string
  cta: string
  target: PopupTarget
  delay: number
  frequency: PopupFrequency
  startsAt: string
  endsAt: string
}

type NewsletterDraft = {
  subject: string
  preheader: string
  fromName: string
  replyTo: string
  audience: string
  headline: string
  body: string
  image: string
  imageAlt: string
  ctaLabel: string
  ctaUrl: string
  showExtraBlock: boolean
  extraText: string
}

type NewsletterUpdate = <K extends keyof NewsletterDraft>(key: K, value: NewsletterDraft[K]) => void

type CartLine = {
  product: Product
  variant: string
  quantity: number
}

type CustomerOrder = {
  id: string
  date: string
  items: string
  total: number
  status: 'Bezahlt' | 'In Bearbeitung' | 'Abholung bereit'
}

type Customer = {
  id: string
  initials: string
  name: string
  email: string
  phone: string
  street: string
  postalCode: string
  city: string
  joinedAt: string
  marketingConsent: boolean
  note: string
  orders: CustomerOrder[]
}

type CustomerContactPatch = Pick<Customer, 'email' | 'phone' | 'street' | 'postalCode' | 'city'>

const products: Product[] = [
  {
    id: 'thuja',
    slug: 'thuja-smaragd',
    name: 'Thuja Smaragd',
    latin: 'Thuja occidentalis „Smaragd“',
    category: 'Heckenpflanzen',
    price: 15,
    image: '/assets/thuja-smaragd.jpg',
    imageSet: '/assets/thuja-smaragd-400.webp 400w, /assets/thuja-smaragd-800.webp 800w',
    badge: 'Bestseller',
    height: '80–100 cm',
    traits: ['Immergrün', 'Pflegeleicht'],
    description: 'Der bewährte Klassiker für dichte, formschöne Hecken und natürlichen Sichtschutz.',
    variants: ['80–100 cm', '100–120 cm', '120–140 cm', '140–160 cm', '160–180 cm', '180–200 cm', '200–225 cm', '225–250 cm'],
    stock: 48,
  },
  {
    id: 'photinia',
    slug: 'photinia-fraseri-red-robin',
    name: 'Photinia fraseri ‘Red Robin’',
    latin: 'Photinia × fraseri ‘Red Robin’',
    category: 'Heckenpflanzen',
    price: 45,
    image: '/assets/photinia-red-robin.jpg',
    imageSet: '/assets/photinia-red-robin-400.webp 400w, /assets/photinia-red-robin-800.webp 800w',
    badge: 'Beliebt',
    height: 'Liefergrösse auf Anfrage',
    traits: ['Immergrün', 'Sonnig', 'Blütenreich'],
    description: 'Glanzmispel mit attraktivem rotem Austrieb für strukturierte, immergrüne Pflanzungen.',
    variants: ['Liefergrösse auf Anfrage'],
    stock: 17,
  },
  {
    id: 'beerenstraeucher',
    slug: 'diverse-beerenstraeucher',
    name: 'Diverse Beerensträucher',
    latin: 'Ribes – verschiedene Sorten',
    category: 'Beerensträucher',
    price: 0,
    image: '/assets/diverse-beerenstraeucher.jpg',
    imageSet: '/assets/diverse-beerenstraeucher-400.webp 400w, /assets/diverse-beerenstraeucher-800.webp 800w',
    badge: 'Sortiment',
    height: 'Verschiedene Sorten',
    traits: ['Sonnig', 'Naschgarten'],
    description: 'Verschiedene Beerensträucher für einen vielfältigen Naschgarten. Preis und Verfügbarkeit auf Anfrage.',
    variants: ['Sorten und Grössen auf Anfrage'],
    stock: 6,
  },
]

const customerSeed: Customer[] = [
  {
    id: 'c-sandro', initials: 'SM', name: 'Sandro Meier', email: 'sandro.meier@example.ch', phone: '+41 79 555 10 42', street: 'Dorfstrasse 18', postalCode: '6014', city: 'Luzern', joinedAt: '12. März 2024', marketingConsent: true, note: 'Bevorzugt die Lieferung am Vormittag. Bitte vor der Zustellung kurz anrufen.',
    orders: [
      { id: '#PF-2026-1042', date: '27.05.2026', items: 'Thuja Smaragd · 3 Artikel', total: 89.70, status: 'Bezahlt' },
      { id: '#PF-2025-0887', date: '09.10.2025', items: 'Photinia Red Robin · 5 Artikel', total: 225, status: 'Bezahlt' },
    ],
  },
  {
    id: 'c-claudia', initials: 'CB', name: 'Claudia Baumann', email: 'claudia.baumann@example.ch', phone: '+41 78 555 10 41', street: 'Birkenweg 7', postalCode: '6247', city: 'Schötz', joinedAt: '26. Mai 2026', marketingConsent: false, note: 'Abholung in der Baumschule gewünscht, sobald die Bestellung bereit ist.',
    orders: [{ id: '#PF-2026-1041', date: '26.05.2026', items: 'Diverse Beerensträucher · 5 Artikel', total: 124.50, status: 'In Bearbeitung' }],
  },
  {
    id: 'c-lukas', initials: 'LS', name: 'Lukas Steiner', email: 'lukas.steiner@example.ch', phone: '+41 76 555 10 40', street: 'Rosenweg 4', postalCode: '6210', city: 'Sursee', joinedAt: '26. Mai 2026', marketingConsent: true, note: 'Plant einen Sichtschutz entlang der Grundstücksgrenze und wünscht eine Beratung vor Ort.',
    orders: [{ id: '#PF-2026-1040', date: '26.05.2026', items: 'Thuja Smaragd · 4 Artikel', total: 214.20, status: 'Abholung bereit' }],
  },
  {
    id: 'c-nina', initials: 'NG', name: 'Nina Graf', email: 'nina.graf@example.ch', phone: '+41 77 555 10 39', street: 'Gartenstrasse 11', postalCode: '4800', city: 'Zofingen', joinedAt: '18. April 2025', marketingConsent: true, note: 'Interessiert sich für saisonale Pflanztipps und Beerensträucher.',
    orders: [{ id: '#PF-2026-1039', date: '25.05.2026', items: 'Beerensträucher · 4 Artikel', total: 159.20, status: 'Bezahlt' }],
  },
]

const categoryCards = [
  {
    name: 'Heckenpflanzen',
    filter: 'Heckenpflanzen',
    text: 'Sichtschutz mit Stil',
    image: '/assets/thuja-smaragd.jpg',
    imageSet: '/assets/thuja-smaragd-400.webp 400w, /assets/thuja-smaragd-800.webp 800w',
    imageAlt: 'Thuja Smaragd aus dem Pflanzfarm-Sortiment',
  },
  {
    name: 'Beerensträucher',
    filter: 'Beerensträucher',
    text: 'Genuss aus dem Garten',
    image: '/assets/diverse-beerenstraeucher.jpg',
    imageSet: '/assets/diverse-beerenstraeucher-400.webp 400w, /assets/diverse-beerenstraeucher-800.webp 800w',
    imageAlt: 'Diverse Beerensträucher aus dem Pflanzfarm-Sortiment',
  },
  {
    name: 'Baumschule',
    filter: 'Alle Pflanzen',
    text: 'Direkt vor Ort entdecken',
    image: '/assets/pflanzfarm-garten-1.jpg',
    imageSet: '/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w',
    imageAlt: 'Pflanzenquartiere der Pflanzfarm',
  },
]

const projectCards = [
  {
    title: 'Formgehölze & Taxus',
    category: 'Baumschule',
    description: 'Auswahl an Formgehölzen und Taxus aus der Pflanzfarm.',
    image: '/assets/pflanzfarm-garten-1.jpg',
    imageSet: '/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w',
    featured: true,
  },
  {
    title: 'Sichtschutz mit Photinia',
    category: 'Garten & Umbauten',
    description: 'Immergrüner Sichtschutz mit Photinia und sauber gefassten Gartenflächen.',
    image: '/assets/pflanzfarm-garten-2.jpg',
    imageSet: '/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w',
    featured: false,
  },
  {
    title: 'Thuja-Sichtschutz',
    category: 'Garten & Umbauten',
    description: 'Gepflegter Sichtschutz mit Thuja für einen klar gefassten Gartenraum.',
    image: '/assets/pflanzfarm-garten-3.jpg',
    imageSet: '/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w',
    featured: false,
  },
]

const defaultPopup: PopupConfig = {
  active: true,
  title: 'Herbstzeit ist Pflanzzeit',
  text: 'Jetzt Heckenpflanzen sichern und im passenden Pflanzfenster liefern lassen.',
  cta: 'Hecken entdecken',
  target: 'startseite',
  delay: 1,
  frequency: 'sitzung',
  startsAt: '2026-09-15',
  endsAt: '2026-11-30',
}

const newsletterImageOptions = [
  { label: 'Thuja Smaragd', value: '/assets/thuja-smaragd.jpg', alt: 'Thuja Smaragd aus dem Pflanzfarm-Sortiment' },
  { label: 'Photinia Red Robin', value: '/assets/photinia-red-robin.jpg', alt: 'Photinia Red Robin aus dem Pflanzfarm-Sortiment' },
  { label: 'Pflanzfarm-Gartenprojekt', value: '/assets/pflanzfarm-garten-2.jpg', alt: 'Sichtschutz mit Photinia in einem Pflanzfarm-Gartenprojekt' },
]

const defaultNewsletter: NewsletterDraft = {
  subject: 'Pflanzzeit im Herbst: Hecken jetzt sichern',
  preheader: 'Pflanztipps, passende Hecken und persönliche Beratung für Ihren Garten.',
  fromName: 'Pflanzfarm Steinmann',
  replyTo: 'info@pflanzfarm.ch',
  audience: 'Personen mit bestätigter Einwilligung',
  headline: 'Herbstzeit ist Pflanzzeit',
  body: 'Jetzt ist die ideale Zeit, um robuste Hecken und Gartenpflanzen zu setzen. Entdecken Sie unsere Auswahl und lassen Sie sich persönlich beraten.',
  image: '/assets/pflanzfarm-garten-2.jpg',
  imageAlt: 'Sichtschutz mit Photinia in einem Pflanzfarm-Gartenprojekt',
  ctaLabel: 'Hecken entdecken',
  ctaUrl: 'https://pflanzfarm.ch/shop',
  showExtraBlock: true,
  extraText: 'Sie möchten Ihr Projekt besprechen? Wir unterstützen Sie bei Auswahl, Lieferung und Pflanzservice.',
}

const socialLinks = [
  { label: 'WhatsApp', href: 'https://wa.me/0793361495', icon: MessageCircle },
  { label: 'Instagram', href: 'https://www.instagram.com/pflanzfarm_steinmann/', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/pflanzfarm.steinmann', icon: Facebook },
]

const referenceFilters = ['Alle', 'Sichtschutz', 'Gartenumbau', 'Neubau', 'Pflege'] as const
const referenceTags: Record<string, string[]> = {
  'Formgehölze & Taxus': ['Neubau'],
  'Sichtschutz mit Photinia': ['Sichtschutz', 'Gartenumbau'],
  'Thuja-Sichtschutz': ['Sichtschutz'],
  'Pflege mit Perspektive': ['Pflege'],
}

const productGuides = [
  { id: 'pflanzung', title: 'Pflanzanleitung', text: 'Vor dem Pflanzen den Wurzelballen gut wässern, ein grosszügiges Pflanzloch ausheben und die Erde anschliessend leicht andrücken. Bei Fragen beraten wir Sie gern persönlich.' },
  { id: 'lieferung', title: 'Lieferung & Abholung', text: 'Wir liefern schweizweit oder bereiten Ihre Pflanzen zur Abholung in Ebersecken vor. Den passenden Termin stimmen wir im Live-Shop verbindlich mit Ihnen ab.' },
  { id: 'pflege', title: 'Pflege', text: 'In den ersten Wochen gleichmässig wässern. Die genaue Pflege richtet sich nach Standort, Jahreszeit und gewählter Pflanzenhöhe.' },
] as const

const pageTitles: Record<View, string> = {
  home: 'Pflanzfarm – Pflanzen für Ihren Garten',
  shop: 'Pflanzen-Shop | Pflanzfarm',
  product: 'Produktdetail | Pflanzfarm',
  references: 'Referenzen | Pflanzfarm',
  about: 'Über uns | Pflanzfarm',
  cart: 'Warenkorb | Pflanzfarm',
  privacy: 'Datenschutz | Pflanzfarm',
  imprint: 'Impressum | Pflanzfarm',
  accessibility: 'Barrierefreiheit | Pflanzfarm',
  admin: 'Admin-Demo | Pflanzfarm',
}

const routeMap: Record<View, string> = {
  home: '/',
  shop: '/shop',
  product: '/produkt/thuja-smaragd',
  references: '/referenzen',
  about: '/ueber-uns',
  cart: '/warenkorb',
  privacy: '/datenschutz',
  imprint: '/impressum',
  accessibility: '/barrierefreiheit',
  admin: '/admin',
}

const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')

function currentAppPath() {
  const pathname = window.location.pathname
  if (!basePath) return pathname
  if (pathname === basePath) return '/'
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) || '/' : pathname
}

function pageUrl(path: string) {
  return `${basePath}${path}`
}

function viewFromPath(path: string): View {
  if (path.startsWith('/admin')) return 'admin'
  if (path.startsWith('/shop')) return 'shop'
  if (path.startsWith('/produkt/')) return 'product'
  if (path.startsWith('/referenzen')) return 'references'
  if (path.startsWith('/ueber-uns')) return 'about'
  if (path.startsWith('/warenkorb')) return 'cart'
  if (path.startsWith('/datenschutz')) return 'privacy'
  if (path.startsWith('/impressum')) return 'imprint'
  if (path.startsWith('/barrierefreiheit')) return 'accessibility'
  return 'home'
}

function productFromPath(path: string): Product {
  const slug = path.split('/').filter(Boolean)[1]
  return products.find((product) => product.slug === slug) ?? products[0]
}

function money(value: number) {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(value)
}

function BrandMark({ compact = false, onActivate }: { compact?: boolean; onActivate?: () => void }) {
  return (
    <button className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Pflanzfarm Startseite" onClick={onActivate}>
      <img src={assetUrl('/assets/pflanzfarm-logo.webp')} alt="Pflanzfarm" />
    </button>
  )
}

function SocialLinks() {
  return <nav className="social-links" aria-label="Social Media"><span className="social-links__label">Folgen Sie uns</span><div>{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Pflanzfarm auf ${label} öffnen`}><Icon size={17} /><span>{label}</span></a>)}</div></nav>
}

function ProductCard({ product, onOpen, onAdd, isSaved, onToggleSaved, justAdded }: { product: Product; onOpen: () => void; onAdd: () => void; isSaved: boolean; onToggleSaved: () => void; justAdded: boolean }) {
  return (
    <article className="product-card">
      <button className="product-card__image" onClick={onOpen} aria-label={`${product.name} öffnen`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={assetUrl(product.image)} srcSet={assetSourceSet(product.imageSet)} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 360px" loading="lazy" decoding="async" alt={product.name} />
        <span className="quick-view"><Eye size={17} /> Details</span>
      </button>
      <button className={isSaved ? 'product-favourite product-favourite--active' : 'product-favourite'} type="button" aria-label={isSaved ? `${product.name} nicht mehr merken` : `${product.name} merken`} aria-pressed={isSaved} onClick={onToggleSaved}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button>
      <div className="product-card__body">
        <span className="product-category">{product.category}</span>
        <button className="product-card__title" onClick={onOpen}>{product.name}</button>
        <p>{product.latin}</p>
        <div className="product-card__meta">
          <span>{product.height}</span>
          <span className="stock-dot"><i /> Auf Lager</span>
        </div>
        <div className="product-card__bottom">
          <strong>{money(product.price)}</strong>
          <button className={justAdded ? 'round-button round-button--confirmed' : 'round-button'} onClick={onAdd} aria-label={`${product.name} in Warenkorb`}>{justAdded ? <Check size={18} /> : <Plus size={18} />}</button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [view, setView] = useState<View>(() => viewFromPath(currentAppPath()))
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => productFromPath(currentAppPath()))
  const [selectedVariant, setSelectedVariant] = useState<string>(() => productFromPath(currentAppPath()).variants[0])
  const [cart, setCart] = useState<Record<string, CartLine>>({})
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle Pflanzen')
  const [trait, setTrait] = useState('Alle Merkmale')
  const [customers, setCustomers] = useState<Customer[]>(customerSeed)
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerSeed[0].id)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard')
  const [popup, setPopup] = useState<PopupConfig>(defaultPopup)
  const [newsletter, setNewsletter] = useState<NewsletterDraft>(defaultNewsletter)
  const [consent, setConsent] = useState<ConsentSettings | null>(null)
  const [consentDialogOpen, setConsentDialogOpen] = useState(false)
  const [preferenceDraft, setPreferenceDraft] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [forcePopupPreview, setForcePopupPreview] = useState(false)
  const [dismissedPopupKey, setDismissedPopupKey] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [productQuantity, setProductQuantity] = useState(1)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [savedProducts, setSavedProducts] = useState<string[]>([])
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(null)
  const [cartPulse, setCartPulse] = useState(false)
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular')
  const [referenceFilter, setReferenceFilter] = useState<(typeof referenceFilters)[number]>('Alle')
  const [openProductGuide, setOpenProductGuide] = useState<(typeof productGuides)[number]['id'] | null>('pflanzung')
  const [galleryMode, setGalleryMode] = useState<'photo' | 'traits' | 'care'>('photo')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [heroVideoEnabled, setHeroVideoEnabled] = useState(false)
  const [heroVideoReady, setHeroVideoReady] = useState(false)
  const consentDialogRef = useRef<HTMLElement | null>(null)
  const popupDialogRef = useRef<HTMLElement | null>(null)
  const shopSearchRef = useRef<HTMLInputElement | null>(null)
  const sessionPopupHistoryRef = useRef(new Set<string>())
  const cartFeedbackTimerRef = useRef<number | null>(null)
  const cartPulseTimerRef = useRef<number | null>(null)

  const cartItems = useMemo(() => Object.entries(cart).map(([key, line]) => ({ key, ...line })), [cart])
  const cartQuantity = cartItems.reduce((total, line) => total + line.quantity, 0)
  const subtotal = cartItems.reduce((total, line) => total + line.product.price * line.quantity, 0)
  const popupMatchesView = popup.target === 'alle' || (popup.target === 'startseite' && view === 'home') || (popup.target === 'shop' && view === 'shop')
  const today = new Date().toISOString().slice(0, 10)
  const popupWithinSchedule = (!popup.startsAt || popup.startsAt <= today) && (!popup.endsAt || popup.endsAt >= today)
  const popupKey = `pflanzfarm-popup:${popup.title}:${popup.startsAt}:${popup.endsAt}`

  const popupFrequencyAllows = () => {
    if (popup.frequency === 'immer') return true
    if (!consent?.preferences) return !sessionPopupHistoryRef.current.has(popupKey)
    if (popup.frequency === 'sitzung') return window.sessionStorage.getItem(popupKey) !== 'shown'
    if (popup.frequency === 'taeglich') return window.localStorage.getItem(popupKey) !== today
    return window.localStorage.getItem(popupKey) !== 'shown'
  }

  const scrollToPageStart = () => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const recordPopupDisplay = () => {
    if (popup.frequency !== 'immer') sessionPopupHistoryRef.current.add(popupKey)
    if (!consent?.preferences) return
    if (popup.frequency === 'sitzung') window.sessionStorage.setItem(popupKey, 'shown')
    if (popup.frequency === 'taeglich') window.localStorage.setItem(popupKey, today)
    if (popup.frequency === 'einmalig') window.localStorage.setItem(popupKey, 'shown')
  }

  const saveConsent = (preferences: boolean) => {
    const nextConsent = { preferences, savedAt: new Date().toISOString(), version: consentVersion }
    setConsent(nextConsent)
    try { window.localStorage.setItem('pflanzfarm-consent', JSON.stringify(nextConsent)) } catch { /* Storage kann blockiert sein. */ }
    setConsentDialogOpen(false)
    setToast(preferences ? 'Optionale Funktionsspeicherung ist aktiviert.' : 'Es werden nur notwendige Einstellungen verwendet.')
  }

  const openConsentSettings = () => {
    setPreferenceDraft(consent?.preferences ?? false)
    setConsentDialogOpen(true)
  }

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('pflanzfarm-consent')
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ConsentSettings>
        if (typeof parsed.preferences === 'boolean' && parsed.version === consentVersion) {
          setConsent({ preferences: parsed.preferences, savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '', version: consentVersion })
          setPreferenceDraft(parsed.preferences)
          return
        }
      }
    } catch { /* Die Einwilligung kann auch ohne Browser-Speicher abgefragt werden. */ }
    setConsentDialogOpen(true)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const nextView = viewFromPath(currentAppPath())
      if (nextView === 'product') {
        const nextProduct = productFromPath(currentAppPath())
        setSelectedProduct(nextProduct)
        setSelectedVariant(nextProduct.variants[0])
        setProductQuantity(1)
      }
      setView(nextView)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.title = pageTitles[view]
    const timer = window.setTimeout(() => document.getElementById('main-content')?.focus({ preventScroll: true }), 0)
    return () => window.clearTimeout(timer)
  }, [view])

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 24)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateHeroVideo = () => {
      const enabled = !reducedMotion.matches
      setHeroVideoEnabled(enabled)
      if (!enabled) setHeroVideoReady(false)
    }
    updateHeroVideo()
    reducedMotion.addEventListener('change', updateHeroVideo)
    return () => {
      reducedMotion.removeEventListener('change', updateHeroVideo)
    }
  }, [])

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('main[id="main-content"] > section, main[id="main-content"] article, .product-card, .category-card, .metric-card, .admin-card'))
    if (!targets.length) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('reveal', 'is-revealed'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
    targets.forEach((target, index) => {
      target.classList.add('reveal')
      target.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 45, 180)}ms`)
      observer.observe(target)
    })
    return () => observer.disconnect()
  }, [view, adminSection])

  useEffect(() => {
    setMobileNavOpen(false)
    setDismissedPopupKey(null)
    scrollToPageStart()
  }, [view])

  useEffect(() => {
    const canDisplay = forcePopupPreview || (consent !== null && popup.active && popupWithinSchedule && popupFrequencyAllows())
    if (view === 'admin' || !popupMatchesView || !canDisplay || (!forcePopupPreview && dismissedPopupKey === popupKey)) {
      setPopupVisible(false)
      return
    }
    const timer = window.setTimeout(() => {
      setPopupVisible(true)
      if (!forcePopupPreview) recordPopupDisplay()
    }, popup.delay * 1000)
    return () => window.clearTimeout(timer)
  }, [view, popup.active, popup.delay, popup.frequency, popup.startsAt, popup.endsAt, popup.target, popup.title, popupMatchesView, popupWithinSchedule, forcePopupPreview, dismissedPopupKey, popupKey, consent])

  useEffect(() => {
    if (!consentDialogOpen) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const appShell = document.querySelector<HTMLElement>('.app')
    const previousOverflow = document.body.style.overflow
    appShell?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    const container = consentDialogRef.current
    container?.focus()
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && consent) setConsentDialogOpen(false)
      if (event.key !== 'Tab' || !container) return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>('button, input, select, textarea, [href]')).filter((element) => !element.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKeys)
    return () => { window.removeEventListener('keydown', handleKeys); appShell?.removeAttribute('inert'); document.body.style.overflow = previousOverflow; previous?.focus() }
  }, [consentDialogOpen, consent])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => () => {
    if (cartFeedbackTimerRef.current) window.clearTimeout(cartFeedbackTimerRef.current)
    if (cartPulseTimerRef.current) window.clearTimeout(cartPulseTimerRef.current)
  }, [])

  const closePopup = () => {
    setPopupVisible(false)
    setDismissedPopupKey(popupKey)
    setForcePopupPreview(false)
  }

  useEffect(() => {
    if (!popupVisible) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const appShell = document.querySelector<HTMLElement>('.app')
    const previousOverflow = document.body.style.overflow
    appShell?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    const container = popupDialogRef.current
    container?.focus()
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopup()
      if (event.key !== 'Tab' || !container) return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>('button, [href]')).filter((element) => !element.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKeys)
    return () => { window.removeEventListener('keydown', handleKeys); appShell?.removeAttribute('inert'); document.body.style.overflow = previousOverflow; previous?.focus() }
  }, [popupVisible, popupKey])

  const goTo = (nextView: View) => {
    const staysOnSamePage = nextView === view
    window.history.pushState({}, '', pageUrl(routeMap[nextView]))
    setView(nextView)
    if (staysOnSamePage) {
      setMobileNavOpen(false)
      scrollToPageStart()
      window.setTimeout(() => document.getElementById('main-content')?.focus({ preventScroll: true }), 0)
    }
  }

  const goToProduct = (product: Product) => {
    window.history.pushState({}, '', pageUrl(`/produkt/${product.slug}`))
    setSelectedProduct(product)
    setSelectedVariant(product.variants[0])
    setProductQuantity(1)
    setOpenProductGuide('pflanzung')
    setGalleryMode('photo')
    scrollToPageStart()
    setView('product')
  }

  const openProduct = (product: Product) => goToProduct(product)
  const openShopSearch = () => {
    goTo('shop')
    window.setTimeout(() => shopSearchRef.current?.focus(), 0)
  }

  const addToCart = (product: Product, amount = 1, variant = product.variants[0]) => {
    const key = `${product.id}::${variant}`
    setCart((current) => ({
      ...current,
      [key]: {
        product,
        variant,
        quantity: (current[key]?.quantity ?? 0) + amount,
      },
    }))
    if (cartFeedbackTimerRef.current) window.clearTimeout(cartFeedbackTimerRef.current)
    if (cartPulseTimerRef.current) window.clearTimeout(cartPulseTimerRef.current)
    setLastAddedProductId(product.id)
    setCartPulse(false)
    window.requestAnimationFrame(() => setCartPulse(true))
    cartFeedbackTimerRef.current = window.setTimeout(() => setLastAddedProductId(null), 900)
    cartPulseTimerRef.current = window.setTimeout(() => setCartPulse(false), 460)
    setToast(`${product.name} (${variant}) wurde in den Warenkorb gelegt.`)
  }

  const toggleSavedProduct = (productId: string) => {
    setSavedProducts((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId])
  }

  const submitNewsletter = () => {
    if (!/^\S+@\S+\.\S+$/.test(newsletterEmail.trim())) {
      setToast('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      return
    }
    setNewsletterSubscribed(true)
    setToast('Danke – Ihre Demo-Anmeldung wurde vorgemerkt.')
  }

  const changeCartQuantity = (key: string, delta: number) => {
    setCart((current) => {
      const line = current[key]
      if (!line) return current
      const quantity = Math.max(0, line.quantity + delta)
      if (quantity === 0) {
        const { [key]: _removed, ...remaining } = current
        window.setTimeout(() => document.getElementById('cart-heading')?.focus(), 0)
        return remaining
      }
      return { ...current, [key]: { ...line, quantity } }
    })
  }

  const updatePopup = <K extends keyof PopupConfig>(key: K, value: PopupConfig[K]) => {
    setPopup((current) => ({ ...current, [key]: value }))
  }

  const updateNewsletter: NewsletterUpdate = (key, value) => {
    setNewsletter((current) => ({ ...current, [key]: value }))
  }

  const filteredProducts = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.latin}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'Alle Pflanzen' || product.category === category
    const matchesTrait = trait === 'Alle Merkmale' || product.traits.includes(trait)
    return matchesQuery && matchesCategory && matchesTrait
  })
  const sortedProducts = [...filteredProducts].sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : sortBy === 'price-desc' ? b.price - a.price : products.indexOf(a) - products.indexOf(b))

  const openPopupPreview = () => {
    setDismissedPopupKey(null)
    setForcePopupPreview(true)
    setPopupVisible(false)
    goTo(popup.target === 'shop' ? 'shop' : 'home')
  }

  const Header = () => (
    <header className={headerScrolled ? 'site-header site-header--scrolled' : 'site-header'}>
      <div className="announcement-bar">
        <span><Truck size={14} /> Schweizweit lieferbar</span>
        <span><Leaf size={14} /> Schweizer Familienbetrieb</span>
        <span><Heart size={14} /> Für Gärten, die bleiben</span>
      </div>
      <div className="site-header__main container">
        <BrandMark onActivate={() => goTo('home')} />
        <nav id="site-navigation" className={mobileNavOpen ? 'main-nav main-nav--open' : 'main-nav'} aria-label="Hauptnavigation">
          <button onClick={() => goTo('shop')}>Pflanzen <ChevronDown size={15} /></button>
          <button onClick={() => goTo('references')}>Gartenservice <ChevronDown size={15} /></button>
          <button onClick={() => goTo('references')}>Referenzen</button>
          <button onClick={() => setToast('Der Ratgeber ist im finalen Shop geplant.')}>Ratgeber</button>
          <button onClick={() => goTo('about')}>Über uns</button>
        </nav>
        <div className="header-actions">
          <button className="icon-button hide-mobile" aria-label="Pflanzensuche öffnen" onClick={openShopSearch}><Search size={21} /></button>
          <button className={cartPulse ? 'cart-button cart-button--pulse' : 'cart-button'} aria-label={`Warenkorb öffnen – ${cartQuantity} ${cartQuantity === 1 ? 'Artikel' : 'Artikel'}`} onClick={() => goTo('cart')}>
            <ShoppingBag size={21} />
            <span>{cartQuantity}</span>
          </button>
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label={mobileNavOpen ? 'Menü schliessen' : 'Menü öffnen'} aria-expanded={mobileNavOpen} aria-controls="site-navigation"><Menu size={23} /></button>
        </div>
      </div>
    </header>
  )

  const Home = () => (
    <main id="main-content" tabIndex={-1}>
      <section className="hero">
        <picture className="hero__poster" aria-hidden="true">
          <source type="image/avif" srcSet={assetSourceSet('/assets/pflanzfarm-hero-mitarbeitende-poster-768.avif 768w, /assets/pflanzfarm-hero-mitarbeitende-poster-1280.avif 1280w')} sizes="100vw" />
          <source type="image/webp" srcSet={assetSourceSet('/assets/pflanzfarm-hero-mitarbeitende-poster-768.webp 768w, /assets/pflanzfarm-hero-mitarbeitende-poster-1280.webp 1280w')} sizes="100vw" />
          <img src={assetUrl('/assets/pflanzfarm-hero-mitarbeitende-poster-1280.webp')} srcSet={assetSourceSet('/assets/pflanzfarm-hero-mitarbeitende-poster-768.webp 768w, /assets/pflanzfarm-hero-mitarbeitende-poster-1280.webp 1280w')} sizes="100vw" width="1280" height="720" fetchPriority="high" decoding="async" alt="" />
        </picture>
        {heroVideoEnabled && <video className={heroVideoReady ? 'hero__video hero__video--ready' : 'hero__video'} autoPlay muted loop playsInline preload="metadata" poster={assetUrl('/assets/pflanzfarm-hero-mitarbeitende-poster-1280.avif')} aria-hidden="true" onCanPlay={() => setHeroVideoReady(true)}>
          <source src={assetUrl('/assets/pflanzfarm-hero-mitarbeitende-seamless-loop.mp4')} type="video/mp4" />
        </video>}
        <div className="hero__shade" />
        <div className="container hero__content">
          <p className="hero__kicker">Pflanzen für ein schöneres Zuhause</p>
          <h1>Grün, das<br />bleibt.</h1>
          <p>Robuste Pflanzen. Persönliche Beratung.<br />Direkt zu Ihnen.</p>
          <div className="hero__actions">
            <button className="button button--primary" onClick={() => goTo('shop')}>Pflanzen entdecken <ArrowRight size={18} /></button>
            <button className="button button--ghost" onClick={() => goTo('references')}>Gartenprojekt planen</button>
          </div>
          <div className="hero__facts">
            <span><Leaf /> Qualität aus der Schweiz</span>
            <span><Users /> Persönliche Fachberatung</span>
            <span><Truck /> Zuverlässige Lieferung</span>
          </div>
        </div>
      </section>

      <section className="section category-section container">
        <div className="section-heading section-heading--split">
          <div><h2>Für jeden Garten<br />die richtige Pflanze.</h2></div>
          <button className="text-link" onClick={() => goTo('shop')}>Alle Kategorien ansehen <ArrowRight size={16} /></button>
        </div>
        <div className="category-grid">
          {categoryCards.map((card) => (
            <button key={card.name} className="category-card" onClick={() => { setCategory(card.filter); goTo('shop') }}>
              <img className="category-card__image" src={assetUrl(card.image)} srcSet={assetSourceSet(card.imageSet)} sizes="(max-width: 760px) 92vw, (max-width: 1000px) 46vw, 32vw" loading="lazy" decoding="async" alt={card.imageAlt} />
              <span className="category-card__body"><strong>{card.name}</strong><span>{card.text}</span></span>
              <span className="circle-arrow"><ArrowRight size={18} /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div><h2>Unsere Empfehlungen</h2></div>
            <button className="text-link" onClick={() => goTo('shop')}>Alle Pflanzen ansehen <ArrowRight size={16} /></button>
          </div>
          <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} isSaved={savedProducts.includes(product.id)} onToggleSaved={() => toggleSavedProduct(product.id)} justAdded={lastAddedProductId === product.id} />)}</div>
        </div>
      </section>

      <section className="story-section container">
        <div className="story-section__text">
          <h2>Aus Ideen werden Gärten, die wachsen.</h2>
          <p>Von der passenden Hecke bis zur fachgerechten Pflanzung: Wir begleiten Ihr Projekt mit Erfahrung, ehrlicher Beratung und Pflanzen, die zum Standort passen.</p>
          <ul className="check-list"><li><Check size={17} /> Standortanalyse und Pflanzkonzepte</li><li><Check size={17} /> Lieferung, Abholung und Pflanzservice</li><li><Check size={17} /> Pflege für langfristig gesunde Pflanzen</li></ul>
          <button className="button button--dark" onClick={() => goTo('references')}>Unsere Projekte <ArrowRight size={18} /></button>
        </div>
        <div className="story-section__visual"><img src={assetUrl('/assets/pflanzfarm-garten-2.jpg')} srcSet={assetSourceSet('/assets/pflanzfarm-garten-2-640.webp 640w, /assets/pflanzfarm-garten-2-1280.webp 1280w')} sizes="(max-width: 900px) 92vw, 50vw" loading="lazy" decoding="async" alt="Sichtschutz mit Photinia aus einem Pflanzfarm-Gartenprojekt" /><div className="visual-stamp"><Leaf size={25} /><span>Regional<br />gewachsen</span></div></div>
      </section>

      <section className="section references-preview">
        <div className="container">
          <div className="section-heading section-heading--split"><div><h2>Gärten, die Geschichten erzählen.</h2></div><button className="text-link" onClick={() => goTo('references')}>Alle Referenzen <ArrowRight size={16} /></button></div>
          <div className="reference-grid">
            {projectCards.map((project, index) => <article className={`reference-card reference-card--${index + 1}`} key={project.title}>
              <button type="button" className="reference-card__action" onClick={() => goTo('references')} aria-label={`Referenz ${project.title} ansehen`}>
                {project.image ? <img src={assetUrl(project.image)} srcSet={assetSourceSet(project.imageSet)} sizes="(max-width: 760px) 92vw, 46vw" loading="lazy" decoding="async" alt="" /> : <span className="reference-card__art"><Leaf size={46} /><span>{index === 1 ? 'Naturstein & Struktur' : 'Obst für morgen'}</span></span>}
                <span className="reference-card__overlay"><span>{project.category}</span><span className="reference-card__title">{project.title}</span><span className="reference-card__description">{project.description}</span><i><ArrowUpRight size={20} /></i></span>
              </button>
            </article>)}
          </div>
        </div>
      </section>

      <section className={newsletterSubscribed ? 'newsletter newsletter--subscribed container' : 'newsletter container'}><div><h2>Ideen, Tipps und<br />grüne Neuigkeiten.</h2></div><div className="newsletter__form">{newsletterSubscribed ? <div className="newsletter__success" role="status"><Check size={22} /><div><b>Danke für Ihr Interesse.</b><span>Ihre Demo-Anmeldung ist vorgemerkt.</span></div><button className="inline-link" onClick={() => { setNewsletterSubscribed(false); setNewsletterEmail('') }}>Adresse ändern</button></div> : <><p>Erhalten Sie saisonale Pflanztipps direkt in Ihr Postfach.</p><div><input value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submitNewsletter() }} placeholder="Ihre E-Mail-Adresse" aria-label="Ihre E-Mail-Adresse" inputMode="email" /><button onClick={submitNewsletter}>Anmelden <ArrowRight size={17} /></button></div><small>Mit der Anmeldung akzeptieren Sie unsere <button className="inline-link" onClick={() => goTo('privacy')}>Datenschutzbestimmungen</button>.</small></>}</div></section>
    </main>
  )

  const Shop = () => (
    <main id="main-content" tabIndex={-1} className="shop-page">
      <div className="container shop-page__intro"><h1>Finden, was in Ihrem<br />Garten wachsen soll.</h1><p>Robuste Pflanzen, passend zu Ihrem Standort und mit fachkundiger Beratung.</p></div>
      <div className="container shop-toolbar">
        <label className="search-field"><Search size={20} /><input ref={shopSearchRef} aria-label="Pflanzen suchen" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pflanzen, botanische Namen …" /></label>
        <div className="filter-group"><SlidersHorizontal size={18} /><select aria-label="Pflanzenkategorie filtern" value={category} onChange={(event) => setCategory(event.target.value)}><option>Alle Pflanzen</option><option>Heckenpflanzen</option><option>Beerensträucher</option></select><select aria-label="Pflanzeneigenschaft filtern" value={trait} onChange={(event) => setTrait(event.target.value)}><option>Alle Merkmale</option><option>Immergrün</option><option>Pflegeleicht</option><option>Sonnig</option><option>Blütenreich</option></select></div>
      </div>
      <div className="container shop-results"><div className="shop-results__top"><span><strong>{sortedProducts.length}</strong> Pflanzen gefunden {savedProducts.length > 0 && <em>{savedProducts.length} gemerkt</em>}</span><label className="sort-control">Sortieren <select aria-label="Pflanzen sortieren" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}><option value="popular">Beliebtheit</option><option value="price-asc">Preis aufsteigend</option><option value="price-desc">Preis absteigend</option></select><ChevronDown size={16} /></label></div><div className="product-grid product-grid--shop">{sortedProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} isSaved={savedProducts.includes(product.id)} onToggleSaved={() => toggleSavedProduct(product.id)} justAdded={lastAddedProductId === product.id} />)}</div>{sortedProducts.length === 0 && <div className="empty-state"><Leaf size={37} /><h3>Keine passende Pflanze gefunden.</h3><p>Versuchen Sie eine andere Suche oder setzen Sie den Filter zurück.</p><button className="button button--dark" onClick={() => { setQuery(''); setCategory('Alle Pflanzen'); setTrait('Alle Merkmale') }}>Filter zurücksetzen</button></div>}</div>
    </main>
  )

  const ProductDetail = () => (
    <main id="main-content" tabIndex={-1} className="product-page container">
      <button className="breadcrumb" onClick={() => goTo('shop')}>Shop <ChevronRight size={14} /> {selectedProduct.category}</button>
      <div className="product-detail">
        <div className="product-gallery"><div className="product-gallery__thumbs"><button className={galleryMode === 'photo' ? 'selected' : ''} aria-label="Produktbild anzeigen" aria-pressed={galleryMode === 'photo'} onClick={() => setGalleryMode('photo')}><img src={assetUrl(selectedProduct.image)} srcSet={assetSourceSet(selectedProduct.imageSet)} sizes="96px" alt="" /></button><button className={galleryMode === 'traits' ? 'selected placeholder-thumb' : 'placeholder-thumb'} aria-label="Pflanzeigenschaften anzeigen" aria-pressed={galleryMode === 'traits'} onClick={() => setGalleryMode('traits')}><Leaf size={19} /></button><button className={galleryMode === 'care' ? 'selected placeholder-thumb' : 'placeholder-thumb'} aria-label="Pflanzberatung anzeigen" aria-pressed={galleryMode === 'care'} onClick={() => setGalleryMode('care')}><Sprout size={19} /></button></div><div className="product-gallery__main">{galleryMode === 'photo' ? <img src={assetUrl(selectedProduct.image)} srcSet={assetSourceSet(selectedProduct.imageSet)} sizes="(max-width: 900px) 92vw, 560px" fetchPriority="high" decoding="async" alt={selectedProduct.name} /> : <div className="gallery-insight"><span>{galleryMode === 'traits' ? <Leaf size={38} /> : <Sprout size={38} />}</span><h2>{galleryMode === 'traits' ? 'Auf einen Blick' : 'Gut begleitet'}</h2><p>{galleryMode === 'traits' ? `${selectedProduct.name} ist ${selectedProduct.traits.join(', ').toLowerCase()} und für einen langlebigen Garten geeignet.` : 'Unsere Fachberatung unterstützt Sie bei Standort, Pflanzung und der ersten Pflege.'}</p></div>}<span className="gallery-caption"><Eye size={15} /> {galleryMode === 'photo' ? 'Produktansicht' : galleryMode === 'traits' ? 'Eigenschaften' : 'Pflanzberatung'}</span></div></div>
        <div className="product-detail__info"><span className="eyebrow">{selectedProduct.category}</span><h1>{selectedProduct.name}</h1><p className="latin">{selectedProduct.latin}</p><p className="product-description">{selectedProduct.description}</p><div className="care-tags">{selectedProduct.traits.map((item) => <span key={item}><Leaf size={15} /> {item}</span>)}<span><Sprout size={15} /> Winterhart</span></div><div className="in-stock"><Check size={16} /> {selectedProduct.stock} Stück verfügbar</div><label className="variant-label">Grösse<select value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)}>{selectedProduct.variants.map((variant) => <option key={variant}>{variant}</option>)}</select></label><div className="product-purchase"><div><strong>{money(selectedProduct.price)}</strong><span>inkl. MwSt.</span></div><div className="quantity-control"><button aria-label="Menge verringern" onClick={() => setProductQuantity((quantity) => Math.max(1, quantity - 1))}><Minus size={17} /></button><span>{productQuantity}</span><button aria-label="Menge erhöhen" onClick={() => setProductQuantity((quantity) => quantity + 1)}><Plus size={17} /></button></div><button className="button button--primary button--cart" onClick={() => addToCart(selectedProduct, productQuantity, selectedVariant)}><ShoppingCart size={18} /> In den Warenkorb</button></div><div className="delivery-points"><span><Truck size={20} /><b>Schweizweit lieferbar</b><small>Zuverlässig zu Ihnen</small></span><span><MapPin size={20} /><b>Abholung möglich</b><small>Direkt bei uns vor Ort</small></span><span><Sprout size={20} /><b>Pflanzservice buchbar</b><small>Auf Wunsch direkt bei Ihnen</small></span></div><div className="accordions">{productGuides.map((guide) => <section className={openProductGuide === guide.id ? 'accordion-item accordion-item--open' : 'accordion-item'} key={guide.id}><button aria-expanded={openProductGuide === guide.id} aria-controls={`guide-${guide.id}`} onClick={() => setOpenProductGuide((current) => current === guide.id ? null : guide.id)}><span>{guide.title}</span><ChevronDown size={18} /></button><div id={`guide-${guide.id}`} className="accordion-item__content" hidden={openProductGuide !== guide.id}><p>{guide.text}</p></div></section>)}</div></div>
      </div>
    </main>
  )

  const References = () => {
    const allProjects = projectCards.concat([{ title: 'Pflege mit Perspektive', category: 'Baumpflege', description: 'Sorgfältige Pflege macht aus gewachsenen Gärten langjährige Lieblingsorte.', image: '', imageSet: '', featured: false }])
    const visibleProjects = allProjects.filter((project) => referenceFilter === 'Alle' || referenceTags[project.title]?.includes(referenceFilter))
    return <main id="main-content" tabIndex={-1} className="references-page">
      <section className="references-hero"><div className="container"><span className="eyebrow eyebrow--light">Referenzen</span><h1>Gärten, die<br />weiterwachsen.</h1><p>Wir verbinden Pflanzenwissen, Handwerk und Orte, an denen man gern zuhause ist.</p></div></section>
      <section className="container section"><div className="reference-filter"><span>Projektart:</span>{referenceFilters.map((filter) => <button key={filter} className={referenceFilter === filter ? 'active' : ''} aria-pressed={referenceFilter === filter} onClick={() => setReferenceFilter(filter)}>{filter}</button>)}</div><div className="references-filter-status" role="status">{visibleProjects.length} {visibleProjects.length === 1 ? 'Projekt' : 'Projekte'} sichtbar</div><div className="references-list">{visibleProjects.map((project, index) => <article className="reference-list-card" key={project.title}><div className={`reference-list-card__image reference-list-card__image--${index}`}>{project.image ? <img src={assetUrl(project.image)} srcSet={assetSourceSet(project.imageSet)} sizes="(max-width: 760px) 92vw, 46vw" loading="lazy" decoding="async" alt={project.title} /> : <div><Sprout size={42} /><span>{project.category}</span></div>}</div><div className="reference-list-card__body"><span className="eyebrow">{project.category}</span><h2>{project.title}</h2><p>{project.description}</p><div className="reference-facts"><span><MapPin size={16} /> Kanton Luzern</span><span><CalendarDays size={16} /> 2025</span></div><button className="text-link" onClick={() => setToast('Die Referenzdetailseite ist im finalen Shop vorgesehen.')}>Projekt ansehen <ArrowRight size={16} /></button></div></article>)}</div>{visibleProjects.length === 0 && <div className="empty-state"><Leaf size={37} /><h3>Keine Referenz in dieser Kategorie.</h3><button className="button button--dark" onClick={() => setReferenceFilter('Alle')}>Alle Projekte anzeigen</button></div>}</section>
    </main>
  }

  const About = () => {
    const team = [
      { name: 'Thomas Steinmann', role: 'Leitung · Gartenbau HF · Landwirtschaft EFZ', image: '/assets/about/thomas-steinmann.jpg', imageSet: '/assets/about/thomas-steinmann-480.webp 480w, /assets/about/thomas-steinmann-960.webp 960w', alt: 'Thomas Steinmann bei der Pflege von Formgehölzen' },
      { name: 'Susan Steinmann', role: 'Baumschule', image: '/assets/about/susan-steinmann.jpg', imageSet: '/assets/about/susan-steinmann-480.webp 480w, /assets/about/susan-steinmann-960.webp 960w', alt: 'Susan Steinmann bei der Pflanzenpflege in der Baumschule' },
      { name: 'Hans Steinmann', role: 'Gartenbau · Meister-Landwirtschaft', image: '/assets/about/hans-steinmann.jpg', imageSet: '/assets/about/hans-steinmann-480.webp 480w, /assets/about/hans-steinmann-960.webp 960w', alt: 'Hans Steinmann bei der Gartenarbeit' },
      { name: 'David Müller', role: 'Gartenbau in Weiterbildung zum Gartenbau HF', image: '/assets/about/david-mueller.jpg', imageSet: '/assets/about/david-mueller-480.webp 480w, /assets/about/david-mueller-960.webp 960w', alt: 'David Müller bei der Pflege einer Heckenpflanzung' },
    ]

    return <main id="main-content" tabIndex={-1} className="about-page">
      <section className="about-hero container">
        <div className="about-hero__copy"><p className="about-kicker">Über uns</p><h1>Verwurzelt in der Region.<br />Für Gärten in der ganzen Schweiz.</h1><p>Seit 2020 steht Pflanzfarm Steinmann für Pflanzenwissen, handwerkliche Sorgfalt und eine persönliche Begleitung – von der Auswahl bis zum eingewachsenen Garten.</p><div className="about-hero__actions"><button className="button button--dark" onClick={() => goTo('shop')}>Pflanzen entdecken <ArrowRight size={18} /></button><button className="text-link" onClick={() => goTo('references')}>Unsere Projekte <ArrowRight size={16} /></button></div></div>
        <figure className="about-hero__portrait"><img src={assetUrl('/assets/about/pflanzfarm-team-hero.jpg')} srcSet={assetSourceSet('/assets/about/pflanzfarm-team-hero-480.webp 480w, /assets/about/pflanzfarm-team-hero-960.webp 960w')} sizes="(max-width: 800px) 92vw, 42vw" fetchPriority="high" decoding="async" alt="Thomas Steinmann, Gründer der Pflanzfarm Steinmann" /><figcaption><span>2020 gegründet</span><strong>Pflanzfarm Steinmann</strong></figcaption></figure>
      </section>
      <section className="about-story-section"><div className="container about-story"><div className="about-story__image"><img src={assetUrl('/assets/pflanzfarm-garten-1.jpg')} srcSet={assetSourceSet('/assets/pflanzfarm-garten-1-640.webp 640w, /assets/pflanzfarm-garten-1-1280.webp 1280w')} sizes="(max-width: 860px) 92vw, 48vw" loading="lazy" decoding="async" alt="Pflanzenquartiere der Pflanzfarm" /></div><div className="about-story__copy"><p className="about-kicker">Ein Familienbetrieb</p><h2>Mit Pflanzen gewachsen.</h2><p>Thomas Steinmann gründete die Pflanzfarm im Jahr 2020. Heute ist daraus ein Schweizer Familienbetrieb entstanden, der Privatpersonen und Unternehmen in der ganzen Schweiz mit sorgfältig ausgewählten Pflanzen begleitet.</p><p>Erfahrung aus Garten- und Landschaftsbau verbindet sich bei uns mit echter Freude an Pflanzen – und mit Beratung, die zum Standort, zum Projekt und zu den Menschen dahinter passt.</p><div className="about-story__note"><Leaf size={20} /><span>Auswahl, Lieferung, Pflanzung und Pflege aus einer Hand.</span></div></div></div></section>
      <section className="about-focus container"><div><p className="about-kicker">Was uns wichtig ist</p><h2>Praktisches Wissen.<br />Ehrliche Empfehlungen.</h2></div><div className="about-focus__list"><article><span>01</span><div><h3>Passende Pflanzen</h3><p>Wir helfen dabei, die passende Pflanze für Standort, Nutzung und gewünschte Wirkung zu finden.</p></div></article><article><span>02</span><div><h3>Verlässlich begleitet</h3><p>Von der Baumschule bis zum Gartenprojekt bleiben wir an Ihrer Seite – auch nach der Pflanzung.</p></div></article><article><span>03</span><div><h3>Mit Blick aufs Ganze</h3><p>Wir verbinden Pflanzen, Gartenbau und Pflege zu Lösungen, die langfristig funktionieren.</p></div></article></div></section>
      <section className="about-team-section"><div className="container"><div className="about-team-heading"><div><p className="about-kicker">Das Team</p><h2>Menschen hinter<br />der Pflanzfarm.</h2></div><p>Vier Perspektiven, ein gemeinsamer Anspruch: Pflanzen und Gärten mit Aufmerksamkeit, Erfahrung und Freude zu begleiten.</p></div><div className="team-grid">{team.map((member) => <article className="team-card" key={member.name}><img src={assetUrl(member.image)} srcSet={assetSourceSet(member.imageSet)} sizes="(max-width: 640px) 92vw, (max-width: 1050px) 46vw, 24vw" loading="lazy" decoding="async" alt={member.alt} /><div><h3>{member.name}</h3><p>{member.role}</p></div></article>)}</div></div></section>
      <section className="container about-callout"><div><p className="about-kicker">Ihr Gartenprojekt</p><h2>Was soll bei Ihnen wachsen?</h2><p>Entdecken Sie passende Pflanzen im Shop oder lassen Sie sich von umgesetzten Gartenprojekten inspirieren.</p></div><div><button className="button button--primary" onClick={() => goTo('shop')}>Zum Pflanzenshop <ArrowRight size={18} /></button><button className="button button--ghost" onClick={() => goTo('references')}>Referenzen ansehen</button></div></section>
      <section className="container about-social"><div><p className="about-kicker">In Verbindung bleiben</p><h2>Folgen Sie der Pflanzfarm.</h2><p>Einblicke aus der Baumschule, aktuelle Pflanzen und Gartenprojekte finden Sie auf unseren Kanälen.</p></div><SocialLinks /></section>
    </main>
  }

  const Cart = () => (
    <main id="main-content" tabIndex={-1} className="cart-page container">
      <div className="cart-page__heading">
        <span className="eyebrow">Ihr Warenkorb</span>
        <h1 id="cart-heading" tabIndex={-1}>Fast bereit zum Einpflanzen.</h1>
        <p>{cartQuantity ? `${cartQuantity} Pflanzen warten auf ihren neuen Garten.` : 'Ihr Warenkorb ist noch leer.'}</p>
      </div>
      {cartItems.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(({ key, product, variant, quantity }) => (
              <article className="cart-line" key={key}>
                <img src={assetUrl(product.image)} srcSet={assetSourceSet(product.imageSet)} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 360px" loading="lazy" decoding="async" alt={product.name} />
                <div>
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>Variante: {variant}</p>
                  <button className="remove-link" onClick={() => changeCartQuantity(key, -quantity)}>Entfernen</button>
                </div>
                <div className="cart-line__right">
                  <strong>{money(product.price * quantity)}</strong>
                  <div className="quantity-control quantity-control--small">
                    <button aria-label={`${product.name}: Menge verringern`} onClick={() => changeCartQuantity(key, -1)}><Minus size={15} /></button>
                    <span>{quantity}</span>
                    <button aria-label={`${product.name}: Menge erhöhen`} onClick={() => changeCartQuantity(key, 1)}><Plus size={15} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <h2>Bestellübersicht</h2>
            <div><span>Zwischensumme</span><strong>{money(subtotal)}</strong></div>
            <div><span>Lieferung</span><span>Im Checkout</span></div>
            <hr />
            <div className="order-summary__total"><strong>Total</strong><strong>{money(subtotal)}</strong></div>
            <small>Versand- und Pflanzservice-Optionen werden im nächsten Schritt berechnet.</small>
            <button className="button button--primary button--full" onClick={() => setToast('Stripe Checkout wird erst in der produktiven Laravel-Version verbunden.')}>Sicher zur Kasse <ArrowRight size={18} /></button>
            <button className="text-link" onClick={() => goTo('shop')}>Weiter einkaufen <ArrowRight size={16} /></button>
          </aside>
        </div>
      ) : (
        <div className="empty-state empty-state--cart"><ShoppingBag size={42} /><h2>Ihr Warenkorb ist noch leer.</h2><p>Entdecken Sie robuste Pflanzen für Ihren Garten.</p><button className="button button--dark" onClick={() => goTo('shop')}>Zum Shop</button></div>
      )}
    </main>
  )

  const Privacy = () => (
    <main id="main-content" tabIndex={-1} className="legal-page container">
      <header className="legal-hero"><span className="eyebrow">Datenschutz</span><h1>Datenschutz auf einen Blick.</h1><p>Diese Erklärung beschreibt den heutigen Prototypen und trennt ihn klar von den geplanten Datenflüssen des späteren Live-Shops.</p><span className="legal-version">Stand: 23. Oktober 2026 · Prototyp</span></header>
      <section className="legal-notice"><Check size={20} /><p><b>Datensparsame Voreinstellung:</b> Die optionale Plattform-Analyse ist deaktiviert. Externe soziale Netzwerke werden erst nach einem Klick geöffnet. Eine freiwillige Funktionsspeicherung wird erst nach Ihrer Wahl gesetzt.</p></section>
      <div className="legal-grid">
        <section><h2>Verantwortliche Stelle</h2><p>Pflanzfarm<br />Inhaber/Betreiber: Thomas Steinmann<br />Untergretti 2, CH-6245 Ebersecken<br /><a href="mailto:info@pflanzfarm.ch">info@pflanzfarm.ch</a> · <a href="tel:+41793361495">+41 79 336 14 95</a></p></section>
        <section><h2>Was diese Vorschau verarbeitet</h2><p>Der Prototyp speichert keine Bestellungen, Konten oder Newsletter-Anmeldungen serverseitig. Warenkorb, Admin-Demo und Formulare sind lokale Demonstrationsfunktionen. Technisch unvermeidbare Abrufdaten können beim Hosting anfallen; der endgültige Hosting-Vertrag und die konkrete Protokollierung werden vor Live-Schaltung dokumentiert.</p></section>
        <section><h2>Lokale Einstellungen</h2><p>Die Entscheidung zu optionaler Funktionsspeicherung wird im Browser abgelegt, damit sie respektiert werden kann. Mit Zustimmung darf die Popup-Frequenz lokal gemerkt werden. Ohne Zustimmung werden keine optionalen Browser-Speicherwerte für diese Funktion geschrieben.</p><button className="text-link" onClick={openConsentSettings}>Cookie-Einstellungen öffnen <ArrowRight size={16} /></button></section>
        <section><h2>Geplanter Live-Shop</h2><p>Vor dem Live-Betrieb werden Bestell- und Kontodaten ausschliesslich zur Vertragsabwicklung im Laravel-/MySQL-System bei Hetzner verarbeitet. Stripe verarbeitet Zahlungen; Resend versendet Newsletter nur nach dokumentierter Einwilligung. Die endgültige Erklärung nennt dann tatsächliche Zwecke, Aufbewahrungsfristen, Empfänger, Auftragsbearbeitungen und mögliche Auslandübermittlungen.</p></section><section><h2>Rechtsgrundlagen im Live-Betrieb</h2><p>Für Bestellungen wird die Verarbeitung auf die Vertragserfüllung gestützt. Gesetzliche Aufbewahrungspflichten und die Sicherheit des Shops werden getrennt dokumentiert. Newsletter und optionale Speicherung erfolgen nur mit Einwilligung. Die konkrete Zuordnung zu revDSG und, soweit anwendbar, DSGVO wird vor Live-Schaltung mit den tatsächlichen Prozessen geprüft.</p></section>
        <section><h2>Ihre Rechte</h2><p>Sie können je nach anwendbarem Recht Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenherausgabe verlangen. Für Anliegen schreiben Sie an <a href="mailto:info@pflanzfarm.ch">info@pflanzfarm.ch</a>. Die Datenschutzinformation wird vor Produktivstart mit den tatsächlich genutzten Diensten verbindlich finalisiert.</p></section>
        <section><h2>Kontakt und Änderungen</h2><p>Bei Fragen zu dieser Vorschau oder zu Datenbearbeitungen wenden Sie sich an Thomas Steinmann über die oben genannte Kontaktadresse. Änderungen werden mit einem neuen Standdatum veröffentlicht.</p></section>
      </div>
    </main>
  )

  const Imprint = () => (
    <main id="main-content" tabIndex={-1} className="legal-page container">
      <header className="legal-hero"><span className="eyebrow">Impressum</span><h1>Klare Angaben zur Pflanzfarm.</h1><p>Kontakt- und Verantwortlichkeitsangaben für das Online-Angebot.</p></header>
      <div className="legal-grid legal-grid--imprint">
        <section><h2>Anbieter</h2><p>Pflanzfarm<br />Inhaber/Betreiber: Thomas Steinmann<br />Untergretti 2<br />CH-6245 Ebersecken</p><p><a href="tel:+41793361495">+41 79 336 14 95</a><br /><a href="mailto:info@pflanzfarm.ch">info@pflanzfarm.ch</a></p></section>
        <section><h2>Verantwortung für Inhalte</h2><p>Thomas Steinmann<br />Untergretti 2<br />CH-6245 Ebersecken</p><p>UID-/Mehrwertsteuerangaben werden vor der produktiven Shop-Schaltung anhand der tatsächlichen Unternehmensdaten ergänzt, falls anwendbar.</p></section>
        <section><h2>Onlinehandel</h2><p>Der aktuelle Prototyp löst keinen Vertrag aus. Im Live-Shop werden Bestellschritte, Eingabekorrekturen, der Zeitpunkt des Vertragsschlusses und die elektronische Bestellbestätigung direkt im Checkout verständlich offengelegt.</p></section>
        <section><h2>Urheberrecht und Links</h2><p>Die Inhalte dieser Vorschau sind urheberrechtlich geschützt. Externe Links öffnen erst nach Aktivierung durch Sie. Für deren Inhalte sind die jeweiligen Betreiber verantwortlich.</p></section>
      </div>
    </main>
  )

  const Accessibility = () => (
    <main id="main-content" tabIndex={-1} className="legal-page container">
      <header className="legal-hero"><span className="eyebrow">Barrierefreiheit</span><h1>Für möglichst viele Menschen bedienbar.</h1><p>Die öffentliche Oberfläche richtet sich am Konformitätsziel WCAG 2.2 auf Stufe AA aus.</p></header>
      <div className="legal-grid">
        <section><h2>Umgesetzte Massnahmen</h2><p>Sprunglink, sichtbare Tastaturfokusse, semantische Hauptbereiche, aussagekräftige Beschriftungen, ausreichende Kontraste, robuste Zielgrössen und Unterstützung für reduzierte Bewegung sind in dieser Vorschau umgesetzt.</p></section>
        <section><h2>Tastatur und Fokus</h2><p>Alle wesentlichen Funktionen der öffentlichen Seiten sind mit Tastatur erreichbar. Der Fokus bleibt sichtbar. Bereits gespeicherte Cookie-Einstellungen und das Kampagnen-Popup lassen sich mit Escape schliessen; bei der ersten Consent-Abfrage ist eine klare Auswahl erforderlich. Bitte melden Sie uns beobachtete Barrieren.</p></section>
        <section><h2>Bekannte Grenze des Prototyps</h2><p>Der Demo-Adminbereich ist noch keine echte Zugangskontrolle. Vor dem Live-Betrieb wird er in Laravel serverseitig mit Rollen, sicheren Sitzungen und einem vollständigen manuellen WCAG-Test geschützt.</p></section>
        <section><h2>Feedback</h2><p>Wenn Sie eine Barriere feststellen oder Informationen in einer anderen Form benötigen, kontaktieren Sie uns unter <a href="mailto:info@pflanzfarm.ch">info@pflanzfarm.ch</a> oder telefonisch unter <a href="tel:+41793361495">+41 79 336 14 95</a>.</p></section>
      </div>
    </main>
  )

  const Admin = () => {
    const sections: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
      { id: 'dashboard', label: 'Übersicht', icon: LayoutDashboard },
      { id: 'orders', label: 'Bestellungen', icon: ShoppingBag },
      { id: 'customers', label: 'Kundschaft', icon: Users },
      { id: 'products', label: 'Produkte', icon: Sprout },
      { id: 'inventory', label: 'Lager', icon: Box },
      { id: 'references', label: 'Referenzen', icon: FileText },
      { id: 'popup', label: 'Website-Popup', icon: PanelTop },
      { id: 'newsletter', label: 'Newsletter', icon: Mail },
    ]
    const StatusPill = ({ children, variant = 'green' }: { children: string; variant?: string }) => <span className={`status-pill status-pill--${variant}`}>{children}</span>
    return <main id="main-content" tabIndex={-1} className="admin-shell"><aside className="admin-sidebar"><BrandMark compact onActivate={() => goTo('home')} /><span className="admin-sidebar__label">Verwaltung</span><nav>{sections.map((section) => { const Icon = section.icon; return <button key={section.id} className={adminSection === section.id ? 'active' : ''} onClick={() => setAdminSection(section.id)}><Icon size={19} /> {section.label}</button> })}</nav><div className="admin-sidebar__footer"><button onClick={() => goTo('home')}><ExternalLink size={16} /> Website ansehen</button><span>Prototyp · Demo-Modus</span></div></aside><section className="admin-main"><header className="admin-topbar"><label className="admin-search"><Search size={18} /><input placeholder="Produkte, Bestellungen, Kundschaft …" /></label><div><button className="icon-button" aria-label="Verwaltungseinstellungen öffnen" onClick={() => setToast('Verwaltungseinstellungen werden im produktiven Laravel-Backend verfügbar.') }><Settings2 size={19} /></button><span className="admin-user"><i>MK</i><b>Martina Keller<small>Administratorin</small></b><ChevronDown size={16} /></span></div></header><div className="admin-content">{adminSection === 'dashboard' && <><div className="admin-intro"><div><span className="eyebrow">Dienstag, 27. Mai</span><h1>Guten Morgen, Martina</h1><p>Hier ist Ihr Überblick für heute.</p></div><button className="button button--dark" onClick={() => setAdminSection('products')}><PackagePlus size={18} /> Produkt erfassen</button></div><div className="metric-grid"><Metric icon={<CircleDollarSign />} label="Umsatz heute" value="CHF 1’284" trend="+ 12 %" /><Metric icon={<ShoppingBag />} label="Neue Bestellungen" value="12" trend="+ 33 %" /><Metric icon={<AlertTriangle />} label="Niedriger Bestand" value="5" trend="2 neu" warning /><Metric icon={<FileText />} label="Offene Anfragen" value="3" trend="heute" /></div><div className="admin-two-col"><section className="admin-card chart-card"><div className="admin-card__header"><div><h2>Umsatzentwicklung</h2><p>Letzte 7 Tage</p></div><select><option>Letzte 7 Tage</option></select></div><div className="chart"><div className="chart__axis"><span>2’000</span><span>1’000</span><span>0</span></div><div className="chart__bars">{[28, 39, 59, 49, 73, 56, 84].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><small>{20 + index}. Mai</small></div>)}</div></div></section><section className="admin-card stock-card"><div className="admin-card__header"><div><h2>Lagerhinweise</h2><p>Jetzt prüfen</p></div><button className="text-link">Alle <ArrowRight size={15} /></button></div>{products.map((product, index) => <div className="stock-row" key={product.id}><img src={assetUrl(product.image)} alt="" /><div><strong>{product.name}</strong><span>{index === 0 ? '12 Stück auf Lager' : `${product.stock} Stück auf Lager`}</span></div><StatusPill variant={index === 1 ? 'amber' : 'red'}>{index === 1 ? 'Fast ausverkauft' : 'Niedriger Bestand'}</StatusPill></div>)}</section></div><section className="admin-card orders-card"><div className="admin-card__header"><div><h2>Neueste Bestellungen</h2><p>Aus dem Shop</p></div><button className="text-link" onClick={() => setAdminSection('orders')}>Alle Bestellungen <ArrowRight size={15} /></button></div><table><thead><tr><th>Bestellnummer</th><th>Kunde</th><th>Produkte</th><th>Total</th><th>Status</th></tr></thead><tbody>{[['#PF-2026-1042', 'Sandro Meier', '3', 'CHF 89.70', 'Bezahlt'], ['#PF-2026-1041', 'Claudia Baumann', '5', 'CHF 124.50', 'In Bearbeitung'], ['#PF-2026-1040', 'Lukas Steiner', '4', 'CHF 214.20', 'Abholung bereit']].map((order) => <tr key={order[0]}>{order.map((value, index) => <td key={index}>{index === 4 ? <StatusPill variant={value === 'In Bearbeitung' ? 'blue' : 'green'}>{value}</StatusPill> : value}</td>)}</tr>)}</tbody></table></section></>}{adminSection === 'products' && <AdminProducts products={products} onAdd={() => setToast('Produktformular ist im Laravel-Backend vorgesehen.')} />}{adminSection === 'orders' && <AdminOrders StatusPill={StatusPill} />}{adminSection === 'customers' && <AdminCustomers customers={customers} selectedId={selectedCustomerId} onSelect={setSelectedCustomerId} StatusPill={StatusPill} onUpdate={(id, changes) => setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, ...changes } : customer))} onSaved={() => setToast('Kontaktdaten der Kundschaft gespeichert (Demo).')} />}{adminSection === 'inventory' && <AdminInventory products={products} StatusPill={StatusPill} />}{adminSection === 'references' && <AdminReferences />}{adminSection === 'newsletter' && <AdminNewsletter newsletter={newsletter} onChange={updateNewsletter} onSave={() => setToast('Newsletter-Entwurf gespeichert (Demo).')} onTest={() => setToast('Demo-Modus: Ein Resend-Testversand wird erst im Laravel-Backend ausgelöst.')} onSend={() => setToast('Demo-Modus: Keine E-Mail gesendet. Der Produktivversand erfolgt serverseitig über Resend.')} />}{adminSection === 'popup' && <div className="popup-admin"><div className="admin-intro"><div><span className="eyebrow">Website-Inhalt</span><h1>Popup verwalten</h1><p>Steuern Sie saisonale Hinweise und Kampagnen direkt im Shop.</p></div><span className={popup.active ? 'live-status' : 'live-status live-status--off'}><i /> {popup.active ? 'Aktiv' : 'Inaktiv'}</span></div><div className="popup-admin__layout"><section className="admin-card popup-form"><div className="admin-card__header"><div><h2>Inhalt & Ausspielung</h2><p>Änderungen erscheinen in der Vorschau.</p></div><PanelTop size={20} /></div><div className="popup-toggle-card"><div><h3>Popup aktiv</h3><p>Auf der Website anzeigen.</p></div><label className="popup-toggle-control"><input type="checkbox" aria-label="Popup aktivieren" checked={popup.active} onChange={(event) => updatePopup('active', event.target.checked)} /><span className="popup-toggle-control__track" aria-hidden="true" /><span className="popup-toggle-control__state">{popup.active ? 'Aktiv' : 'Aus'}</span></label></div><label>Titel<input value={popup.title} onChange={(event) => updatePopup('title', event.target.value)} /></label><label>Text<textarea rows={4} value={popup.text} onChange={(event) => updatePopup('text', event.target.value)} /></label><div className="form-two"><label>Button-Text<input value={popup.cta} onChange={(event) => updatePopup('cta', event.target.value)} /></label><label>Zielseite<select value={popup.target} onChange={(event) => updatePopup('target', event.target.value as PopupTarget)}><option value="startseite">Startseite</option><option value="shop">Shop</option><option value="alle">Alle Seiten</option></select></label></div><div className="form-two"><label>Verzögerung<select value={popup.delay} onChange={(event) => updatePopup('delay', Number(event.target.value))}><option value={0}>Sofort</option><option value={1}>1 Sekunde</option><option value={3}>3 Sekunden</option></select></label><label>Häufigkeit<select value={popup.frequency} onChange={(event) => updatePopup('frequency', event.target.value as PopupFrequency)}><option value="einmalig">Einmalig</option><option value="sitzung">Einmal pro Sitzung</option><option value="taeglich">Einmal pro Tag</option><option value="immer">Bei jedem Besuch</option></select></label></div><div className="form-two"><label>Startdatum<input type="date" value={popup.startsAt} onChange={(event) => updatePopup('startsAt', event.target.value)} /></label><label>Enddatum<input type="date" value={popup.endsAt} onChange={(event) => updatePopup('endsAt', event.target.value)} /></label></div><div className="popup-form__footer"><button className="button button--soft" onClick={() => setToast('Entwurf ist gespeichert (Demo).')}><FileText size={17} /> Entwurf speichern</button><button className="button button--dark" onClick={openPopupPreview}><Eye size={17} /> Im Frontend testen</button></div></section><aside className="admin-card popup-analytics"><span className="eyebrow">Aktuelle Kampagne</span><h2>{popup.title || 'Ohne Titel'}</h2><div className="mini-popup"><span className="mini-popup__close" aria-hidden="true"><X size={15} /></span><Leaf size={24} /><strong>{popup.title || 'Ihr Popup-Titel'}</strong><p>{popup.text || 'Ihr Beschreibungstext erscheint hier.'}</p><span>{popup.cta || 'Button-Text'} <ArrowRight size={14} /></span></div><hr /><div className="analytics-grid"><div><span>Einblendungen</span><b>1’284</b></div><div><span>Klickrate</span><b>8.6 %</b></div><div><span>Schliessungen</span><b>73 %</b></div><div><span>Zeitraum</span><b>15.09.–30.11.</b></div></div><div className="popup-rule"><Clock3 size={18} /><p><b>Regel:</b> {popup.frequency === 'sitzung' ? 'Einmal pro Sitzung' : popup.frequency === 'taeglich' ? 'Einmal pro Tag' : popup.frequency === 'einmalig' ? 'Einmalig' : 'Bei jedem Besuch'} · {popup.target === 'startseite' ? 'Nur Startseite' : popup.target === 'shop' ? 'Nur Shop' : 'Alle Seiten'}</p></div></aside></div></div>}</div></section></main>
  }

  return (
    <>
      <div className={view === 'admin' ? 'app app--admin' : 'app'}>
        {view !== 'admin' && <a className="skip-link" href="#main-content">Zum Inhalt springen</a>}
        {view === 'admin' ? <Admin /> : <>
          <Header />
          {view === 'home' && <Home />}
          {view === 'shop' && <Shop />}
          {view === 'product' && <ProductDetail />}
          {view === 'references' && <References />}
          {view === 'about' && <About />}
          {view === 'cart' && <Cart />}
          {view === 'privacy' && <Privacy />}
          {view === 'imprint' && <Imprint />}
          {view === 'accessibility' && <Accessibility />}
          <footer className="site-footer" aria-label="Fussbereich">
            <div className="container">
              <div><BrandMark compact onActivate={() => goTo('home')} /><p>Robuste Pflanzen und persönliche Gartenkompetenz aus der Schweiz.</p></div>
              <div><span>Shop</span><button onClick={() => goTo('shop')}>Alle Pflanzen</button><button onClick={() => goTo('cart')}>Warenkorb</button><button onClick={() => goTo('references')}>Referenzen</button></div>
              <div><span>Service</span><button onClick={() => goTo('references')}>Gartenprojekt</button><button onClick={() => goTo('about')}>Über uns</button><button onClick={() => setToast('Kontakt im finalen Shop.')}>Kontakt</button><button onClick={() => goTo('admin')}>Verwaltung (Demo)</button></div>
              <div><span>Kontakt</span><p>Untergretti 2<br />6245 Ebersecken</p><p><a href="mailto:info@pflanzfarm.ch">info@pflanzfarm.ch</a></p><SocialLinks /></div>
            </div>
            <div className="container site-footer__bottom"><span>© 2026 Pflanzfarm · Interaktiver Prototyp</span><div className="footer-legal-links"><button onClick={() => goTo('privacy')}>Datenschutz</button><button onClick={() => goTo('imprint')}>Impressum</button><button onClick={() => goTo('accessibility')}>Barrierefreiheit</button><button onClick={openConsentSettings}>Cookie-Einstellungen</button></div></div>
          </footer>
        </>}
      </div>
      {popupVisible && popupMatchesView && (
        <div className="popup-backdrop" role="presentation">
          <section ref={popupDialogRef} tabIndex={-1} className="campaign-popup" role="dialog" aria-modal="true" aria-label="Aktuelles Angebot">
            <button className="popup-close" onClick={closePopup} aria-label="Popup schliessen"><X size={20} /></button>
            <div className="campaign-popup__image"><img src={assetUrl('/assets/pflanzfarm-garten-3.jpg')} srcSet={assetSourceSet('/assets/pflanzfarm-garten-3-640.webp 640w, /assets/pflanzfarm-garten-3-1280.webp 1280w')} sizes="(max-width: 760px) 92vw, 420px" loading="lazy" decoding="async" alt="" /></div>
            <div className="campaign-popup__content">
              <span className="eyebrow">Pflanzfarm aktuell</span>
              <h2>{popup.title}</h2>
              <p>{popup.text}</p>
              <button className="button button--primary button--full" onClick={() => { closePopup(); goTo('shop') }}>{popup.cta} <ArrowRight size={17} /></button>
              <button className="popup-skip" onClick={closePopup}>Jetzt nicht, danke</button>
            </div>
          </section>
        </div>
      )}
      {consentDialogOpen && <div className="consent-backdrop"><section ref={consentDialogRef} tabIndex={-1} className="consent-dialog" role="dialog" aria-modal="true" aria-labelledby="consent-title"><div><span className="consent-dialog__eyebrow">Ihre Privatsphäre</span><h2 id="consent-title">Datenschutz für Ihren Besuch.</h2><p>Wir nutzen keine Analyse- oder Marketing-Cookies. Optional können wir nur merken, ob ein saisonaler Hinweis bereits angezeigt wurde.</p></div><label className="consent-option"><span><b>Optionale Funktionsspeicherung</b><small>Wenn Sie zustimmen, merken wir ausschliesslich die Häufigkeit saisonaler Hinweise. Ohne Zustimmung speichern wir dafür nichts Optionales.</small></span><input type="checkbox" checked={preferenceDraft} onChange={(event) => setPreferenceDraft(event.target.checked)} /></label><div className="consent-dialog__actions"><button autoFocus className="button consent-dialog__choice" onClick={() => saveConsent(false)}>Nur notwendige Einstellungen</button><button className="button consent-dialog__choice" onClick={() => saveConsent(preferenceDraft)}>Auswahl speichern</button></div><button className="text-link" onClick={() => { setConsentDialogOpen(false); goTo('privacy') }}>Datenschutz lesen <ArrowRight size={16} /></button></section></div>}
      {toast && <div className="toast" role="status" aria-live="polite"><Check size={18} /> {toast}</div>}
    </>
  )
}

function Metric({ icon, label, value, trend, warning = false }: { icon: ReactNode; label: string; value: string; trend: string; warning?: boolean }) {
  return <article className={`metric-card ${warning ? 'metric-card--warning' : ''}`}><span className="metric-card__icon">{icon}</span><span>{label}</span><strong>{value}</strong><small>{warning ? <AlertTriangle size={13} /> : <ArrowUpRight size={13} />}{trend} im Vergleich zu gestern</small></article>
}

function AdminProducts({ products, onAdd }: { products: Product[]; onAdd: () => void }) {
  return <><div className="admin-intro"><div><span className="eyebrow">Sortiment</span><h1>Produkte</h1><p>Pflegen Sie Pflanzen, Varianten, Preise und Verfügbarkeiten.</p></div><button className="button button--dark" onClick={onAdd}><PackagePlus size={18} /> Neues Produkt</button></div><section className="admin-card data-card"><div className="admin-card__header"><div><h2>Alle Produkte</h2><p>3 von 11 Artikeln</p></div><label className="admin-search admin-search--small"><Search size={17} /><input placeholder="Produkt suchen" /></label></div><table><thead><tr><th>Produkt</th><th>Kategorie</th><th>Preis</th><th>Bestand</th><th>Status</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td className="product-table"><img src={assetUrl(product.image)} alt="" /><span><b>{product.name}</b><small>{product.latin}</small></span></td><td>{product.category}</td><td>{money(product.price)}</td><td>{product.stock} Stück</td><td><span className="status-pill status-pill--green">Veröffentlicht</span></td></tr>)}</tbody></table></section></>
}

function AdminOrders({ StatusPill }: { StatusPill: ({ children, variant }: { children: string; variant?: string }) => ReactElement }) {
  return <><div className="admin-intro"><div><span className="eyebrow">Fulfillment</span><h1>Bestellungen</h1><p>12 neue Bestellungen warten auf die Bearbeitung.</p></div><button className="button button--soft"><FileText size={18} /> Exportieren</button></div><section className="admin-card data-card"><div className="admin-card__header"><div><h2>Alle Bestellungen</h2><p>Mai 2026</p></div><div className="filter-pills"><button className="active">Alle</button><button>Bezahlt</button><button>In Bearbeitung</button></div></div><table><thead><tr><th>Bestellnummer</th><th>Datum</th><th>Kunde</th><th>Total</th><th>Status</th></tr></thead><tbody>{[['#PF-2026-1042', '27.05.2026 · 09:14', 'Sandro Meier', 'CHF 89.70', 'Bezahlt'], ['#PF-2026-1041', '26.05.2026 · 16:42', 'Claudia Baumann', 'CHF 124.50', 'In Bearbeitung'], ['#PF-2026-1040', '26.05.2026 · 12:03', 'Lukas Steiner', 'CHF 214.20', 'Abholung bereit'], ['#PF-2026-1039', '25.05.2026 · 09:10', 'Nina Graf', 'CHF 159.20', 'Bezahlt']].map((order) => <tr key={order[0]}>{order.map((value, index) => <td key={index}>{index === 4 ? <StatusPill variant={value === 'In Bearbeitung' ? 'blue' : value === 'Abholung bereit' ? 'amber' : 'green'}>{value}</StatusPill> : value}</td>)}</tr>)}</tbody></table></section></>
}

function AdminCustomers({ customers, selectedId, onSelect, StatusPill, onUpdate, onSaved }: { customers: Customer[]; selectedId: string; onSelect: (id: string) => void; StatusPill: ({ children, variant }: { children: string; variant?: string }) => ReactElement; onUpdate: (id: string, changes: CustomerContactPatch) => void; onSaved: () => void }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(false)
  const selected = customers.find((customer) => customer.id === selectedId) ?? customers[0]
  const toDraft = (customer: Customer): CustomerContactPatch => ({ email: customer.email, phone: customer.phone, street: customer.street, postalCode: customer.postalCode, city: customer.city })
  const [draft, setDraft] = useState<CustomerContactPatch>(() => selected ? toDraft(selected) : { email: '', phone: '', street: '', postalCode: '', city: '' })
  const visibleCustomers = customers.filter((customer) => `${customer.name} ${customer.email} ${customer.city}`.toLowerCase().includes(query.toLowerCase()))
  const selectCustomer = (customer: Customer) => { onSelect(customer.id); setDraft(toDraft(customer)); setEditing(false) }
  const totalSpent = selected.orders.reduce((total, order) => total + order.total, 0)
  const statusVariant = (status: CustomerOrder['status']) => status === 'In Bearbeitung' ? 'blue' : status === 'Abholung bereit' ? 'amber' : 'green'

  return <section className="customers-admin">
    <div className="admin-intro"><div><span className="eyebrow">Admin-Bereich</span><h1>Verwaltung der Kundschaft</h1><p>Kontaktangaben und Bestellhistorien sind nur innerhalb der Administration einsehbar.</p></div><span className="live-status live-status--off"><i /> Demo-Daten</span></div>
    <div className="customer-privacy-note"><AlertTriangle size={18} /><p><b>Geschützter Bereich:</b> Diese Vorschau zeigt fiktive Demo-Daten. In der produktiven Laravel-Version dürfen ausschliesslich Personen mit der Rolle <code>admin</code> auf Kundendaten zugreifen.</p></div>
    <div className="customers-admin__layout">
      <section className="admin-card customer-directory"><div className="customer-directory__head"><div><h2>Kundschaft</h2><p>{customers.length} Personen im Demo-Bestand</p></div><label className="admin-search admin-search--small"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name oder Ort suchen" /></label></div><div className="customer-list">{visibleCustomers.map((customer) => <button className={selected.id === customer.id ? 'customer-list__row active' : 'customer-list__row'} onClick={() => selectCustomer(customer)} key={customer.id}><span className="customer-avatar">{customer.initials}</span><span><b>{customer.name}</b><small>{customer.city} · {customer.orders.length} Bestellung{customer.orders.length === 1 ? '' : 'en'}</small></span><ChevronRight size={17} /></button>)}{visibleCustomers.length === 0 && <p className="customer-list__empty">Keine Person gefunden.</p>}</div></section>
      <section className="admin-card customer-profile"><div className="customer-profile__head"><div className="customer-profile__identity"><span className="customer-avatar customer-avatar--large">{selected.initials}</span><div><h2>{selected.name}</h2><p>Seit {selected.joinedAt} im Shop</p></div></div><button className="button button--soft" onClick={() => { if (editing) { onUpdate(selected.id, draft); onSaved(); setEditing(false) } else { setDraft(toDraft(selected)); setEditing(true) } }}>{editing ? <><Save size={16} /> Speichern</> : <><Settings2 size={16} /> Bearbeiten</>}</button></div>
        <div className="customer-stats"><div><span>Bestellungen</span><b>{selected.orders.length}</b></div><div><span>Gesamtumsatz</span><b>{money(totalSpent)}</b></div><div><span>Letzte Bestellung</span><b>{selected.orders[0]?.date ?? '–'}</b></div></div>
        <div className="customer-profile__content"><section><div className="customer-section-title"><h3>Kontaktangaben</h3>{editing && <span>Bearbeitungsmodus</span>}</div><div className="customer-contact-grid"><label>E-Mail{editing ? <input type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /> : <a href={`mailto:${selected.email}`}>{selected.email}</a>}</label><label>Telefon{editing ? <input type="tel" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} /> : <a href={`tel:${selected.phone.replaceAll(' ', '')}`}>{selected.phone}</a>}</label><label>Strasse{editing ? <input value={draft.street} onChange={(event) => setDraft((current) => ({ ...current, street: event.target.value }))} /> : <span>{selected.street}</span>}</label><label>PLZ / Ort{editing ? <div className="customer-postal"><input value={draft.postalCode} onChange={(event) => setDraft((current) => ({ ...current, postalCode: event.target.value }))} /><input value={draft.city} onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))} /></div> : <span>{selected.postalCode} {selected.city}</span>}</label></div></section>
          <section className="customer-communication"><div><h3>Kommunikation</h3><p>Newsletter-Einwilligung</p></div><StatusPill variant={selected.marketingConsent ? 'green' : 'amber'}>{selected.marketingConsent ? 'Bestätigt' : 'Nicht erteilt'}</StatusPill></section>
          <section className="customer-note"><h3>Interne Notiz</h3><p>{selected.note}</p></section>
          <section className="customer-history"><div className="customer-section-title"><h3>Bestellhistorie</h3><span>{selected.orders.length} Einträge</span></div><div className="customer-history__table"><table><thead><tr><th>Bestellung</th><th>Datum</th><th>Inhalt</th><th>Total</th><th>Status</th></tr></thead><tbody>{selected.orders.map((order) => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.date}</td><td>{order.items}</td><td>{money(order.total)}</td><td><StatusPill variant={statusVariant(order.status)}>{order.status}</StatusPill></td></tr>)}</tbody></table></div></section>
        </div>
      </section>
    </div>
  </section>
}

function AdminInventory({ products, StatusPill }: { products: Product[]; StatusPill: ({ children, variant }: { children: string; variant?: string }) => ReactElement }) {
  return <><div className="admin-intro"><div><span className="eyebrow">Warenfluss</span><h1>Lager</h1><p>Behalten Sie Verfügbarkeiten und Nachbestellungen im Blick.</p></div><button className="button button--dark"><Box size={18} /> Lagerkorrektur</button></div><div className="metric-grid"><Metric icon={<Box />} label="Lagerwert" value="CHF 18’420" trend="aktuell" /><Metric icon={<AlertTriangle />} label="Niedriger Bestand" value="5" trend="2 neu" warning /><Metric icon={<PackageCheck />} label="Verfügbar" value="94 %" trend="+ 4 %" /><Metric icon={<Truck />} label="Offene Lieferungen" value="8" trend="heute" /></div><section className="admin-card data-card"><div className="admin-card__header"><div><h2>Bestandswarnungen</h2><p>Unter dem Mindestbestand</p></div><button className="text-link">Alle Bewegungen <ArrowRight size={15} /></button></div>{products.map((product, index) => <div className="inventory-row" key={product.id}><img src={assetUrl(product.image)} alt="" /><span><b>{product.name}</b><small>SKU PF-{100 + index}</small></span><span className="inventory-row__count">{product.stock} <small>Stück verfügbar</small></span><div className="inventory-bar"><i style={{ width: `${Math.min(product.stock * 3, 100)}%` }} /></div><StatusPill variant={index === 0 ? 'amber' : 'red'}>{index === 0 ? 'Prüfen' : 'Nachbestellen'}</StatusPill></div>)}</section></>
}

function AdminNewsletter({ newsletter, onChange, onSave, onTest, onSend }: { newsletter: NewsletterDraft; onChange: NewsletterUpdate; onSave: () => void; onTest: () => void; onSend: () => void }) {
  const selectedImage = newsletterImageOptions.find((image) => image.value === newsletter.image)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const triggerFilePicker = () => fileInputRef.current?.click()
  const chooseLibraryImage = (value: string) => {
    const image = newsletterImageOptions.find((item) => item.value === value)
    onChange('image', value)
    if (image) onChange('imageAlt', image.alt)
    setUploadMessage(image ? `${image.label} wurde als Bildblock ausgewählt.` : '')
  }
  const acceptImageFile = (file?: File) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadMessage('Bitte wählen Sie eine Bilddatei im Format JPG, PNG oder WebP aus.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage('Die Bilddatei ist grösser als 5 MB. Bitte wählen Sie eine kleinere Datei aus.')
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') return
      onChange('image', reader.result)
      onChange('imageAlt', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '))
      setUploadMessage(`${file.name} wurde für die lokale Vorschau hinzugefügt.`)
    })
    reader.readAsDataURL(file)
  }

  return <div className="newsletter-admin">
    <div className="admin-intro">
      <div><span className="eyebrow">Kommunikation</span><h1>Newsletter</h1><p>Gestalten Sie Inhalte im festen Pflanzfarm-Layout und prüfen Sie sie vor dem Versand.</p></div>
      <span className="live-status live-status--off"><i /> Entwurf</span>
    </div>
    <section className="newsletter-resend-note" aria-label="Resend-Produktivhinweis"><Mail size={20} /><div><b>Resend in der Produktivphase</b><p>Die Vorschau sendet keine E-Mails. Test- und Kampagnenversand werden später ausschliesslich serverseitig über Laravel und Resend ausgeführt.</p></div></section>
    <div className="newsletter-admin__layout">
      <section className="admin-card newsletter-editor">
        <div className="admin-card__header"><div><h2>Inhalt bearbeiten</h2><p>Markenstruktur und Fussbereich bleiben fest; Inhalt und Links sind frei bearbeitbar.</p></div><FileText size={20} /></div>
        <div className="newsletter-editor__group">
          <h3>Versand</h3>
          <label>Betreff<input value={newsletter.subject} onChange={(event) => onChange('subject', event.target.value)} /></label>
          <label>Preheader<input value={newsletter.preheader} onChange={(event) => onChange('preheader', event.target.value)} /></label>
          <div className="form-two"><label>Absendername<input value={newsletter.fromName} onChange={(event) => onChange('fromName', event.target.value)} /></label><label>Antwortadresse<input type="email" value={newsletter.replyTo} onChange={(event) => onChange('replyTo', event.target.value)} /></label></div>
          <label>Empfangsgruppe<select value={newsletter.audience} onChange={(event) => onChange('audience', event.target.value)}><option>Personen mit bestätigter Einwilligung</option><option>Letzte Newsletter-Anmeldungen</option><option>Personen mit Interesse an Heckenpflanzen</option></select></label>
        </div>
        <div className="newsletter-editor__group">
          <h3>Inhaltsblöcke</h3>
          <label>Überschrift<input value={newsletter.headline} onChange={(event) => onChange('headline', event.target.value)} /></label>
          <label>Text<textarea rows={5} value={newsletter.body} onChange={(event) => onChange('body', event.target.value)} /></label>
          <section className="newsletter-image-block" aria-labelledby="newsletter-image-title">
            <div className="newsletter-image-block__header"><div><span>Bildblock</span><h4 id="newsletter-image-title">Bild hinzufügen</h4></div>{newsletter.image && <button type="button" className="newsletter-image-block__remove" onClick={() => { onChange('image', ''); onChange('imageAlt', ''); setUploadMessage('Bildblock entfernt.') }}>Entfernen</button>}</div>
            <input ref={fileInputRef} className="newsletter-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { acceptImageFile(event.target.files?.[0]); event.currentTarget.value = '' }} />
            <div className={`newsletter-image-dropzone ${isDraggingImage ? 'newsletter-image-dropzone--active' : ''}`} role="button" tabIndex={0} aria-label="Bild per Drag-and-drop oder Dateiauswahl hinzufügen" onClick={triggerFilePicker} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); triggerFilePicker() } }} onDragEnter={(event) => { event.preventDefault(); setIsDraggingImage(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setIsDraggingImage(false)} onDrop={(event) => { event.preventDefault(); setIsDraggingImage(false); acceptImageFile(event.dataTransfer.files?.[0]) }}>
              <span className="newsletter-image-dropzone__icon"><Image size={22} /><Plus size={13} /></span><strong>Bild hier ablegen</strong><span>oder vom Computer auswählen</span><small>JPG, PNG oder WebP · maximal 5 MB · nur lokale Vorschau</small>
            </div>
            {uploadMessage && <p className="newsletter-image-upload-message" role="status">{uploadMessage}</p>}
            <div className="newsletter-image-library"><label>Aus Pflanzenbibliothek auswählen<select value={selectedImage ? newsletter.image : ''} onChange={(event) => chooseLibraryImage(event.target.value)}><option value="">Motiv auswählen</option>{newsletterImageOptions.map((image) => <option value={image.value} key={image.value}>{image.label}</option>)}</select></label>{newsletter.image && <div className="newsletter-image-preview"><img src={assetUrl(newsletter.image)} alt={newsletter.imageAlt || ''} /><div><b>Bildvorschau</b><span>{selectedImage?.label ?? 'Eigenes Bild aus lokaler Vorschau'}</span></div></div>}</div>
            <label>Alternativtext<input value={newsletter.imageAlt} onChange={(event) => onChange('imageAlt', event.target.value)} placeholder="Bildinhalt für Screenreader beschreiben" /></label>
          </section>
          <div className="form-two"><label>Button-Text<input value={newsletter.ctaLabel} onChange={(event) => onChange('ctaLabel', event.target.value)} /></label><label>Ziel-URL<input type="url" value={newsletter.ctaUrl} onChange={(event) => onChange('ctaUrl', event.target.value)} placeholder="https://…" /></label></div>
          <div className="newsletter-toggle-card"><div><h4>Zusatzblock</h4><p>Weitere Informationen zwischen dem Call-to-Action und dem Fussbereich anzeigen.</p></div><label className="newsletter-toggle-control"><input type="checkbox" checked={newsletter.showExtraBlock} onChange={(event) => onChange('showExtraBlock', event.target.checked)} /><span className="newsletter-toggle-control__track" aria-hidden="true" /><span className="newsletter-toggle-control__state">{newsletter.showExtraBlock ? 'Aktiv' : 'Aus'}</span></label></div>
          {newsletter.showExtraBlock && <label>Zusatztext<textarea rows={3} value={newsletter.extraText} onChange={(event) => onChange('extraText', event.target.value)} /></label>}
        </div>
        <div className="newsletter-editor__footer"><button className="button button--soft" onClick={onSave}><Save size={17} /> Entwurf speichern</button><button className="button button--soft" onClick={onTest}><Mail size={17} /> Testversand</button><button className="button button--dark" onClick={onSend}><Send size={17} /> Kampagne senden</button></div>
      </section>
      <aside className="newsletter-preview-panel">
        <div className="newsletter-preview-panel__header"><div><span>Live-Vorschau</span><b>E-Mail · Desktop</b></div><Eye size={19} /></div>
        <article className="email-preview" aria-label="Newsletter-Vorschau">
          <header className="email-preview__brand"><img src={assetUrl('/assets/pflanzfarm-logo.webp')} alt="Pflanzfarm" /><span>{newsletter.fromName || 'Pflanzfarm'}</span></header>
          <div className="email-preview__content"><p className="email-preview__preheader">{newsletter.preheader || 'Ihr Preheader erscheint hier.'}</p><h2>{newsletter.headline || 'Ihre Überschrift'}</h2><p>{newsletter.body || 'Ihr Text erscheint hier.'}</p>{newsletter.image && <img src={assetUrl(newsletter.image)} alt={newsletter.imageAlt} />}<a href={newsletter.ctaUrl || '#'} onClick={(event) => event.preventDefault()}>{newsletter.ctaLabel || 'Button-Text'} <ArrowRight size={15} /></a>{newsletter.showExtraBlock && <section className="email-preview__extra"><h3>Persönlich beraten</h3><p>{newsletter.extraText || 'Ihr Zusatztext erscheint hier.'}</p></section>}</div>
          <footer className="email-preview__footer"><p>Pflanzfarm · Untergretti 2 · 6245 Ebersecken</p><p>Sie erhalten diese E-Mail, weil Sie dem Empfang zugestimmt haben.</p><button onClick={(event) => event.preventDefault()}>Abmelden</button></footer>
        </article>
        <div className="newsletter-preview-panel__meta"><span><Image size={16} /> Bildblock</span><span><Link2 size={16} /> CTA-Link</span><span><Mail size={16} /> Resend bereit</span></div>
      </aside>
    </div>
  </div>
}

function AdminReferences() {
  return <><div className="admin-intro"><div><span className="eyebrow">Inhalte</span><h1>Referenzen</h1><p>Zeigen Sie Projekte, die Vertrauen schaffen und neue Anfragen auslösen.</p></div><button className="button button--dark"><FileText size={18} /> Neue Referenz</button></div><div className="reference-admin-grid">{projectCards.map((project, index) => <article className="admin-card admin-reference" key={project.title}>{project.image ? <img src={assetUrl(project.image)} alt="" /> : <div className={`admin-reference__placeholder admin-reference__placeholder--${index}`}><Leaf size={37} /></div>}<div><span className="status-pill status-pill--green">Veröffentlicht</span><h2>{project.title}</h2><p>{project.category} · Kanton Luzern</p><div><button className="text-link">Bearbeiten <ArrowRight size={15} /></button><span>Auf Startseite</span></div></div></article>)}</div></>
}

createRoot(document.getElementById('root')!).render(<App />)
