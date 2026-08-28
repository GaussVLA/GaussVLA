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
@article{sarowar2026gaussvla,
  title   = {GaussVLA: Geometry-Aware Spatial Reasoning for Vision-Language-Action Model},
  author  = {Sarowar, Md Selim and Islam, Md Tanvir and Kim, Sungho and Ahn, Sangtae},
  journal = {arXiv preprint arXiv:2608.24959},
  year    = {2026},
  url     = {https://arxiv.org/abs/2608.24959}
}
```

Page template adapted from [Nerfies](https://nerfies.github.io), licensed
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
