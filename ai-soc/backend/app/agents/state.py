from typing import TypedDict

class IncidentState(TypedDict):
    raw_log: str
    severity: str
    extracted_ip: str
    enrichment_context: str
    proposed_action: str
