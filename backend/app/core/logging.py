import sys
import logging

from app.core.config import settings


def setup_logging() -> None:
    """Configure the root logger for the Apex-Kinematics Engine.

    - Sets log level to DEBUG when settings.DEBUG_MODE is True, else INFO.
    - Attaches a single StreamHandler that writes to sys.stdout.
    - Applies a strict formatter: [%(asctime)s] [%(levelname)s] [%(name)s] %(message)s
    - Idempotent: clears any existing root handlers before attaching to
      prevent duplicate log lines on repeated calls.
    """
    log_level = logging.DEBUG if settings.DEBUG_MODE else logging.INFO

    formatter = logging.Formatter(
        fmt="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s"
    )

    stream_handler = logging.StreamHandler(stream=sys.stdout)
    stream_handler.setLevel(log_level)
    stream_handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Clear pre-existing handlers to guarantee idempotency
    root_logger.handlers.clear()
    root_logger.addHandler(stream_handler)
