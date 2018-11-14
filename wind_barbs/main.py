import numpy as np
import bokeh.plotting
import bokeh.models
import wind
import time


def timed(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        duration = end - start
        print('function {} ran for {} seconds'.format(
            str(func), duration))
        return result
    return wrapper

figure = bokeh.plotting.figure(
            sizing_mode="stretch_both"
        )
glyph = wind.Barbs(x="x", y="y", u="u", v="v")
x = np.linspace(-30, 30, 40, dtype="f")
y = np.linspace(-30, 30, 40, dtype="f")
X, Y = np.meshgrid(x, y)
U = -15 * np.ones(X.shape)
V = 20 * np.exp(-(X**2 + Y**2) / 60) + 10 * np.sin((2 * np.pi * X) / 60)
source = bokeh.models.ColumnDataSource({
        "x": X.flatten(),
        "y": Y.flatten(),
        "u": U.flatten(),
        "v": V.flatten(),
    })
figure.add_glyph(source, glyph)

@timed
def periodic():
    global source
    x = source.data["x"]
    y = source.data["y"]
    u = source.data["u"]
    v = source.data["v"]
    simulate = "forecast"
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

def rotate_winds(u, v, angle):
    up = (u * np.cos(theta)) - (v * np.sin(theta))
    vp = (u * np.sin(theta)) + (v * np.cos(theta))
    return up, vp

def forecast(x, y, u, v):
    return x, y, u + dydx(u), v + dydx(v)

def dydx(u):
    du = np.empty(u.shape)
    du[-1] = u[0] - u[-1]
    du[:-1] = u[1:] - u[:-1]
    return du

document = bokeh.plotting.curdoc()
document.add_root(figure)
document.add_periodic_callback(periodic, 200)
