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
U = X
V = Y
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
    theta = np.pi / 4
    up = (u * np.cos(theta)) - (v * np.sin(theta))
    vp = (u * np.sin(theta)) + (v * np.cos(theta))
    source.data = {
        "x": x,
        "y": y,
        "u": up,
        "v": vp
    }

document = bokeh.plotting.curdoc()
document.add_root(figure)
document.add_periodic_callback(periodic, 200)
