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
