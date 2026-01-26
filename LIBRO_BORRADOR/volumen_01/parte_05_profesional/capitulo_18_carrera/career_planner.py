import argparse
import json
from pathlib import Path
from typing import List, Dict, Any, Tuple


def load_offers(path: Path) -> List[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("El archivo JSON debe contener una lista de ofertas.")
    return data


def normalize_salary(offers: List[Dict[str, Any]]) -> Dict[str, float]:
    salaries: List[Tuple[str, float]] = []
    for offer in offers:
        name = str(offer.get("name", "sin_nombre"))
        salary_value = offer.get("salary")
        if isinstance(salary_value, (int, float)):
            salaries.append((name, float(salary_value)))
    if not salaries:
        return {}
    max_salary = max(v for _, v in salaries)
    if max_salary <= 0:
        return {name: 0.0 for name, _ in salaries}
    return {name: value / max_salary for name, value in salaries}


def scale_01(value: Any, max_value: float = 5.0) -> float:
    if isinstance(value, (int, float)):
        v = float(value)
        if v <= 0:
            return 0.0
        if v >= max_value:
            return 1.0
        return v / max_value
    return 0.0


def score_offer(
    offer: Dict[str, Any],
    salary_norm: Dict[str, float],
    compensation_weight: float,
    growth_weight: float,
    alignment_weight: float,
    lifestyle_weight: float,
) -> Dict[str, Any]:
    name = str(offer.get("name", "sin_nombre"))
    salary_score = salary_norm.get(name, 0.0)

    learning = scale_01(offer.get("learning"))
    impact = scale_01(offer.get("impact"))
    growth_score = (learning + impact) / 2.0

    alignment_score = scale_01(offer.get("alignment"))
    lifestyle_score = scale_01(offer.get("lifestyle"))

    total = (
        compensation_weight * salary_score
        + growth_weight * growth_score
        + alignment_weight * alignment_score
        + lifestyle_weight * lifestyle_score
    )

    return {
        "name": name,
        "total_score": round(total, 3),
        "salary_score": round(salary_score, 3),
        "growth_score": round(growth_score, 3),
        "alignment_score": round(alignment_score, 3),
        "lifestyle_score": round(lifestyle_score, 3),
        "raw": offer,
    }


def plan_from_file(
    offers_path: Path,
    compensation_weight: float,
    growth_weight: float,
    alignment_weight: float,
    lifestyle_weight: float,
) -> List[Dict[str, Any]]:
    offers = load_offers(offers_path)
    salary_norm = normalize_salary(offers)
    scored: List[Dict[str, Any]] = []
    for offer in offers:
        scored.append(
            score_offer(
                offer=offer,
                salary_norm=salary_norm,
                compensation_weight=compensation_weight,
                growth_weight=growth_weight,
                alignment_weight=alignment_weight,
                lifestyle_weight=lifestyle_weight,
            )
        )
    scored.sort(key=lambda x: x["total_score"], reverse=True)
    return scored


def print_plan(scored_offers: List[Dict[str, Any]]) -> None:
    if not scored_offers:
        print("No se encontraron ofertas para evaluar.")
        return
    print("== Ranking de ofertas de carrera ==")
    for idx, item in enumerate(scored_offers, start=1):
        raw = item["raw"]
        role = raw.get("role", "")
        location = raw.get("location", "")
        name_line = f"{idx}. {item['name']}"
        if role:
            name_line += f" ({role})"
        if location:
            name_line += f" - {location}"
        print(name_line)
        print(f"   Puntuación total: {item['total_score']}")
        print(
            f"   Compensación: {item['salary_score']}, "
            f"Crecimiento: {item['growth_score']}, "
            f"Alineación: {item['alignment_score']}, "
            f"Estilo de vida: {item['lifestyle_score']}"
        )
        salary_value = raw.get("salary")
        if salary_value is not None:
            print(f"   Salario estimado: {salary_value}")
        notes = raw.get("notes")
        if notes:
            print(f"   Notas: {notes}")
        print()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluador de ofertas de carrera basado en tu portafolio CyberSentinel."
    )
    parser.add_argument(
        "--offers-file",
        type=str,
        required=True,
        help="Ruta a archivo JSON con la lista de ofertas.",
    )
    parser.add_argument(
        "--compensation-weight",
        type=float,
        default=0.3,
        help="Peso de la compensación económica (0–1).",
    )
    parser.add_argument(
        "--growth-weight",
        type=float,
        default=0.3,
        help="Peso del crecimiento profesional (0–1).",
    )
    parser.add_argument(
        "--alignment-weight",
        type=float,
        default=0.3,
        help="Peso de la alineación con tu especialización y valores (0–1).",
    )
    parser.add_argument(
        "--lifestyle-weight",
        type=float,
        default=0.1,
        help="Peso del estilo de vida (remoto, horarios, viajes).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    offers_path = Path(args.offers_file)
    if not offers_path.exists():
        raise SystemExit(f"No se encontró el archivo de ofertas: {offers_path}")

    total_weight = (
        args.compensation_weight
        + args.growth_weight
        + args.alignment_weight
        + args.lifestyle_weight
    )
    if total_weight <= 0:
        raise SystemExit("La suma de los pesos debe ser mayor que cero.")

    compensation_weight = args.compensation_weight / total_weight
    growth_weight = args.growth_weight / total_weight
    alignment_weight = args.alignment_weight / total_weight
    lifestyle_weight = args.lifestyle_weight / total_weight

    scored_offers = plan_from_file(
        offers_path=offers_path,
        compensation_weight=compensation_weight,
        growth_weight=growth_weight,
        alignment_weight=alignment_weight,
        lifestyle_weight=lifestyle_weight,
    )
    print_plan(scored_offers)


if __name__ == "__main__":
    main()