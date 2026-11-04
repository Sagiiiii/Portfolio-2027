import StackIcon from '../StackIcon'

// Escena nocturna del hero (todo CSS, sin imágenes): luna, estrellas,
// luz de lámpara, un editor que "escribe" código y logos flotando.
// Las capas con data-depth se mueven con el ratón (parallax) desde Hero.jsx

const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 55}%`,
  size: i % 5 === 0 ? 3 : 2,
  delay: `${(i % 7) * 0.45}s`,
}))

// Posiciones para los logos del stack (se usan en orden; máximo 10 visibles)
const SLOTS = [
  { pos: 'left-[8%] top-[22%]', depth: 0.8 },
  { pos: 'right-[9%] top-[48%]', depth: 1.1 },
  { pos: 'left-[12%] bottom-[30%]', depth: 0.6 },
  { pos: 'right-[20%] top-[16%]', depth: 0.5 },
  { pos: 'left-[26%] top-[7%]', depth: 0.9 },
  { pos: 'right-[22%] top-[60%]', depth: 0.7 },
  { pos: 'left-[3%] top-[52%]', depth: 1 },
  { pos: 'right-[3%] top-[26%]', depth: 0.65 },
  { pos: 'left-[21%] top-[58%]', depth: 0.85 },
  { pos: 'right-[38%] top-[5%]', depth: 0.55 },
]

const K = ({ c }) => <span className="text-[#c792ea]">{c}</span>
const S = ({ c }) => <span className="text-[#c3e88d]">'{c}'</span>
const P = ({ c }) => <span className="text-[#f78c6c]">{c}</span>

export default function HeroScene({ site }) {
  const { profile, hero } = site
  const stack = hero.stack ?? []
  const names = stack.map((s) => s.name).filter(Boolean)
  const shown = names.slice(0, 4)

  const lines = [
    <><K c="const" /> <span className="text-[#82aaff]">dev</span> = {'{'}</>,
    <>{'  '}<P c="name" />: <S c={profile.name} />,</>,
    <>{'  '}<P c="role" />: <S c={hero.role} />,</>,
    <>
      {'  '}<P c="stack" />: [
      {shown.map((s, i) => (
        <span key={`${s}-${i}`}>
          <S c={s} />
          {i < shown.length - 1 ? ', ' : ''}
        </span>
      ))}
      {names.length > shown.length && <span className="text-white/40">, …+{names.length - shown.length}</span>}],
    </>,
    <>{'  '}<P c="available" />: <span className="text-[#ff5370]">{String(profile.available)}</span>,</>,
    <>{'}'}</>,
    <></>,
    <><span className="text-[#82aaff]">dev</span>.<span className="text-[#ffcb6b]">build</span>(<S c={hero.codeAction || 'ideas'} />)</>,
  ]

  return (
    <div className="absolute inset-0 overflow-hidden bg-linear-to-b from-night-1 to-night-2">
      {/* Estrellas */}
      <div data-depth="0.2" className="absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
      </div>

      {/* Luna */}
      <div data-depth="0.35" className="absolute top-[9%] right-[12%]">
        <div className="scene-moon h-14 w-14 rounded-full bg-[#f4efe1] shadow-[0_0_60px_20px_rgba(244,239,225,0.18)] sm:h-20 sm:w-20" />
      </div>

      {/* Luz de lámpara */}
      <div
        className="scene-light absolute -top-[5%] left-[18%] h-[95%] w-[55%] origin-top bg-linear-to-b from-lamp/25 via-lamp/10 to-transparent"
        style={{ clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }}
      />

      {/* Mesa */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-b from-[#1d1e33] to-[#15162a]" />

      {/* Editor */}
      <div data-depth="0.6" className="absolute inset-x-0 top-[17%] flex justify-center px-4 sm:top-[14%]">
        <div className="scene-editor w-full max-w-[540px] overflow-hidden rounded-lg border border-white/10 bg-[#1b1c30]/95 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[10px] text-white/40 sm:text-xs">dev.js</span>
          </div>
          <pre className="overflow-hidden px-3 py-3 text-left font-mono text-[10px] leading-5 text-white/80 sm:px-4 sm:text-[13px] sm:leading-6">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-6 shrink-0 text-white/20 select-none">{i + 1}</span>
                <code className="code-line block whitespace-pre">
                  {line}
                  {i === lines.length - 1 && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-lamp sm:h-4" />}
                </code>
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Logos del stack flotando */}
      {stack.slice(0, SLOTS.length).map((item, i) => (
        <div key={`${item.name}-${i}`} data-depth={SLOTS[i].depth} className={`absolute hidden sm:block ${SLOTS[i].pos}`}>
          <div
            title={item.name}
            className="scene-chip float flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#1b1c30]/80 shadow-lg backdrop-blur"
          >
            <StackIcon item={item} />
          </div>
        </div>
      ))}
    </div>
  )
}
