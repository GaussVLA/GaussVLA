# GaussVLA: Geometry-Aware Spatial Reasoning for Vision-Language-Action Models

Project page for **GaussVLA** (BMVC 2026).

- **Paper:** https://arxiv.org/abs/2608.24959 (includes the supplementary material)
- **OpenReview:** https://openreview.net/forum?id=IYv9sR4feE
- **Project page:** https://gaussvla.github.io/GaussVLA/

GaussVLA is a Mamba-based VLA with two modules: a **Gaussian Spatial Tokenizer (GST)** that lifts frozen
semantic and depth features into compact 3D Gaussian tokens, and a **Depth-Aware Chain-of-Thought (DA-CoT)**
that performs non-autoregressive geometric reasoning. It reaches 93.5% average and 100.0% Spatial success on
LIBERO with 200M trainable parameters.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html              # the whole page
static/css/index.css    # theme + interactive component styles
static/js/index.js      # nav, tabs, sortable table, ablation builder, lightbox
static/images/          # figures
static/videos/          # teaser and rollout clips
```

## Citation

```bibtex
@inproceedings{Sarowar_2026_BMVC,
author    = {Md Selim Sarowar and Md Tanvir Islam and Sungho Kim and Sangtae Ahn},
title     = {GaussVLA: Geometry-Aware Spatial Reasoning for Vision-Language-Action Model},
booktitle = {37th British Machine Vision Conference 2026, {BMVC} 2026, Lancaster, UK, November 23-26, 2026},
publisher = {BMVA},
year      = {2026},
url       = {https://bmva-archive.org.uk/bmvc/2026/assets/papers/Paper_121/paper.pdf}
}
```

Page template adapted from [Nerfies](https://nerfies.github.io), licensed
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
