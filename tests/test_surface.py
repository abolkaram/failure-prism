from pathlib import Path

SOURCE = (Path(__file__).parents[1] / "contracts" / "contract.py").read_text(encoding="utf-8")

def test_contract_surface():
    for method in ["open_prism", "probe", "apply_patch", "get_prism", "get_prisms_page", "get_summary"]:
        assert f"def {method}" in SOURCE

def test_guards_and_consensus_are_present():
    for guard in ["independent unused reviewer required", "threat categories must be unique", "run_nondet_unsafe", "requirement_indexes", "patch_failures"]:
        assert guard in SOURCE

def test_runner_is_pinned():
    assert SOURCE.startswith('# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }')
    assert "py-genlayer:test" not in SOURCE
