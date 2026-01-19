import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

function Icon({ children }) {
  return <div className="lp-icon">{children}</div>;
}

export default function Home() {
  return (
    <div className="lp">
      <Container>
        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-hero-left">
            <div className="pill lp-pill">Sistem Photobox • Booking fleksibel • Gallery privat</div>
            
            <h1 className="lp-title">
              Where creative
              <br />
              process happens
            </h1>
            
            <p className="muted lp-sub">
              Booking online untuk pilih jam kosong, lalu foto tetap dilakukan di photobox coffeeshop.
              Setelah pembayaran, kamu dapat <b>ticket code</b> untuk membuka Camera & Gallery.
            </p>
            
            <div className="lp-cta">
              <Link className="btn" to="/booking">
                Book a Slot
              </Link>
              <Link className="btn ghost" to="/packages">
                Lihat Packages
              </Link>
            </div>
            
            {/* Small feature cards */}
            <div className="lp-mini-cards">
              <div className="lp-mini">
                <div className="lp-mini-title">Custom Durasi</div>
                <div className="muted">Start–end time bebas sesuai kebutuhan.</div>
              </div>
              <div className="lp-mini">
                <div className="lp-mini-title">Camera Locked</div>
                <div className="muted">Akses kamera hanya setelah input code.</div>
              </div>
              <div className="lp-mini">
                <div className="lp-mini-title">Gallery Privat</div>
                <div className="muted">Hanya pemilik booking code yang bisa lihat.</div>
              </div>
            </div>
          </div>
          
          {/* Hero collage right */}
          <div className="lp-hero-right">
            <div className="lp-collage">
              <div className="ph-img ph-img-lg" />
              <div className="ph-row">
                <div className="ph-img ph-img-sm" />
                <div className="ph-img ph-img-sm2" />
              </div>
              <div className="lp-floating">Preview</div>
            </div>
            
            <div className="lp-note card">
              <div className="muted" style={{ marginBottom: 8 }}>
                Quick access
              </div>
              <div className="lp-note-actions">
                <Link className="btn small ghost" to="/gallery">
                  Gallery
                </Link>
                <Link className="btn small" to="/camera">
                  Camera
                </Link>
              </div>
              <div className="muted" style={{ marginTop: 10 }}>
                Buka Camera pakai ticket code dari hasil booking/pembayaran.
              </div>
            </div>
          </div>
        </section>
        
        {/* WHY SECTION */}
        <section className="lp-split">
          <div className="lp-split-left">
            <div className="lp-mosaic">
              <div className="ph-img ph-tall" />
              <div className="lp-mosaic-stack">
                <div className="ph-img ph-square" />
                <div className="ph-img ph-square2" />
              </div>
            </div>
          </div>
          
          <div className="lp-split-right">
            <div className="lp-kicker">GET TO KNOW US</div>
            <h2 className="lp-h2">Why we make it happen</h2>
            <p className="muted">
              Experience photobox yang rapi, mudah dipakai, dan cocok buat coffeeshop.
              User bisa booking online untuk cek slot kosong, atau walk-in dan tetap pakai sistem ticket code.
            </p>
            <div className="lp-cta">
              <Link className="btn" to="/booking">
                Mulai Booking
              </Link>
              <Link className="btn ghost" to="/camera">
                Buka Camera
              </Link>
            </div>
          </div>
        </section>
        
        {/* WHY CHOOSE US */}
        <section className="lp-choose">
          <h2 className="lp-h2 center">Why choose us</h2>
          <div className="lp-choose-grid">
            <div className="lp-choose-item">
              <Icon>✨</Icon>
              <div className="lp-choose-title">Smooth Flow</div>
              <div className="muted">Booking → bayar → dapat code → foto → gallery.</div>
            </div>
            <div className="lp-choose-item">
              <Icon>⏱️</Icon>
              <div className="lp-choose-title">Slot Tersedia</div>
              <div className="muted">Cek jam kosong realtime, cocok untuk walk-in.</div>
            </div>
            <div className="lp-choose-item">
              <Icon>🔒</Icon>
              <div className="lp-choose-title">Private by Code</div>
              <div className="muted">Akses Camera/Gallery hanya dengan kode.</div>
            </div>
          </div>
        </section>
        
        {/* STATS + SHOWCASE */}
        <section className="lp-stats">
          <div className="lp-stats-card">
            <div className="lp-stats-media">
              <div className="ph-img ph-wide" />
              <div className="ph-img ph-wide2" />
            </div>
            
            <div>
              <h2 className="lp-h2">Experiments and personal projects.</h2>
              <p className="muted">
                Bisa dipakai untuk event kecil sampai besar. Sistem tetap aman karena akses kamera dibatasi code.
              </p>
              
              <div className="lp-kpis">
                <div className="lp-kpi">
                  <div className="lp-kpi-num">58+</div>
                  <div className="muted">Cafe Partners</div>
                </div>
                <div className="lp-kpi">
                  <div className="lp-kpi-num">38+</div>
                  <div className="muted">Rewards</div>
                </div>
                <div className="lp-kpi">
                  <div className="lp-kpi-num">98+</div>
                  <div className="muted">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* WORKS GRID */}
        <section className="lp-works">
          <div className="lp-works-head">
            <h2 className="lp-h2">Our Awesome Works</h2>
            <div className="muted">Contoh hasil foto yang tersimpan di gallery private.</div>
          </div>
          
          <div className="lp-works-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="lp-work ph-img" />
            ))}
          </div>
        </section>
        
        {/* CTA BANNER */}
        <section className="lp-banner">
          <div className="lp-banner-inner">
            <div>
              <div className="lp-banner-title">Get Started With Us</div>
              <div className="lp-banner-sub">
                Booking online untuk cek slot, atau langsung ke photobox dan pakai ticket code setelah bayar.
              </div>
              <div className="lp-cta" style={{ marginTop: 14 }}>
                <Link className="btn ghost" to="/booking">
                  Get in Touch
                </Link>
                <Link className="btn" to="/camera">
                  Open Camera
                </Link>
              </div>
            </div>
            
            <div className="lp-banner-art">
              <div className="lp-star" />
              <div className="lp-blob" />
            </div>
          </div>
        </section>
        
        <div className="muted" style={{ fontSize: 12, marginTop: 18, paddingBottom: 12 }}>
          © Photobox — prototype UI landing page
        </div>
      </Container>
    </div>
  );
}
