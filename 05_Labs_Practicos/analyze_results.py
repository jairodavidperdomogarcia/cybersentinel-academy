import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('resultados_deteccion.csv')

plt.figure(figsize=(12, 6))

df['timestamp'] = pd.to_datetime(df['timestamp'])

plt.subplot(2, 1, 1)
plt.plot(df['timestamp'], df['total_volume_mb'], 'b-', alpha=0.6, label='Tráfico Normal')
anomalies = df[df['is_anomaly'] == True]
plt.scatter(
    anomalies['timestamp'],
    anomalies['total_volume_mb'],
    color='red',
    s=100,
    zorder=5,
    label='ANOMALÍA (Posible Ataque)',
)
plt.axhline(y=400, color='orange', linestyle='--', label='Umbral Crítico (400MB)')
plt.ylabel('Volumen (MB)')
plt.title('CYBERSENTINEL - Detección de Exfiltración TJX')
plt.legend()
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(df['timestamp'], df['anomaly_score'], 'g-', alpha=0.6)
plt.scatter(
    anomalies['timestamp'],
    anomalies['anomaly_score'],
    color='red',
    s=100,
    zorder=5,
)
plt.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
plt.fill_between(
    df['timestamp'],
    0,
    df['anomaly_score'],
    where=(df['anomaly_score'] < 0),
    color='red',
    alpha=0.3,
)
plt.ylabel('Puntaje de Anomalía')
plt.xlabel('Fecha y Hora')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('detection_tjx_anomalies.png', dpi=300)
print("[+] Gráfico generado: 'detection_tjx_anomalies.png'")

print("\n🔍 ANÁLISIS DEL CAZADOR:")
print("-" * 40)

attack_rows = df[df['label'] == 'attack']
detected_attacks = attack_rows[attack_rows['is_anomaly'] == True]

print(f"ATAQUES simulados: {len(attack_rows)}")
print(f"ATAQUES detectados: {len(detected_attacks)}")
print(f"Tasa de detección: {len(detected_attacks)/len(attack_rows)*100:.1f}%")

false_positives = df[(df['label'] == 'normal') & (df['is_anomaly'] == True)]
print(f"\nFalsos positivos: {len(false_positives)}")
print(f"Tasa de falsos positivos: {len(false_positives)/len(df)*100:.2f}%")

if len(false_positives) > 0:
    print("\n⚠️  FALSOS POSITIVOS a investigar:")
    for _, fp in false_positives.iterrows():
        print(f"   • {fp['timestamp']}: {fp['connections']} conexiones, {fp['total_volume_mb']}MB")