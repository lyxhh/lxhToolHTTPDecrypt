# - * - coding:utf-8 - * -
import logging
from colorlog import ColoredFormatter


def setup_logger():
    """Return a logger with a default ColoredFormatter."""
    formatter = ColoredFormatter(
        "%(white)s[%(cyan)s%(asctime)s%(white)s] %(white)s[%(log_color)s%(levelname)s%(white)s]%(reset)s %(message)s",
        datefmt="%H:%M:%S",
        reset=True,
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "white,bg_red",
        }
    )

    logger = logging.getLogger('example')
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)

    return logger

logger = setup_logger()

# def main():
#     """Create and use a logger."""
#     logger = setup_logger()
#     logger.debug('a debug message')
#     logger.info('an info message')
#     logger.info('aaaaan info message')
#     logger.warning('a warning message')
#     logger.error('an error message')
#     logger.critical('a critical message')
#
#
# if __name__ == '__main__':
#     main()