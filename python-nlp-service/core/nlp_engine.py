import logging
import os

logger = logging.getLogger(__name__)

NER_MODEL_NAME = os.getenv("NER_MODEL_NAME", "en_ner_bionlp13cg_md")

PHYSIOLOGICAL_LABELS = set(
    os.getenv("PHYSIOLOGICAL_LABELS", "DISEASE_OR_SYNDROME,PATHOLOGICAL_FORMATION").split(",")
)
CHEMICAL_LABELS = set(
    os.getenv("CHEMICAL_LABELS", "SIMPLE_CHEMICAL").split(",")
)

# ---------------------------------------------------------------------------
# Lazy-loaded spaCy model
# ---------------------------------------------------------------------------
_nlp = None
_load_attempted = False


def _get_nlp():
    global _nlp, _load_attempted
    if _load_attempted:
        return _nlp
    _load_attempted = True
    try:
        import spacy
    except ImportError:
        logger.warning(
            "spaCy not installed. NER will be skipped. "
            "Install: pip install spacy"
        )
        return None
    try:
        _nlp = spacy.load(NER_MODEL_NAME)
        logger.info("NLP model '%s' loaded.", NER_MODEL_NAME)
    except OSError:
        logger.exception(
            "Could not load '%s'. Install scispaCy models from "
            "https://allenai.github.io/scispacy/ — e.g.:\n"
            "  pip install https://s3-us-west-2.amazonaws.com/ai2-s3-scispacy"
            "/releases/v0.5.4/en_ner_bionlp13cg_md-0.5.4.tar.gz",
            NER_MODEL_NAME,
        )
        _nlp = None
    return _nlp


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def is_ner_available() -> bool:
    return _get_nlp() is not None


def deduplicate_entities(entities: list) -> list:
    """
    Deduplicate a list of (entity_text, source_filename, page_number) tuples.
    Key is all three fields — safe to use on mixed-file lists.
    """
    seen = set()
    unique = []
    for entry in entities:
        key = (entry[0], entry[1], entry[2])  # text + source + page
        if key not in seen:
            unique.append(entry)
            seen.add(key)
    return unique


def extract_entities(text: str, source: str, page_num: int) -> dict:
    """
    Run biomedical NER over text and return a dict with three keys:
        physiological_conditions : list of (text, source, page)
        potential_allergies      : list of (text, source, page)
        potential_medications    : list of (text, source, page)

    Chemicals appear in BOTH allergy and medication lists — they're
    structurally ambiguous at this stage. Pass both lists to your LLM
    with explicit disambiguation instructions.

    Returns empty lists for all keys if the model isn't available.
    """
    result = {
        "physiological_conditions": [],
        "potential_allergies": [],
        "potential_medications": [],
    }

    nlp = _get_nlp()
    if nlp is None:
        return result

    doc = nlp(text)
    for ent in doc.ents:
        entry = (ent.text, source, page_num)
        if ent.label_ in PHYSIOLOGICAL_LABELS:
            result["physiological_conditions"].append(entry)
        elif ent.label_ in CHEMICAL_LABELS:
            result["potential_allergies"].append(entry)
            result["potential_medications"].append(entry)

    return result