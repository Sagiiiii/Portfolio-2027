// Encabezado "eyebrow + TÍTULO" con las animaciones de scroll
export default function SectionHeading({ eyebrow, title, align = 'center', className = '' }) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p data-anim="fade" className="eyebrow mb-3">
          {eyebrow}
        </p>
      )}
      <h2 data-anim="heading" className="title-xl">
        {title}
      </h2>
    </div>
  )
}
