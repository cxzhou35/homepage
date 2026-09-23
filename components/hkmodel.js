import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadGLTFModel } from '../lib/model'
import { ModelContainer, ModelPoster } from './hkmodel-loader'

const MAX_PIXEL_RATIO = 1.5
const FRAME_INTERVAL = 1000 / 30
const INTRO_DURATION = 1800

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4))
}

function disposeMaterial(material) {
  Object.values(material).forEach(value => {
    if (value?.isTexture) value.dispose()
  })
  material.dispose()
}

function disposeModel(model) {
  model?.traverse(child => {
    if (!child.isMesh) return
    child.geometry?.dispose()
    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material]
    materials.filter(Boolean).forEach(disposeMaterial)
  })
}

const HKModel = ({ modelUrl }) => {
  const refContainer = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const container = refContainer.current
    if (!container) return undefined

    let disposed = false
    let frameRequest = null
    let lastFrameTime = 0
    let animationStart = null
    let model = null
    let modelReady = false
    let isVisible = true

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio <= MAX_PIXEL_RATIO,
        alpha: true,
        powerPreference: 'low-power'
      })
    } catch (error) {
      console.warn(
        'WebGL is unavailable; using the model poster instead.',
        error
      )
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden', 'true')
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%'
    })
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const target = new THREE.Vector3(-0.5, 1.2, 0)
    const initialCameraPosition = new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
    const camera = new THREE.OrthographicCamera()
    camera.position.copy(initialCameraPosition)
    camera.lookAt(target)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.target = target

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return

      const scale = height * 0.005 + 4.8
      const aspect = width / height
      camera.left = -scale * aspect
      camera.right = scale * aspect
      camera.top = scale
      camera.bottom = -scale
      camera.near = 0.01
      camera.far = 50000
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)

      if (modelReady) renderer.render(scene, camera)
    }

    const stopAnimation = () => {
      if (frameRequest !== null) {
        cancelAnimationFrame(frameRequest)
        frameRequest = null
      }
    }

    const animate = time => {
      frameRequest = null
      if (disposed || !modelReady || !isVisible || document.hidden) return

      if (time - lastFrameTime < FRAME_INTERVAL) {
        frameRequest = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = time
      if (animationStart === null) animationStart = time

      const progress = Math.min((time - animationStart) / INTRO_DURATION, 1)
      if (progress < 1) {
        const p = initialCameraPosition
        const rotation = -easeOutCirc(progress) * Math.PI * 20
        camera.position.y = 10
        camera.position.x = p.x * Math.cos(rotation) + p.z * Math.sin(rotation)
        camera.position.z = p.z * Math.cos(rotation) - p.x * Math.sin(rotation)
        camera.lookAt(target)
      } else {
        controls.update()
      }

      renderer.render(scene, camera)
      frameRequest = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (
        frameRequest === null &&
        modelReady &&
        isVisible &&
        !document.hidden
      ) {
        frameRequest = requestAnimationFrame(animate)
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation()
      else startAnimation()
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) startAnimation()
        else stopAnimation()
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(container)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    resize()

    loadGLTFModel(scene, modelUrl, {
      receiveShadow: false,
      castShadow: false
    })
      .then(loadedModel => {
        if (disposed) {
          disposeModel(loadedModel)
          return
        }

        model = loadedModel
        modelReady = true
        renderer.render(scene, camera)
        setIsReady(true)
        startAnimation()
      })
      .catch(error => {
        if (!disposed) {
          console.warn('Unable to load the 3D model; using its poster.', error)
        }
      })

    return () => {
      disposed = true
      stopAnimation()
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      controls.dispose()
      if (model) {
        scene.remove(model)
        disposeModel(model)
      }
      renderer.domElement.remove()
      renderer.dispose()
    }
  }, [modelUrl])

  return (
    <ModelContainer ref={refContainer}>
      <ModelPoster isReady={isReady} />
    </ModelContainer>
  )
}

export default HKModel
