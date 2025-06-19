from collections import OrderedDict
from typing import Union, Tuple

import torch
import torch.nn as nn
from torchvision.models import mobilenet_v2


class MobileNetMultiTask(nn.Module):
    """MobileNet-V2 backbone with two heads:

    1. *Classification head* – predicts one of *num_classes* categories.
    2. *Ridge-count regression head* – predicts a single scalar value.

    A dropout layer is added before the heads for regularisation.
    """

    def __init__(self, num_classes: int = 12, dropout_rate: float = 0.5):
        super().__init__()
        # Load the ImageNet-pre-trained MobileNet-V2 backbone
        self.base_model = mobilenet_v2(weights="DEFAULT")

        # Number of features that come out of the backbone
        in_features = self.base_model.classifier[1].in_features

        # Remove the original classifier – we will provide our own heads
        self.base_model.classifier = nn.Identity()

        # Regularisation layer
        self.dropout = nn.Dropout(p=dropout_rate)

        # Heads
        self.class_head = nn.Linear(in_features, num_classes)
        self.ridge_head = nn.Linear(in_features, 1)

    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """Return *logits* for classification and *ridge-count* prediction."""
        features = self.base_model(x)
        features = self.dropout(features)
        class_logits = self.class_head(features)
        ridge_output = self.ridge_head(features).squeeze(1)  # shape: [B]
        return class_logits, ridge_output


# -----------------------------------------------------------------------------
# Helper utilities
# -----------------------------------------------------------------------------

def load_checkpoint(
    checkpoint_path: str,
    num_classes: int = 12,
    device: Union[str, torch.device] = "cpu",
) -> nn.Module:
    """Load a *MobileNetMultiTask* model from *checkpoint_path*.

    The function automatically removes a leading ``module.`` prefix if the
    weights were saved from a ``nn.DataParallel`` model.
    """
    device = torch.device(device)
    model = MobileNetMultiTask(num_classes=num_classes)
    model.to(device)

    state_dict = torch.load(checkpoint_path, map_location=device)
    # Remove "module." prefix if present (from DataParallel)
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = k[7:] if k.startswith("module.") else k
        new_state_dict[name] = v

    model.load_state_dict(new_state_dict, strict=False)
    model.eval()
    return model 