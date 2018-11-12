"use strict";

interface Barb {
    flags: number;
    full_barbs: number;
    half_barbs: number;
}

export const draw = function(barb: Barb) {
    let length = 7
    let spacing = 0.875
    let height = 2.8

    // Special case for lone half barb
    if ((barb.flags === 0) &&
        (barb.full_barbs === 0) &&
        (barb.half_barbs === 1)) {
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
    if (barb.flags > 0) {
        for (let ib=0; ib<barb.flags; ib++) {
            vertices.push([position, 0])
            vertices.push([position + spacing, height])
            vertices.push([position + (2 * spacing), 0])
            position += 2 * spacing
        }
    }
    if (barb.full_barbs > 0) {
        for (let ib=0; ib<barb.full_barbs; ib++) {
            vertices.push([position, 0])
            vertices.push([position - spacing, height])
            vertices.push([position, 0])
            position += spacing
        }
    }
    if (barb.half_barbs > 0) {
        vertices.push([position, 0])
        vertices.push([position - (spacing / 2), height/2])
        vertices.push([position, 0])
        position += spacing
    }
    vertices.push([0, 0])
    return vertices
}

export const count_tails = function(speed: number) : Barb {
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
