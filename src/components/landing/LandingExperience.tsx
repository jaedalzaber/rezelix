'use client'

import { Button } from '@/components/ui/button'
import { useGSAP } from '@gsap/react'
import { Environment } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Link from 'next/link'
import React from 'react'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const navItems = [
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About' },
]

type LandingExperienceProps = {
  heroTitle: string
  heroSubtitle: string
  heroCtaHref: string
  heroCtaLabel: string
}

type SceneProps = {
  progressRef: React.MutableRefObject<number>
}

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1)

const sectionProgress = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start))

const HouseScene: React.FC<SceneProps> = ({ progressRef }) => {
  const blueprintRef = React.useRef<THREE.Mesh>(null)
  const blueprintMaterialRef = React.useRef<THREE.MeshBasicMaterial>(null)
  const shellRef = React.useRef<THREE.Mesh>(null)
  const shellMaterialRef = React.useRef<THREE.MeshStandardMaterial>(null)
  const landscapeRef = React.useRef<THREE.Group>(null)
  const interiorRef = React.useRef<THREE.Group>(null)
  const productRef = React.useRef<THREE.Mesh>(null)
  const productMaterialRef = React.useRef<THREE.MeshStandardMaterial>(null)
  const targetCamera = React.useRef(new THREE.Vector3(0, 2.6, 10))
  const lookAtPoint = React.useRef(new THREE.Vector3(0, 1.2, 0))

  useFrame((state) => {
    const progress = progressRef.current
    const phase2 = sectionProgress(progress, 0.1, 0.3)
    const phase3 = sectionProgress(progress, 0.28, 0.43)
    const phase4 = sectionProgress(progress, 0.44, 0.56)
    const phase6 = sectionProgress(progress, 0.57, 0.72)
    const phase7 = sectionProgress(progress, 0.72, 0.8)
    const phase8 = sectionProgress(progress, 0.8, 0.9)
    const phase9 = sectionProgress(progress, 0.9, 1)

    const wireOpacity = 1 - phase2
    if (blueprintMaterialRef.current) {
      blueprintMaterialRef.current.opacity = wireOpacity
      blueprintMaterialRef.current.needsUpdate = true
    }

    if (shellRef.current) {
      shellRef.current.scale.set(1, Math.max(0.08, phase2), 1)
      shellRef.current.position.y = 0.2 + shellRef.current.scale.y * 1.6
    }

    if (shellMaterialRef.current) {
      shellMaterialRef.current.opacity = Math.min(1, phase2 + 0.15)
    }

    if (landscapeRef.current) {
      const landscapeScale = Math.max(0.01, phase3)
      landscapeRef.current.scale.setScalar(landscapeScale)
      landscapeRef.current.position.y = -0.25 + phase3 * 0.25
    }

    if (interiorRef.current) {
      const interiorScale = Math.max(0.01, phase6)
      interiorRef.current.scale.setScalar(interiorScale)
      interiorRef.current.position.y = 0.2 + phase6 * 0.5
    }

    if (productRef.current) {
      productRef.current.scale.setScalar(0.4 + phase7 * 0.8)
      productRef.current.rotation.y += 0.01 + phase8 * 0.025
    }

    if (productMaterialRef.current) {
      productMaterialRef.current.emissiveIntensity = phase7 * 0.8
    }

    if (progress < 0.45) {
      targetCamera.current.set(0, 2.8, 10 - progress * 6)
      lookAtPoint.current.set(0, 1.3, 0)
    } else if (progress < 0.75) {
      targetCamera.current.set(-2.1, 1.8, 5.7 - phase6 * 1.8)
      lookAtPoint.current.set(-1.9, 1.4, -0.8)
    } else if (progress < 0.9) {
      targetCamera.current.set(-1.4, 1.8, 3.2)
      lookAtPoint.current.set(-2.2 + phase8 * 0.8, 1.4, -1.2)
    } else {
      targetCamera.current.set(0.5 + phase9 * 7, 3.2, 4.5 + phase9 * 8)
      lookAtPoint.current.set(0, 1.2, 0)
    }

    state.camera.position.lerp(targetCamera.current, 0.07)
    state.camera.lookAt(lookAtPoint.current)
  })

  return (
    <>
      <color attach="background" args={['#ffffff']} />
      <fog attach="fog" args={['#ffffff', 10, 28]} />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={1.5} position={[5, 9, 6]} />
      <pointLight intensity={0.6} position={[-6, 4, 8]} color="#76d7ff" />
      <Environment preset="city" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh ref={blueprintRef} position={[0, 1.95, 0]}>
        <boxGeometry args={[4.5, 3.5, 4]} />
        <meshBasicMaterial ref={blueprintMaterialRef} color="#6bd5ff" transparent opacity={1} wireframe />
      </mesh>

      <mesh ref={shellRef} position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[4.2, 3.2, 3.6]} />
        <meshStandardMaterial
          ref={shellMaterialRef}
          color="#d6d2cb"
          roughness={0.58}
          metalness={0.08}
          transparent
        />
      </mesh>

      <group ref={landscapeRef}>
        <mesh position={[-4, 0.35, -3]}>
          <coneGeometry args={[0.5, 1.2, 12]} />
          <meshStandardMaterial color="#4ca66d" roughness={0.9} />
        </mesh>
        <mesh position={[-2.8, 0.35, -3.5]}>
          <coneGeometry args={[0.45, 1, 12]} />
          <meshStandardMaterial color="#5bbb73" roughness={0.9} />
        </mesh>
        <mesh position={[3.7, 0.3, -3.2]}>
          <coneGeometry args={[0.55, 1.4, 12]} />
          <meshStandardMaterial color="#4a9b67" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.03, 4.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 1.9]} />
          <meshStandardMaterial color="#2f353f" roughness={0.95} />
        </mesh>
      </group>

      <group ref={interiorRef} position={[-2.1, 1, -1]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.2, 1.2, 1.4]} />
          <meshStandardMaterial color="#efebe5" roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.35, -0.6]}>
          <boxGeometry args={[2.2, 0.06, 1.4]} />
          <meshStandardMaterial color="#baad9b" roughness={0.85} />
        </mesh>
      </group>

      <mesh ref={productRef} position={[-2.1, 1.15, -1]} castShadow>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          ref={productMaterialRef}
          color="#d7c7a0"
          emissive="#fff1cc"
          emissiveIntensity={0}
          roughness={0.2}
          metalness={0.78}
        />
      </mesh>
    </>
  )
}

