from typing import Tuple

import numpy as np
from PIL import Image

__all__ = ["IMG_SIZE", "preprocess", "softmax"]

IMG_SIZE: int = 224


def preprocess(path: str) -> np.ndarray:
    """Load *path* image and produce a normalised CHW float32 array.

    The transformation mirrors the preprocessing used during training:
    1. Convert to RGB.
    2. Resize to 224×224 bilinearly.
    3. Scale to [0, 1] and normalise with mean=std=0.5.

    Returns
    -------
    np.ndarray
        Array of shape *(1, 3, IMG_SIZE, IMG_SIZE)*, dtype *float32*.
    """
    img = Image.open(path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32) / 255.0  # range 0–1
    arr = arr.transpose(2, 0, 1)[None, ...]  # (1, 3, H, W)

    mean = np.array([0.5, 0.5, 0.5], dtype=np.float32)[:, None, None]
    std = np.array([0.5, 0.5, 0.5], dtype=np.float32)[:, None, None]

    return (arr - mean) / std


def softmax(logits: np.ndarray, axis: int = 1) -> np.ndarray:
    """Numerically-stable softmax."""
    # 1. Shift by max for stability
    shift = logits - np.max(logits, axis=axis, keepdims=True)
    exps = np.exp(shift)
    sums = np.sum(exps, axis=axis, keepdims=True)
    return exps / sums 