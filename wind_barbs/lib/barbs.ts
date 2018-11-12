"use strict";

export interface Tails {
    flags: number;
    full_barbs: number;
    half_barbs: number;
}

export const draw = function(
    ctx, x, y, u, v,
    scale=1
) {
    let xs, ys
    let c = speed(u, v)
    let angle = direction(u, v)
    let tails = count_tails(c)
    let xys = vertices(tails)
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.beginPath()
    for (let j=0; j<xys.length; j++) {
        xs = scale * xys[j][0]
        ys = scale * xys[j][1]
        if (j === 0) {
            ctx.moveTo(xs, ys)
        } else {
            ctx.lineTo(xs, ys)
        }
    }
    ctx.strokeStyle = "#222"
    ctx.stroke()
    ctx.fillStyle = "#222"
    ctx.fill()
    ctx.closePath()
    ctx.rotate(-angle)
    ctx.translate(-x, -y)
}

export const vertices = function(
    tails: Tails,
    height=2.8,
    length=7,
    spacing=0.875
) {

    // Special case for lone half barb
    if ((tails.flags === 0) &&
        (tails.full_barbs === 0) &&
        (tails.half_barbs === 1)) {
        let position = -length + (1.5 *spacing)
        return [
            [0, 0],
            [-length, 0],
            [position, 0],
            [position - (spacing / 2), height / 2],
            [position, 0],
            [0, 0]
        ]
    }

    let vertices = []
    let position = -length
    vertices.push([0, 0])
    if (tails.flags > 0) {
        for (let ib=0; ib<tails.flags; ib++) {
            vertices.push([position, 0])
            vertices.push([position + spacing, height])
            vertices.push([position + (2 * spacing), 0])
            position += 2 * spacing
        }
    }
    if (tails.full_barbs > 0) {
        for (let ib=0; ib<tails.full_barbs; ib++) {
            vertices.push([position, 0])
            vertices.push([position - spacing, height])
            vertices.push([position, 0])
            position += spacing
        }
    }
    if (tails.half_barbs > 0) {
        vertices.push([position, 0])
        vertices.push([position - (spacing / 2), height/2])
        vertices.push([position, 0])
        position += spacing
    }
    vertices.push([0, 0])
    return vertices
}

export const count_tails = function(speed: number) : Tails {
    let flags = ~~(speed / 50)
    if (flags > 0) {
        speed = speed - (flags * 50)
    }
    let full_barbs = ~~(speed / 10)
    if (full_barbs > 0) {
        speed = speed - (full_barbs * 10)
    }
    let half_barbs = ~~(speed / 5)
    return {
        'flags': flags,
        'full_barbs': full_barbs,
        'half_barbs': half_barbs
    }
}
export const speed = function(u : number, v : number) : number {
    return Math.sqrt(u**2 + v**2)
}

export const direction = function(u : number, v : number) : number {
    return Math.atan2(v, u)
}
