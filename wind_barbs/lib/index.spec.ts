const expect = require('chai').expect
import * as barbs from './barbs'
import {Tails} from './barbs'

describe('wind_barbs', function() {
    describe('count_tails', function() {
        it('should return zeros given calm conditions', function() {
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
            let actual = barbs.count_tails(speed)
            expect(actual).deep.equal(expected)
        }
    })

    describe('calm', function() {
        it('should draw circle', function() {
            let calledWith
            let ctx = {
                closePath: function() {},
                beginPath: function() {},
                stroke: function() {},
                arc: function() {
                    calledWith = Array.from(arguments)
                }
            }
            let x = 0
            let y = 0
            let r = 1
            barbs.draw_calm(ctx, x, y, r)
            let expected = [x, y, r, 0, 2 * Math.PI]
            let actual = calledWith
            expect(actual).deep.equal(expected)
        })
    })

    describe('vertices', function() {
        it('should trace a half barb', function() {
            check({flags: 0, full_barbs: 0, half_barbs: 1}, [
                [0, 0],
                [-7, 0],
                [-5.6875, 0],
                [-6.125, 1.4],
                [-5.6875, 0],
                [0, 0]
            ])
        })
        it('should trace a full barb', function() {
            check({flags: 0, full_barbs: 1, half_barbs: 0}, [
                [0, 0],
                [-7, 0],
                [-7.875, 2.8],
                [-7, 0],
                [0, 0]
            ])
        })
        it('should trace two full barbs', function() {
            check({flags: 0, full_barbs: 2, half_barbs: 0}, [
                [0, 0],
                [-7, 0],
                [-7.875, 2.8],
                [-7, 0],
                [-6.125, 0],
                [-7, 2.8],
                [-6.125, 0],
                [0, 0]
            ])
        })
        it('should trace two and a half barbs', function() {
            check({flags: 0, full_barbs: 2, half_barbs: 1}, [
                [0, 0],
                [-7, 0],
                [-7.875, 2.8],
                [-7, 0],
                [-6.125, 0],
                [-7, 2.8],
                [-6.125, 0],
                [-5.25, 0],
                [-5.6875, 1.4],
                [-5.25, 0],
                [0, 0]
            ])
        })
        it('should trace a flag', function() {
            check({flags: 1, full_barbs: 0, half_barbs: 0}, [
                [0, 0],
                [-7, 0],
                [-6.125, 2.8],
                [-5.25, 0],
                [0, 0]
            ])
        })
        it('should trace two flags', function() {
            check({flags: 2, full_barbs: 0, half_barbs: 0}, [
                [0, 0],
                [-7, 0],
                [-6.125, 2.8],
                [-5.25, 0],
                [-4.8125, 0],
                [-3.9375, 2.8],
                [-3.0625, 0],
                [0, 0]
            ])
        })
        it('should trace two flags and a barb', function() {
            check({flags: 2, full_barbs: 1, half_barbs: 0}, [
                [0, 0],
                [-7, 0],
                [-6.125, 2.8],
                [-5.25, 0],
                [-4.8125, 0],
                [-3.9375, 2.8],
                [-3.0625, 0],
                [-2.1875, 0],
                [-3.0625, 2.8],
                [-2.1875, 0],
                [0, 0]
            ])
        })
        let check = function(tails: Tails, expected) {
            let actual = barbs.vertices(tails)
            expect(actual).deep.equal(expected)
        }
    })

    describe('speed', function() {
        it('should return magnitude of vector', function() {
            let u = 3
            let v = 4
            let actual = barbs.speed(u, v)
            let expected = 5
            expect(actual).to.equal(expected)
        })
    })

    describe('direction', function() {
        it('should return direction of U vector', function() {
            check(1, 0, 0)
        })
        it('should return direction of V vector', function() {
            check(0, 1, Math.PI / 2)
        })
        it('should return direction of (1, 1)', function() {
            check(1, 1, Math.PI / 4)
        })
        let check = function(u, v, expected) {
            let actual = barbs.direction(u, v)
            expect(actual).to.equal(expected)
        }
    })

    describe('draw', function() {
        xit('should draw half barb', function() {
            let ctx;
            let x = 0;
            let y = 0;
            let u = 5;
            let v = 0;
            barbs.draw(ctx, x, y, u, v)
        })
    });
})
