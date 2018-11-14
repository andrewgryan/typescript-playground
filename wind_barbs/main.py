import numpy as np
import bokeh.plotting
import bokeh.models
import wind
import util


def main():
    figure = bokeh.plotting.figure(
                sizing_mode="stretch_both"
            )
    points = "single"
    if points == "single":
        x = [100, 150, 200]
        y = [200, 200, 200]
        u = [0, 0, 0]
        v = [-15, 0, 65]
    else:
        x = np.arange(-30, 30, 1, dtype="f")
        y = np.arange(-30, 30, 1, dtype="f")
        X, Y = np.meshgrid(x, y)
        U = -15 * np.ones(X.shape)
        V = 20 * np.exp(-(X**2 + Y**2) / 60) + 10 * np.sin((2 * np.pi * X) / 60)
        x = X.flatten()
        y = Y.flatten()
        u = U.flatten()
        v = V.flatten()

    glyph = wind.Barbs(x="x", y="y", u="u", v="v",
                       fill_color="white",
                       line_color="blue",
                       size=6)
    source = bokeh.models.ColumnDataSource({
            "x": x,
            "y": y,
            "u": u,
            "v": v,
        })
    figure.add_glyph(source, glyph)

    document = bokeh.plotting.curdoc()
    document.add_root(figure)
    # document.add_periodic_callback(periodic(source), 200)


def periodic(source, simulate="rotation"):
    @util.timed
    def callback():
        x = source.data["x"]
        y = source.data["y"]
        u = source.data["u"]
        v = source.data["v"]
        if simulate == "rotation":
            u, v = rotate_winds(u, v, np.pi / 4)
        else:
            x, y, u, v = forecast(x, y, u, v)
        source.data = {
            "x": x,
            "y": y,
            "u": u,
            "v": v
        }
    return callback


def rotate_winds(u, v, angle):
    up = (u * np.cos(angle)) - (v * np.sin(angle))
    vp = (u * np.sin(angle)) + (v * np.cos(angle))
    return up, vp


def forecast(x, y, u, v):
    return x, y, u + dydx(u), v + dydx(v)


def dydx(u):
    du = np.empty(u.shape)
    du[-1] = u[0] - u[-1]
    du[:-1] = u[1:] - u[:-1]
    return du


if __name__ == '__main__' or __name__.startswith('bk'):
    main()
