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
    let length = 7
    let radius = length * 0.15
    let c = speed(u, v)
    let angle = direction(u, v)
    if (c < 5) {
        draw_calm(ctx, x, y, scale * radius)
    } else {
        draw_arrow(ctx, x, y, c, angle, scale)
    }
}

export const draw_calm = function(ctx, x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.closePath()
}

export const draw_arrow = function(ctx, x, y, c, angle, scale) {
    let xs, ys
    let xys = vertices(count_tails(c))
    ctx.translate(x, y)
    ctx.rotate(-angle)
    ctx.beginPath()
    for (let j=0; j<xys.length; j++) {
        xs = scale * xys[j][0]
        ys = -scale * xys[j][1]
        if (j === 0) {
            ctx.moveTo(xs, ys)
        } else {
            ctx.lineTo(xs, ys)
        }
    }
    ctx.fillStyle = "gray"
    ctx.fill()
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.closePath()
    ctx.rotate(angle)
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
            if (ib === (tails.flags - 1)) {
                position += spacing
            } else {
                position += (spacing / 2)
            }
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
    let flags, full_barbs, half_barbs
    flags = ~~(speed / 50)
    if (flags > 0) {
        speed = speed - (flags * 50)
    }
    full_barbs = ~~(speed / 10)
    if (full_barbs > 0) {
        speed = speed - (full_barbs * 10)
    }
    half_barbs = ~~(speed / 5)
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
