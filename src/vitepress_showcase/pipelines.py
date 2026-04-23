"""Small pipeline primitives used by the docs site to demonstrate importing snippets."""

from collections.abc import Generator
from dataclasses import dataclass


# region Chunk
@dataclass(frozen=True)
class Chunk:
    """A slice of source text with position metadata for downstream indexing."""

    index: int
    text: str
    start: int
    end: int
# endregion Chunk


# region chunk_text
def chunk_text(
    source: str,
    *,
    size: int = 1_000,
    overlap: int = 100,
) -> Generator[Chunk, None, None]:
    """Split ``source`` into overlapping chunks of roughly ``size`` characters.

    Used to prepare documents for embedding into a vector store where the
    model has a bounded context window. Overlap keeps sentences that straddle
    chunk boundaries retrievable from either side — a retrieval query that
    matches the tail of chunk ``i`` will also match the head of chunk ``i+1``.

    The stride between chunks is ``size - overlap``. When ``size == overlap``
    the function would never advance, so ``overlap`` is required to be
    strictly less than ``size``.
    """
    if size <= 0:
        raise ValueError("size must be positive")
    if overlap < 0 or overlap >= size:
        raise ValueError("overlap must be in [0, size)")

    step = size - overlap
    for i, start in enumerate(range(0, len(source), step)):
        end = min(start + size, len(source))
        yield Chunk(index=i, text=source[start:end], start=start, end=end)
        if end == len(source):
            return
# endregion chunk_text
