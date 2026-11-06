export default function Description({ children = 'Sin descripción disponible.' }) {
  return <p className="contenedor-descripcion">{children || 'Sin descripción disponible.'}</p>;
}
