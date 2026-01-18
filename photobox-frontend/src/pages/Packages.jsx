import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function Packages() {
  return (
    <Container>
      <div className="row space">
        <div>
          <h1>Packages</h1>
          <p className="muted">Pilih paket sesuai event. Harga/benefit bisa kamu edit.</p>
        </div>

        <Link className="btn" to="/booking?package=Standard">
          Book Now
        </Link>
      </div>

      <div className="cards" style={{ marginTop: 12 }}>
        {/* BASIC */}
        <div className="card">
          <div className="card-head">
            <h3 style={{ margin: 0 }}>Basic</h3>
            <span className="tag">Min 30m</span>
          </div>

          <p className="muted">Cocok untuk event kecil.</p>

          <ul className="list">
            <li>Custom durasi (min 30 menit)</li>
            <li>1 template frame</li>
            <li>Digital output</li>
          </ul>

          <div className="row space nowrap" style={{ marginTop: 12 }}>
            <div className="price">Rp 499k</div>
            <Link className="btn small" to="/booking?package=Basic">
              Pilih
            </Link>
          </div>
        </div>

        {/* STANDARD */}
        <div className="card">
          <div className="card-head">
            <h3 style={{ margin: 0 }}>Standard</h3>
            <span className="tag">Min 60m</span>
          </div>

          <p className="muted">Paling populer untuk event.</p>

          <ul className="list">
            <li>Custom durasi (min 60 menit)</li>
            <li>3 template frame</li>
            <li>Digital + basic print</li>
          </ul>

          <div className="row space nowrap" style={{ marginTop: 12 }}>
            <div className="price">Rp 899k</div>
            <Link className="btn small" to="/booking?package=Standard">
              Pilih
            </Link>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="card">
          <div className="card-head">
            <h3 style={{ margin: 0 }}>Premium</h3>
            <span className="tag">Min 90m</span>
          </div>

          <p className="muted">Untuk event besar & branding.</p>

          <ul className="list">
            <li>Custom durasi (min 90 menit)</li>
            <li>Unlimited template</li>
            <li>Print + operator</li>
          </ul>

          <div className="row space nowrap" style={{ marginTop: 12 }}>
            <div className="price">Rp 1.499k</div>
            <Link className="btn small" to="/booking?package=Premium">
              Pilih
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>FAQ singkat</h3>
        <div className="faq">
          <div>
            <div className="faq-q">Durasi booking bisa berapa lama?</div>
            <div className="muted">Bebas sesuai kebutuhan, tapi ada durasi minimal per paket.</div>
          </div>
          <div>
            <div className="faq-q">Gallery kok minta booking code?</div>
            <div className="muted">Supaya privasi terjaga. Hanya yang punya code bisa lihat foto.</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
