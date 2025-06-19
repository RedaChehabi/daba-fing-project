from pathlib import Path
from typing import Union

import torch
from torch import nn

__all__ = ["save_onnx"]


def save_onnx(model: nn.Module, model_path: Union[str, Path]) -> None:
    """Export *model* to ONNX format.

    Parameters
    ----------
    model : nn.Module
        A *torch* model (optionally wrapped in ``nn.DataParallel``) already moved
        to the correct device.
    model_path : str or pathlib.Path
        Destination ``.onnx`` filename.
    """
    model_path = Path(model_path)

    # 1) Ensure *eval* mode and unwrap DataParallel
    model = model.module if isinstance(model, torch.nn.DataParallel) else model
    model.eval()

    # 2) Dummy input reflecting the training dimensions (1 × 3 × 224 × 224)
    device = next(model.parameters()).device
    dummy_input = torch.randn(1, 3, 224, 224, device=device)

    # 3) Export
    torch.onnx.export(
        model,
        dummy_input,
        str(model_path),
        export_params=True,  # store weights inside the file
        opset_version=17,
        do_constant_folding=True,
        input_names=["input"],
        output_names=["class_logits", "ridge_out"],
        dynamic_axes={
            "input": {0: "batch"},
            "class_logits": {0: "batch"},
            "ridge_out": {0: "batch"},
        },
    )

    print(f"[ONNX] Saved model to {model_path}") 