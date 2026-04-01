'use client'

import { Button } from '@/components/ui/button'
import { useGSAP } from '@gsap/react'
import { Environment, useGLTF } from '@react-three/drei'
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

const smoothProgress = (value: number, start: number, end: number) => {
  const t = sectionProgress(value, start, end)
  return t * t * (3 - 2 * t)
}

const HouseScene: React.FC<SceneProps> = ({ progressRef }) => {
  const houseRef = React.useRef<THREE.Group>(null)
  const solidRef = React.useRef<THREE.Group>(null)
  const wireRef = React.useRef<THREE.Group>(null)
  const solidMaterialsRef = React.useRef<THREE.Material[]>([])
  const wireMaterialsRef = React.useRef<THREE.Material[]>([])
  const lookAtMatrixRef = React.useRef(new THREE.Matrix4())
  const targetQuaternionRef = React.useRef(new THREE.Quaternion())
  const targetCamera = React.useRef(new THREE.Vector3(0.25, 2.25, 13.3))
  const lookAtPoint = React.useRef(new THREE.Vector3(0, 1.4, 0))
  const currentLookAtRef = React.useRef(new THREE.Vector3(0, 1.4, 0))
  const modelScene = useGLTF('/model.glb')

  const normalizedTransform = React.useMemo(() => {
    const probe = modelScene.scene.clone(true)
    const box = new THREE.Box3().setFromObject(probe)
    const size = new THREE.Vector3()

    box.getSize(size)

    const footprint = Math.max(size.x, size.z) || 1
    const scale = 16 / footprint

    return { scale }
  }, [modelScene.scene])

  const solidModel = React.useMemo(() => {
    const clone = modelScene.scene.clone(true)
    clone.position.set(-1, -2, 0)
    return clone
  }, [modelScene.scene])

  const wireModel = React.useMemo(() => {
    const clone = modelScene.scene.clone(true)
    clone.position.set(-1, -2, 0)
    return clone
  }, [modelScene.scene])

  React.useEffect(() => {
    const solidMaterials: THREE.Material[] = []
    const wireMaterials: THREE.Material[] = []

    solidModel.traverse((object) => {
      const mesh = object as THREE.Mesh
      if (!mesh.isMesh) return

      mesh.castShadow = false
      mesh.receiveShadow = false

      if (Array.isArray(mesh.material)) {
        const clonedMaterials = mesh.material.map((material) => {
          const next = material.clone()
          next.transparent = true
          next.opacity = 1
          solidMaterials.push(next)
          return next
        })
        mesh.material = clonedMaterials
      } else {
        const next = mesh.material.clone()
        next.transparent = true
        next.opacity = 1
        mesh.material = next
        solidMaterials.push(next)
      }
    })

    wireModel.traverse((object) => {
      const mesh = object as THREE.Mesh
      if (!mesh.isMesh) return

      mesh.castShadow = false
      mesh.receiveShadow = false

      if (Array.isArray(mesh.material)) {
        const wireMeshMaterials = mesh.material.map(() => {
          const mat = new THREE.MeshBasicMaterial({
            color: '#111111',
            transparent: true,
            opacity: 0,
            wireframe: true,
          })
          wireMaterials.push(mat)
          return mat
        })
        mesh.material = wireMeshMaterials
      } else {
        const mat = new THREE.MeshBasicMaterial({
          color: '#111111',
          transparent: true,
          opacity: 0,
          wireframe: true,
        })
        mesh.material = mat
        wireMaterials.push(mat)
      }
    })

    solidMaterialsRef.current = solidMaterials
    wireMaterialsRef.current = wireMaterials

    return () => {
      solidMaterials.forEach((material) => material.dispose())
      wireMaterials.forEach((material) => material.dispose())
      solidMaterialsRef.current = []
      wireMaterialsRef.current = []
    }
  }, [solidModel, wireModel])

  useFrame((state) => {
    const progress = progressRef.current
    const phase6 = sectionProgress(progress, 0.62, 0.76)
    const phase7 = sectionProgress(progress, 0.76, 0.84)
    const phase8 = sectionProgress(progress, 0.84, 0.92)
    const phase9 = sectionProgress(progress, 0.92, 1)

    if (houseRef.current) {
      houseRef.current.position.set(0, 0, 0)
    }

    if (solidRef.current) {
      solidRef.current.position.set(0, 0, 0)
      solidRef.current.scale.set(1, 1, 1)
    }
    if (wireRef.current) {
      wireRef.current.position.set(0, 0, 0)
      wireRef.current.scale.set(1, 1, 1)
    }

    const wireIn = smoothProgress(progress, 0.14, 0.2)
    const wireOut = 1 - smoothProgress(progress, 0.3, 0.36)
    const wireMix = clamp01(Math.min(wireIn, wireOut))
    const solidMix = 1 - wireMix

    solidMaterialsRef.current.forEach((material) => {
      material.opacity = solidMix
      material.needsUpdate = true
    })
    wireMaterialsRef.current.forEach((material) => {
      material.opacity = wireMix
      material.needsUpdate = true
    })

    if (solidRef.current) {
      solidRef.current.visible = solidMix > 0.001
    }
    if (wireRef.current) {
      wireRef.current.visible = wireMix > 0.001
    }

    if (progress < 0.04) {
      const t = smoothProgress(progress, 0, 0.34)
      targetCamera.current.set(
        THREE.MathUtils.lerp(0.25, 0.0, t),
        THREE.MathUtils.lerp(2.25, 10, t),
        THREE.MathUtils.lerp(13.3, 12.3, t),
      )
      lookAtPoint.current.set(0, THREE.MathUtils.lerp(1.4, 0, t), 0)
    } 
    else if (progress < 0.34) {
      const t = smoothProgress(progress, 0, 0.34)
      targetCamera.current.set(
        THREE.MathUtils.lerp(10.25, 1.0, t),
        THREE.MathUtils.lerp(2.25, 10, t),
        THREE.MathUtils.lerp(13.3, 12.3, t),
      )
      lookAtPoint.current.set(0, THREE.MathUtils.lerp(1.4, 0, t), 0)
    } 
    else if (progress < 0.5) {
      const t = smoothProgress(progress, 0.34, 0.5)
      targetCamera.current.set(
        THREE.MathUtils.lerp(0.0, 0.9, t),
        THREE.MathUtils.lerp(10, 0.1, t),
        12.3,
      )
      lookAtPoint.current.set(0, 0, 0)
    } else if (progress < 0.76) {
      targetCamera.current.set(-2.35, 1.85, 5.1 - phase6 * 1.5)
      lookAtPoint.current.set(-2.05, 0.95, -1)
    } else if (progress < 0.84) {
      targetCamera.current.set(-1.3, 1.78, 2.75 - phase7 * 0.65)
      lookAtPoint.current.set(-2.1, 0.95, -1)
    } else if (progress < 0.92) {
      const orbitAngle = phase8 * Math.PI * 2
      const orbitRadius = 3.1
      targetCamera.current.set(
        -2.1 + Math.cos(orbitAngle) * orbitRadius,
        1.95,
        -1 + Math.sin(orbitAngle) * orbitRadius,
      )
      lookAtPoint.current.set(-2.1, 0.95, -1)
    } else {
      targetCamera.current.set(0.8 + phase9 * 7.8, 3.2, 5.6 + phase9 * 8.5)
      lookAtPoint.current.set(0, 0.22, 0)
    }

    state.camera.position.lerp(targetCamera.current, 0.07)
    currentLookAtRef.current.lerp(lookAtPoint.current, 0.07)

    const camera = state.camera as THREE.Camera & THREE.Object3D
    if (typeof camera.lookAt === 'function') {
      camera.lookAt(currentLookAtRef.current)
    } else {
      lookAtMatrixRef.current.lookAt(camera.position, currentLookAtRef.current, camera.up)
      targetQuaternionRef.current.setFromRotationMatrix(lookAtMatrixRef.current)
      camera.quaternion.slerp(targetQuaternionRef.current, 0.2)
    }
  })

  return (
    <>
      <color attach="background" args={['#ffffff']} />
      <fog attach="fog" args={['#ffffff', 10, 28]} />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={1.5} position={[5, 9, 6]} />
      <pointLight intensity={0.6} position={[-6, 4, 8]} color="#76d7ff" />
      <Environment preset="city" />

      <group ref={houseRef} position={[0, 0, 0]}>
        <group ref={solidRef}>
          <primitive object={solidModel} scale={normalizedTransform.scale} />
        </group>
        <group ref={wireRef}>
          <primitive object={wireModel} scale={normalizedTransform.scale} />
        </group>
      </group>
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
        <Canvas camera={{ fov: 44, position: [0.25, 2.25, 13.3] }} dpr={[1, 1.5]}>
          <React.Suspense fallback={null}>
            <HouseScene progressRef={progressRef} />
          </React.Suspense>
        </Canvas>
      </div>

      <header className="fixed left-0 right-0 top-0 z-30 bg-white/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              className="text-3xl font-semibold leading-none text-slate-800 md:text-4xl"
              href="#top"
            >
              Rezelix
            </a>
            <div className="hidden h-8 w-px bg-black/10 md:block" />
            <nav className="hidden items-center gap-8 md:flex">
              {navItems.map((item) => (
                <a
                  className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-black/15 bg-white px-6 text-slate-900 hover:bg-slate-50"
          >
            <a href="#contact">Get in Touch {'->'}</a>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section
          className="container flex min-h-screen flex-col items-center justify-start pt-40 md:pt-28"
          id="top"
        >
          <div className="flex w-full max-w-4xl flex-col items-center text-center">
            <h1 className="text-5xl font-medium leading-tight tracking-tight text-black md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-base text-black md:text-lg">{heroSubtitle}</p>
            <div className="mt-8 flex items-center gap-3">
              <Button
                asChild
                className="rounded-md bg-black px-10 text-white hover:bg-slate-700"
              >
                <a href={heroCtaHref}>
                  {heroCtaLabel} {'->'}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-md border-black/15 bg-white px-10 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <a href="#portfolio">Portfolio</a>
              </Button>
            </div>
          </div>

          <div className="h-[62vh] w-full md:h-[66vh]" />
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
              We can turn your concept into a full visual and technical package from planning to
              final walkthrough.
            </p>
            <div className="mt-8">
              <Button
                asChild
                className="rounded-full bg-slate-900 px-8 text-white hover:bg-slate-800"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

useGLTF.preload('/model.glb')