export const LandingExperience: React.FC<LandingExperienceProps> = ({
  heroTitle,
  heroSubtitle,
  heroCtaHref,
  heroCtaLabel,
}) => {
  const pageRef = React.useRef<HTMLDivElement>(null)
  const progressRef = React.useRef(0)

  useGSAP(
    () => {
      const timelineState = { progress: 0 }

      gsap.to(timelineState, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
        onUpdate: () => {
          progressRef.current = timelineState.progress
        },
      })
    },
    { scope: pageRef },
  )

  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    const onScroll = () => {
      ScrollTrigger.update()
    }

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', onScroll)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.off('scroll', onScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="landing-root relative min-h-[600vh] text-slate-900" ref={pageRef}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Canvas camera={{ fov: 44, position: [0, 2.6, 10] }} dpr={[1, 1.5]}>
          <HouseScene progressRef={progressRef} />
        </Canvas>
      </div>

      <header className="fixed left-0 right-0 top-0 z-30 border-b border-black/10 bg-white/75 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <a className="text-lg font-semibold uppercase tracking-[0.24em] text-slate-900" href="#top">
            rezeliz
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                className="text-sm uppercase tracking-[0.18em] text-slate-700 transition hover:text-slate-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Button asChild className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800">
            <a href="#contact">Get in Touch</a>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section
          className="container flex min-h-screen flex-col justify-center gap-8 pt-28 md:pt-36"
          id="top"
        >
          <p className="max-w-2xl text-xs uppercase tracking-[0.28em] text-sky-700">
            Architectural Design Studio
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{heroTitle}</h1>
          <p className="max-w-2xl text-base text-slate-700 md:text-lg">{heroSubtitle}</p>
          <div className="flex items-center gap-4">
            <Button asChild className="rounded-full bg-slate-900 px-7 text-white hover:bg-slate-800">
              <a href={heroCtaHref}>{heroCtaLabel}</a>
            </Button>
            <span className="text-sm uppercase tracking-[0.18em] text-slate-600">
              Scroll to build the house
            </span>
          </div>
        </section>

        <section className="container flex min-h-screen items-center" id="services">
          <div className="max-w-2xl rounded-2xl border border-black/10 bg-white/70 p-8 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-700">Services</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">From CAD to interiors</h2>
            <p className="mt-4 text-slate-700">
              Scroll progression drives each service phase: CAD drawings, exterior rendering,
              landscape planning, interior visualization, and product detailing.
            </p>
          </div>
        </section>

        <section className="container flex min-h-screen items-center justify-end" id="portfolio">
          <div className="max-w-2xl rounded-2xl border border-black/10 bg-white/70 p-8 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-700">Portfolio</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Showcase projects with cinematic flow
            </h2>
            <p className="mt-4 text-slate-700">
              Highlight signature work through camera transitions and phase callouts, then deep-link
              to case-study pages powered by Payload.
            </p>
          </div>
        </section>

        <section className="container flex min-h-screen items-center" id="about">
          <div className="max-w-2xl rounded-2xl border border-black/10 bg-white/70 p-8 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-700">About</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Design stories for modern living
            </h2>
            <p className="mt-4 text-slate-700">
              Rezeliz combines architecture, interior styling, and product design into one
              end-to-end visual journey.
            </p>
          </div>
        </section>

        <section className="container flex min-h-screen items-center justify-center" id="contact">
          <div className="max-w-3xl rounded-3xl border border-sky-200 bg-white/80 p-10 text-center shadow-md backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-700">Start Your Project</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              Ready to shape your next space?
            </h2>
            <p className="mt-4 text-slate-700">
              We can turn your concept into a full visual and technical package from planning to final
              walkthrough.
            </p>
            <div className="mt-8">
              <Button asChild className="rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
