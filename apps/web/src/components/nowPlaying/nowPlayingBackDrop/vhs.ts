import { KawaseBlurFilter } from '@pixi/filter-kawase-blur'
import type { Ticker } from 'pixi.js'
import { Application, Container, Graphics } from 'pixi.js'
import { createNoise3D } from 'simplex-noise'

const noise3D = createNoise3D()

interface VhsOptions {
  width?: number
  height?: number
  res?: number
  brightness?: number
  animate?: boolean
  colors?: [number | string, number | string, number | string]
  baseColor?: number | string
  autoPlay?: boolean
}
export class Vhs {
  app: Application
  containers: Container[] = []
  graphices: Graphics[] = []
  fills: Graphics[] = []

  width: number
  height: number
  res: number
  rows: number
  cols: number
  inc = 0.02
  cutoff = -0.125
  zOff = 0
  ticker?: Ticker
  colors: [number | string, number | string, number | string]

  constructor(el: HTMLCanvasElement, option: VhsOptions) {
    const {
      width = 700,
      height = 700,
      res = 15,
      brightness = 0.5,
      animate = false,
      colors = [0x4597D4, 0xF1A63F, 0xEA345D],
      baseColor = 0xFFFFFF,
      autoPlay = false,
    } = option ?? {}
    el.style.filter = `brightness(${brightness})`
    this.res = res
    this.cols = 1 + width / res
    this.rows = 1 + height / res
    this.width = width
    this.height = height
    this.colors = colors
    this.app = new Application({
      view: el,
      width,
      height,
      resolution: window.devicePixelRatio ?? 1,
      autoDensity: false,
      backgroundColor: baseColor,
    })
    const blurFilter = new KawaseBlurFilter(30, 10, true)
    this.app.stage.filters = [blurFilter]

    colors.forEach((color) => {
      const graphics = new Graphics()

      this.app.stage.addChild(graphics)
      this.graphices.push(graphics)

      const container = new Container()
      this.app.stage.addChild(container)
      container.mask = graphics
      this.containers.push(container)

      const fill = new Graphics()
      container.addChild(fill)
      fill.beginFill(color)
      fill.drawRect(0, 0, width, height)
      fill.alpha = 1
      this.fills.push(fill)
    })

    if (width < 700)
      this.cutoff = -0.125

    this.render()
    if (animate) {
      this.ticker = this.app.ticker.add(() => {
        this.render()
      })
      if (autoPlay) {
        this.ticker.start()
      }
      else {
        setTimeout(() => {
          this.ticker?.stop()
        }, 100)
      }
    }
  }

  play() {
    setTimeout(() => {
      this.ticker?.start()
    }, 100)
  }

  stop() {
    setTimeout(() => {
      this.ticker?.stop()
    }, 100)
  }

  destroy() {
    // this.ticker?.destroy()
    this.app.destroy()
  }

  render() {
    this.graphices.forEach((graphics, idx) => {
      let xOff = idx * 1000

      graphics.clear()
      graphics.beginFill(0x000000)

      for (let i = 0; i < this.cols; i++) {
        xOff += this.inc

        let yOff = idx * 1000

        for (let j = 0; j < this.rows; j++) {
          const noise = noise3D(xOff, yOff, this.zOff)

          if (noise > this.cutoff)
            graphics.drawRect(i * this.res, j * this.res, this.res, this.res)

          yOff += this.inc
        }
      }
      graphics.endFill()
    })

    this.zOff += 0.005
  }

  update(colors?: VhsOptions['colors'], baseColor?: number | string) {
    this.zOff = 0

    if (colors)
      this.colors = colors

    if (baseColor)
      this.app.renderer.background.color = baseColor

    this.fills.forEach((fill, idx) => {
      fill.clear()
      fill.beginFill(this.colors[idx])
      fill.drawRect(0, 0, this.width, this.height)
      fill.endFill()
    })
  }
}
