import bokeh.models
from bokeh.core.properties import DistanceSpec


class Barbs(bokeh.models.Marker):
    __implementation__ = "wind.ts"
    u = DistanceSpec(units_default="screen")
    v = DistanceSpec(units_default="screen")
