from pathlib import Path
from typing import Dict, List

import onnxruntime as ort
import numpy as np

from .preprocess import preprocess, softmax

__all__ = ["FingerClassifier"]


class FingerClassifier:
    """Wrap an *onnxruntime* session for fingerprint classification."""

    CLASS_MAP: Dict[str, int] = {
        "plain Arch": 0,
        "Tented Arch": 1,
        "Right Loop": 2,
        "Left Loop": 3,
        "Whorl": 4,
    }
    INDEX_TO_CLASS: Dict[int, str] = {v: k for k, v in CLASS_MAP.items()}

    def __init__(self, onnx_path: Path | str):
        onnx_path = Path(onnx_path)
        if not onnx_path.exists():
            raise FileNotFoundError(f"ONNX model not found: {onnx_path}")
        self.session = ort.InferenceSession(str(onnx_path))
        self.input_name = self.session.get_inputs()[0].name

    # ---------------------------------------------------------------------
    # Public API
    # ---------------------------------------------------------------------

    def predict_proba(self, image_path: str) -> np.ndarray:
        """Return class probabilities for *image_path*."""
        x = preprocess(image_path)
        outputs = self.session.run(None, {self.input_name: x})
        logits = outputs[0]
        # Robust: if logits has batch dim, remove it
        probs = softmax(logits, axis=1)
        return probs.squeeze(0)  # shape (C,)

    def predict(self, image_path: str) -> str:
        """Return the most probable class label."""
        probs = self.predict_proba(image_path)
        index = int(np.argmax(probs))
        return self.INDEX_TO_CLASS.get(index, "Unknown")

    # -----------------------------------------------------------------
    # Ridge-count regression
    # -----------------------------------------------------------------

    def predict_ridge_count(self, image_path: str) -> float:
        """Predict ridge count for *image_path*."""
        x = preprocess(image_path)
        outputs = self.session.run(None, {self.input_name: x})
        # Regression output is assumed to be the second result
        if len(outputs) < 2:
            raise RuntimeError("ONNX model does not expose ridge_count output")
        ridge = float(outputs[1].squeeze())
        return ridge

    def analyse(self, image_path: str):
        """Full analysis returning label, ridge count, probability vector."""
        probs = self.predict_proba(image_path)
        label = self.INDEX_TO_CLASS.get(int(np.argmax(probs)), "Unknown")
        # attempt to get regression output
        try:
            ridge = self.predict_ridge_count(image_path)
        except Exception:
            ridge = 0.0
        return label, ridge, probs 