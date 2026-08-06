import { useAcademy } from '../context/DataContext.jsx';
import './Footer.css';

export default function Footer() {
  const { data } = useAcademy();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>{data.site.footerNote}</span>
        <span className="footer-dot">·</span>
        <span>Built from the SharePoint design guide</span>
      </div>
    </footer>
  );
}
