import argparse
import sys

def generate_specialization_plan(favorite_projects):
    """Genera plan de especialización basado en proyectos favoritos."""
    
    # Base de conocimiento de rutas de especialización (Volumen 2)
    plans = {
        "automantufact": {
            "volume2_section": "Robótica y Sistemas Autónomos (Sección A)",
            "next_certifications": ["GICSP (Global Industrial Cyber Security Professional)", "ISA/IEC 62443"],
            "portfolio_additions": [
                "Industrial network analysis (Modbus/DNP3)",
                "PLC security assessment methodology",
                "OT incident response plan simulation"
            ],
            "target_roles": ["OT Security Engineer", "ICS Security Specialist", "SCADA Analyst"],
            "companies": ["Siemens", "Rockwell Automation", "Schneider Electric", "Critical Infrastructure Providers"],
            "rationale": "Te gusta la intersección entre lo digital y lo físico. Entiendes que un 'ping' puede detener una fábrica."
        },
        "meditech": {
            "volume2_section": "Dispositivos Médicos e IoMT (Sección B)",
            "next_certifications": ["HCISPP (Healthcare Information Security and Privacy Practitioner)", "Medical Device Security Specialist"],
            "portfolio_additions": [
                "HIPAA compliance assessment framework",
                "IoMT device security review (Pacemaker/Insulin Pump sim)",
                "Healthcare breach response plan"
            ],
            "target_roles": ["Healthcare Security Specialist", "IoMT Security Engineer", "Biomedical Cyber Analyst"],
            "companies": ["Philips Healthcare", "GE Healthcare", "Abbott", "Hospital Networks"],
            "rationale": "Valoras el impacto humano directo. Entiendes que la seguridad aquí es literalmente de vida o muerte."
        },
        "techsafelock": {
            "volume2_section": "Sector Financiero y Fintech (Sección E)",
            "next_certifications": ["PCIP (PCI Professional)", "CISM (Certified Information Security Manager)"],
            "portfolio_additions": [
                "PCI-DSS compliance mapping",
                "Secure API Gateway architecture for Banking",
                "Fraud detection algorithms (ML based)"
            ],
            "target_roles": ["Fintech Security Architect", "Financial Security Consultant", "Payment Security Specialist"],
            "companies": ["Stripe", "Revolut", "Major Banks", "Visa/Mastercard"],
            "rationale": "Te mueves bien en entornos de alta regulación y alta velocidad. Entiendes el riesgo financiero como nadie."
        }
    }
    
    # Lógica de fallback y selección
    selected_plan = plans.get(favorite_projects.lower())
    
    if not selected_plan:
        return None
        
    return selected_plan

def main():
    parser = argparse.ArgumentParser(description="CyberSentinel Specialization Planner (Vol 1 -> Vol 2)")
    parser.add_argument("--project", type=str, required=True, 
                        choices=["automantufact", "meditech", "techsafelock"],
                        help="Tu proyecto favorito del Volumen 1: 'automantufact' (Cap 6), 'techsafelock' (Cap 7), o 'meditech' (Cap 7)")
    
    args = parser.parse_args()
    
    plan = generate_specialization_plan(args.project)
    
    if plan:
        print(f"\n🚀 PLAN ESTRATÉGICO GENERADO: {plan['volume2_section']}\n")
        print(f"💡 Razón: {plan['rationale']}\n")
        print("🎓 Próximas Certificaciones Recomendadas:")
        for cert in plan['next_certifications']:
            print(f"  - {cert}")
            
        print("\n📂 Adiciones Críticas al Portafolio:")
        for item in plan['portfolio_additions']:
            print(f"  - {item}")
            
        print("\n🎯 Roles Objetivo:")
        print(f"  {', '.join(plan['target_roles'])}")
        
        print("\n🏢 Empresas Objetivo:")
        print(f"  {', '.join(plan['companies'])}")
        print("\n" + "="*50 + "\n")
    else:
        print("Error: Proyecto no reconocido. Usa --help para ver las opciones.")

if __name__ == "__main__":
    main()