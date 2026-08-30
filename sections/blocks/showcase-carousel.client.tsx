'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ОСТРОВОК ВИТРИННОЙ КАРУСЕЛИ — ПЕРЕНОС ОДИН В ОДИН (шаг 53, 2026-08-30).
//
// 🔒 ФОРМА ВЗЯТА ИЗ ГОТОВОГО ИСХОДНИКА, А НЕ ПРИДУМАНА:
// `fractera-easy-starter/components/sections/loop-showcase.tsx`, 326 строк.
// Владелец назвал секцию по имени именно затем, чтобы её взяли из открытого кода.
// ✗ Оплачено: вид `carousel` (тот, что остаётся рядом) я сочинил сам — точки
// вместо номеров, без автоперехода, без блоков и стрелок. Работает, но заказано
// было не это.
//
// Что перенесено дословно: интервалы 5000/700 мс · блоки по три слайда · стрелки
// с переносом по кругу · кружки с номерами и знаком паузы · полоса прогресса,
// следующая за паузой · свечение по контуру после загрузки картинки · ленивая
// загрузка «текущий блок плюс следующий» · пауза при уходе секции из вида · три
// колонки подписей, где соседние размыты.
//
// 🔒 ЦВЕТА — ТОКЕНЫ ТЕМЫ, А НЕ ФИОЛЕТОВЫЙ ИСТОЧНИКА (решение владельца: «a»).
// У витрины чёрный фон и фиолетовый акцент; шаблон слота красят палитрой
// владельца. Буквальная копия сломала бы палитру каждого клиента, и её не
// пропустил бы ни `check:sections` («внутри секции только токены темы»), ни
// `check:contrast`. Меняется цвет — рисунок остаётся тот же.
//
// 🔒 ЗНАЧКОВ НЕТ ВОВСЕ, И ЭТО СЛЕДСТВИЕ ТОГО ЖЕ РЕШЕНИЯ. В источнике их ровно
// три (`Server · Globe · Rocket`) и они зашиты в код: витрина знает, что
// показывает. Каталог не знает — у него слайды про что угодно, и тройка значков,
// повторяющаяся по кругу, лгала бы о содержании. Место значка занимает подпись
// слайда, как и в источнике при отсутствии картинки.

const STEP_SWITCH_DURATION = 5000
const FADE_DURATION = 700
const SLIDES_PER_BLOCK = 3

export type ShowcaseSlide = {
  image?: string
  label: string
  sublabel: string
  title: string
  description: string
}

