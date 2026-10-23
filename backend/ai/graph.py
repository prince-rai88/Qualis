import logging
from langgraph.graph import StateGraph, START, END
from backend.ai.state import RCAState
from backend.ai.nodes import (
    extraction_node,
    fishbone_node,
    five_whys_node,
    evidence_gap_node,
    capa_node
)

logger = logging.getLogger(__name__)

def create_rca_graph():
    """Builds and compiles the end-to-end Pharma RCA LangGraph."""
    workflow = StateGraph(RCAState)

    # Register Nodes
    workflow.add_node("extract", extraction_node)
    workflow.add_node("fishbone", fishbone_node)
    workflow.add_node("five_whys", five_whys_node)
    workflow.add_node("evidence_gap", evidence_gap_node)
    workflow.add_node("capa", capa_node)

    # Sequential edges with causal flow
    workflow.add_edge(START, "extract")
    workflow.add_edge("extract", "fishbone")
    workflow.add_edge("fishbone", "five_whys")
    workflow.add_edge("five_whys", "evidence_gap")
    workflow.add_edge("evidence_gap", "capa")
    workflow.add_edge("capa", END)

    app = workflow.compile()
    return app

rca_graph = create_rca_graph()

def run_full_rca_graph(initial_state: RCAState) -> RCAState:
    """Executes the full LangGraph pipeline."""
    try:
        final_state = rca_graph.invoke(initial_state)
        return final_state
    except Exception as e:
        logger.error(f"LangGraph execution error: {e}")
        raise e
