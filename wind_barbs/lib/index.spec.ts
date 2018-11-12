const expect = require('chai').expect

interface Barb {
    flags: number;
    full_barbs: number;
    half_barbs: number;
}

let wind_barb = function() {
    return [
        [0, 0],
        [7, 0]
    ];
}

let draw = function(barb: Barb) {
    if (barb.full_barbs === 1) {
        return [
            [0, 0],
            [-7, 0],
            [-7.875, 2.8],
            [-7, 0],
            [0, 0]
        ]
    }
    return [
        [0, 0],
        [-7, 0],
        [-5.6875, 0],
        [-6.125, 1.4],
        [-5.6875, 0],
        [0, 0]
    ]
}

let count_flags = function(speed: number) : Barb {
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

let wind_speed = function(u, v) {
    return Math.sqrt(u**2 + v**2)
}

describe('wind_barb', function() {
    it('should return vertices', function() {
        let actual = wind_barb();
        let expected = [
            [0, 0],
            [7, 0]
        ];
        expect(actual).deep.equal(expected)
    })

    describe('count_flags', function() {
        it('should return zero given calm conditions', function() {
            check(2, {'flags': 0, 'full_barbs': 0, 'half_barbs': 0})
        })
        it('should return one given wind speed greater than 50', function() {
            check(50, {'flags': 1, 'full_barbs': 0, 'half_barbs': 0})
        })
        it('should return one barb given 10', function() {
            check(10, {'flags': 0, 'full_barbs': 1, 'half_barbs': 0})
        })
        it('should return one and a half barbs given 15', function() {
            check(15, {'flags': 0, 'full_barbs': 1, 'half_barbs': 1})
        })
        let check = function(speed, expected) {
            let actual = count_flags(speed)
            expect(actual).deep.equal(expected)
        }
    })

    describe('draw', function() {
        it('should return drawing instructions for half_barb', function() {
            let actual = draw({flags: 0, full_barbs: 0, half_barbs: 1})
            let expected = [[0, 0],
                            [-7, 0],
                            [-5.6875, 0],
                            [-6.125, 1.4],
                            [-5.6875, 0],
                            [0, 0]]
            expect(actual).deep.equal(expected)
        })
        it('should return drawing instructions for full_barb', function() {
            let actual = draw({flags: 0, full_barbs: 1, half_barbs: 0})
            let expected = [[0, 0],
                            [-7, 0],
                            [-7.875, 2.8],
                            [-7, 0],
                            [0, 0]]
            expect(actual).deep.equal(expected)
        })
    })

    describe('wind_speed', function() {
        it('should return magnitude of U, V', function() {
            let u = 3
            let v = 4
            let actual = wind_speed(u, v)
            let expected = 5
            expect(actual).to.equal(expected)
        })
    })
})