export function ShowcaseCarousel({ slides, placeholderNote }: { slides: ShowcaseSlide[]; placeholderNote: string }) {
  const totalSlides = slides.length
  const blockCount = Math.max(1, Math.ceil(totalSlides / SLIDES_PER_BLOCK))

  const sectionRef = useRef<HTMLDivElement>(null)
  const preloadStartedRef = useRef<Set<number>>(new Set())
  const [currentSlide, setCurrentSlide] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})

  const blockIndex = Math.floor(currentSlide / SLIDES_PER_BLOCK)
  const blockStart = blockIndex * SLIDES_PER_BLOCK
  const blockSlides = slides.slice(blockStart, blockStart + SLIDES_PER_BLOCK)
  const dotsCount = blockSlides.length

  const isAnimating = isInView && !isPaused

  // Пауза, когда секция ушла из вида: иначе на длинной странице карусель
  // продолжает переключаться в невидимой части и дёргает раскладку.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Автопереход по кругу.
  useEffect(() => {
    if (!isAnimating) return
    const timer = setInterval(() => {
      setOpacity(0)
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides)
        setOpacity(1)
      }, FADE_DURATION)
    }, STEP_SWITCH_DURATION)
    return () => clearInterval(timer)
  }, [isAnimating, totalSlides])

  // Ленивая загрузка: текущий блок и следующий, каждая картинка ровно один раз.
  // Картинка не открылась — остаётся заглушка, повторов нет.
  useEffect(() => {
    const preload = new Set<number>()
    for (let i = blockStart; i < blockStart + SLIDES_PER_BLOCK && i < totalSlides; i += 1) preload.add(i)
    const nextStart = ((blockIndex + 1) % blockCount) * SLIDES_PER_BLOCK
    for (let i = nextStart; i < nextStart + SLIDES_PER_BLOCK && i < totalSlides; i += 1) preload.add(i)
    preload.forEach(idx => {
      if (preloadStartedRef.current.has(idx)) return
      const slide = slides[idx]
      if (!slide?.image) return
      preloadStartedRef.current.add(idx)
      const img = new window.Image()
      img.src = slide.image
      img.onload = () => setLoadedImages(prev => ({ ...prev, [idx]: true }))
    })
  }, [blockIndex, blockStart, blockCount, totalSlides, slides])

  // Нажатие на кружок: тот же слайд на паузе — снять паузу; иначе перейти и встать.
  const handleCircleClick = (slideIdx: number) => {
    if (slideIdx === currentSlide && isPaused) {
      setIsPaused(false)
      return
    }
    setOpacity(1)
    setCurrentSlide(slideIdx)
    setIsPaused(true)
  }

  const shiftBlock = (delta: 1 | -1) => {
    const nextBlock = (blockIndex + delta + blockCount) % blockCount
    setOpacity(0)
    setTimeout(() => {
      setCurrentSlide(nextBlock * SLIDES_PER_BLOCK)
      setOpacity(1)
    }, FADE_DURATION)
  }

  const activeSlide = slides[currentSlide]
  const activeImageReady = !!activeSlide?.image && !!loadedImages[currentSlide]
  const showGlow = activeImageReady && opacity === 1

  // Положение кружка в ряду. Для трёх — края отступают на 60px, чтобы полоса
  // прогресса начиналась и кончалась под крайними кружками, а не за ними.
  const getCircleLeft = (pos: number) => {
    if (dotsCount === 1) return '50%'
    if (dotsCount === 3) return pos === 0 ? '60px' : pos === 1 ? '50%' : 'calc(100% - 60px)'
    if (dotsCount === 2) return pos === 0 ? '60px' : 'calc(100% - 60px)'
    return `${(pos / (dotsCount - 1)) * 100}%`
  }

  const progressDurationSec = (STEP_SWITCH_DURATION * dotsCount) / 1000

  const circleBase =
    'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
  const arrowClass =
    'shrink-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <div ref={sectionRef} data-showcase-carousel className="flex w-full flex-col items-center">
      <style>{`
        @keyframes fractera-line-slide {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      {/* Область картинки. Свечение по контуру появляется, когда картинка
          активного слайда догрузилась, и гаснет на время смены. */}
      <div
        className={`relative mx-auto mb-8 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl transition-shadow ease-out ${
          showGlow ? 'shadow-[0_0_50px_6px_var(--color-primary)]' : 'shadow-none'
        }`}
        style={{ transitionDuration: `${FADE_DURATION}ms` }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide
          const opacityCls = isActive && opacity === 1 ? 'opacity-100' : 'opacity-0'
          const hasImage = !!slide.image
          const isLoaded = !!loadedImages[idx]
          return (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${opacityCls}`}>
              <div
                data-image-placeholder
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/20 via-muted to-primary/10 transition-[filter] duration-700 ${
                  hasImage && isLoaded ? 'blur-md' : ''
                }`}
              >
                <p className="font-mono text-[length:var(--fs-small)] font-bold uppercase tracking-widest text-primary">
                  {slide.label}
                </p>
                {!hasImage && (
                  <p className="text-[length:var(--fs-small)] italic text-muted-foreground">{placeholderNote}</p>
                )}
              </div>
              {hasImage && isLoaded && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Ряд шага: [‹] [кружок] [полоса] [кружок] [кружок] [›] */}
      <div className="mx-auto mb-4 flex w-full max-w-4xl items-center gap-3">
        {blockCount > 1 && (
          <button type="button" aria-label="−3" onClick={() => shiftBlock(-1)} className={arrowClass}>
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
        )}

        <div className="relative h-12 flex-1">
          <div className="absolute left-[60px] right-[60px] top-1/2 h-[2px] -translate-y-1/2 bg-border" />
          <div
            key={`progress-${blockIndex}`}
            className="absolute left-[60px] right-[60px] top-1/2 h-[2px] origin-left -translate-y-1/2 bg-primary"
            style={{
              animation: `fractera-line-slide ${progressDurationSec}s linear infinite`,
              animationPlayState: isAnimating ? 'running' : 'paused',
            }}
          />
          {blockSlides.map((slide, pos) => {
            const slideIdx = blockStart + pos
            const isActive = slideIdx === currentSlide
            const showPauseGlyph = isActive && isPaused
            return (
              <button
                key={slideIdx}
                type="button"
                // Подпись говорит, ЧТО за слайд и что случится по нажатию: ряд
                // одинаковых «кнопка 1, кнопка 2» диктору ничего не сообщает.
                aria-label={`${slide.label}${showPauseGlyph ? ' ‖' : ''}`}
                onClick={() => handleCircleClick(slideIdx)}
                className={circleBase}
                style={{ left: getCircleLeft(pos) }}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-[length:var(--fs-small)] font-bold transition-all duration-300 ${
                    isActive
                      ? 'scale-110 border-primary bg-background text-primary shadow-lg'
                      : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  {showPauseGlyph ? <span className="leading-none tracking-tighter">‖</span> : slideIdx + 1}
                </div>
              </button>
            )
          })}
        </div>

        {blockCount > 1 && (
          <button type="button" aria-label="+3" onClick={() => shiftBlock(1)} className={arrowClass}>
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        )}
      </div>

      {blockCount > 1 && (
        <div className="mb-4 font-mono text-[length:var(--fs-small)] tracking-widest text-muted-foreground">
          {blockIndex + 1} / {blockCount}
        </div>
      )}

      {/* Три колонки подписей текущего блока: активная резкая, соседние размыты. */}
      <div className="mx-auto mb-8 w-full max-w-4xl px-4">
        <div className="hidden justify-between gap-8 md:flex">
          {blockSlides.map((slide, pos) => {
            const slideIdx = blockStart + pos
            return (
              <div
                key={slideIdx}
                className={`flex-1 text-center transition-all duration-300 ${
                  slideIdx === currentSlide ? 'opacity-100' : 'opacity-60 blur-sm'
                }`}
              >
                <p className="mb-2 text-[length:var(--fs-body)] font-bold text-foreground">{slide.label}</p>
                <p className="text-[length:var(--fs-small)] leading-relaxed text-primary">{slide.sublabel}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center md:hidden">
          <div className={`transition-opacity duration-700 ${opacity === 1 ? 'opacity-100' : 'opacity-0'}`}>
            <p className="mb-2 text-[length:var(--fs-body)] font-bold text-foreground">{activeSlide.label}</p>
            <p className="text-[length:var(--fs-small)] leading-relaxed text-primary">{activeSlide.sublabel}</p>
          </div>
        </div>
      </div>

      {/* Подпись активного слайда. */}
      <div
        className={`flex max-w-3xl flex-col items-center gap-2 text-center transition-opacity duration-700 ${
          opacity === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-[length:var(--fs-h3)] font-bold text-foreground">{activeSlide.title}</p>
        <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
          {activeSlide.description}
        </p>
      </div>
    </div>
  )
}
