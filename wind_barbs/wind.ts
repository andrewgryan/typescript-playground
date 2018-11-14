import {RenderOne, Marker, MarkerView, MarkerData} from "models/markers/marker"
import {Class} from "core/class"
import {Line, Fill} from "core/visuals"
import {Context2d} from "core/util/canvas"
import * as p from "core/properties"
import * as barbs from './dist/barbs'

// Re-implement functions not exported by models/markers/index.ts
function _mk_model(type: string, f: RenderOne): Class<Marker> {
    const view = class extends MarkerView {
        static initClass(): void {
            // Note: this factory function isn't necessary
        }
        _render_one(
            ctx: Context2d,
            i: number,
            r: number,
            line: Line,
            fill: Fill): void {
                barbs.draw(
                    ctx,
                    this._u[i],
                    this._v[i],
                    r
                )

                if (fill.doit) {
                    fill.set_vectorize(ctx, i)
                    ctx.fill()
                }

                if (line.doit) {
                    line.set_vectorize(ctx, i)
                    ctx.stroke()
                }
        }
    }
    view.initClass()
    const model = class extends Marker {
        static initClass(): void {
            this.prototype.default_view = view
            this.prototype.type = type
            this.define({
                "u": [p.DistanceSpec,
                    {units: "screen", value: 0}],
                "v": [p.DistanceSpec,
                    {units: "screen", value: 0}],
            })
        }
    }
    model.initClass()
    return model
}


export const Barbs = _mk_model('Barbs', barbs.draw)
