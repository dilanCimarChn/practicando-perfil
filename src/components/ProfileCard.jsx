import { useState } from 'react';
import '../styles/ProfileCard.css';
import '../styles/Description.css';
import Description from './Description';
export default function ProfileCard({ name = 'Perfil de demostración', description, imageUrl }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const showImage = imageUrl && failedUrl !== imageUrl;
  return <article className="profile-card"><div className="seccion-superior" aria-hidden="true" />
    <div className="profile-avatar">{showImage
      ? <img src={imageUrl} alt={`Retrato de ${name}`} onError={() => setFailedUrl(imageUrl)} />
      : <span role="img" aria-label={`Perfil sin imagen: ${name}`}>{name.trim().slice(0, 1).toUpperCase() || '?'}</span>}</div>
    <div className="seccion-inferior"><h1>{name}</h1><Description>{description}</Description></div>
  </article>;
}
