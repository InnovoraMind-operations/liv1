import json
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from .state import IncidentState

# Initialize LLM
llm = ChatGroq(model_name="openai/gpt-oss-120b", temperature=0)

def triage_node(state: IncidentState) -> IncidentState:
    prompt = PromptTemplate.from_template(
        "Analyze the following security log and extract the severity (critical, high, medium, low) and any IP address found in it.\n"
        "Respond STRICTLY with a valid JSON object containing exactly two keys: 'severity' and 'extracted_ip'. Do not include markdown code blocks or any other text.\n\n"
        "Log:\n{raw_log}"
    )
    chain = prompt | llm
    result = chain.invoke({"raw_log": state["raw_log"]})
    
    content = result.content.strip()
    # Attempt to strip markdown formatting if the model disobeys instructions
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
        
    if content.endswith("```"):
        content = content[:-3]
        
    content = content.strip()

    try:
        parsed = json.loads(content)
        return {
            "severity": parsed.get("severity", "unknown"),
            "extracted_ip": parsed.get("extracted_ip", "none")
        }
    except json.JSONDecodeError:
        return {
            "severity": "unknown",
            "extracted_ip": "none"
        }

def enrichment_node(state: IncidentState) -> IncidentState:
    ip = state.get("extracted_ip", "none")
    # Mock Threat Intel check
    mock_ti = {
        "192.168.1.100": "Known internal scanner",
        "10.0.0.5": "Suspicious brute-force origin, flagged in 3 databases",
        "185.22.14.9": "Known malicious C2 server",
    }
    
    if ip == "none":
        context = "No IP extracted to enrich."
    else:
        context = mock_ti.get(ip, f"No known threat intelligence for {ip}.")
        
    return {"enrichment_context": context}

def mitigation_node(state: IncidentState) -> IncidentState:
    prompt = PromptTemplate.from_template(
        "You are a Tier 2 SOC Analyst. Review the following incident details and propose a specific bash command to mitigate the threat (e.g., an iptables or ufw rule to block the IP). If no action is needed, output 'No action required.'\n"
        "Only output the raw bash command.\n\n"
        "Raw Log: {raw_log}\n"
        "Severity: {severity}\n"
        "Enrichment Context: {enrichment_context}"
    )
    chain = prompt | llm
    result = chain.invoke({
        "raw_log": state.get("raw_log", ""),
        "severity": state.get("severity", ""),
        "enrichment_context": state.get("enrichment_context", "")
    })
    
    return {"proposed_action": result.content.strip()}

# Build the Graph
workflow = StateGraph(IncidentState)

# Add nodes
workflow.add_node("triage", triage_node)
workflow.add_node("enrichment", enrichment_node)
workflow.add_node("mitigation", mitigation_node)

# Add edges
workflow.add_edge(START, "triage")
workflow.add_edge("triage", "enrichment")
workflow.add_edge("enrichment", "mitigation")
workflow.add_edge("mitigation", END)

# Compile graph
soc_graph = workflow.compile()
