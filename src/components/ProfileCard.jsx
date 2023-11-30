import React from 'react';
import '../styles/ProfileCard.css';
import Description from './Description';

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <div className="seccion-superior">
        <div className="imagen-fondo" style={{ backgroundImage: 'url("https://www.elaltoesnoticia.com/wp-content/uploads/2017/10/fodo-verde.jpg")' }} />
      </div>
      <div className="contenedor-imagen-perfil">
        <div className="imagen-perfil" />
      </div>
      <div className="seccion-inferior">
        <Description />
      </div>
    </div>
  );
}

export default ProfileCard;

