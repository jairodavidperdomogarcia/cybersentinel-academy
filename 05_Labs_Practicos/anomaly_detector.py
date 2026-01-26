import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import warnings

warnings.filterwarnings('ignore')


class CyberSentinelAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(
            contamination=0.01,
            random_state=42,
            n_estimators=100,
        )
        self.features = ['connections', 'unique_destinations', 'total_volume_mb']

    def train(self, normal_data_path):
        print("[+] Entrenando detector con tráfico normal...")
        df = pd.read_csv(normal_data_path)
        df_normal = df[df['label'] == 'normal']
        X_train = df_normal[self.features]
        self.model.fit(X_train)
        print(f"[+] Modelo entrenado con {len(X_train)} muestras normales")

    def detect(self, traffic_data_path):
        print("\n[+] Analizando tráfico en busca de anomalías...")
        df = pd.read_csv(traffic_data_path)
        predictions = self.model.predict(df[self.features])
        df['anomaly_score'] = self.model.decision_function(df[self.features])
        df['is_anomaly'] = predictions == -1

        normal_count = (df['is_anomaly'] == False).sum()
        anomaly_count = (df['is_anomaly'] == True).sum()

        print("\n📊 RESULTADOS DEL ANÁLISIS:")
        print(f"   Tráfico normal: {normal_count} registros")
        print(f"   ANOMALÍAS detectadas: {anomaly_count} registros")

        if anomaly_count > 0:
            print("\n🚨 ALERTA CYBERSENTINEL - POSIBLE EXFILTRACIÓN DETECTADA")
            anomalies = df[df['is_anomaly'] == True]
            for idx, row in anomalies.iterrows():
                print(f"\n   ⚠️  Registro {idx}:")
                print(f"      Hora: {row['timestamp']}")
                print(f"      Conexiones: {row['connections']} (inusualmente alto)")
                print(f"      Destinos únicos: {row['unique_destinations']}")
                print(f"      Volumen: {row['total_volume_mb']} MB")
                print(f"      Puntaje de anomalía: {row['anomaly_score']:.3f}")
                if row['total_volume_mb'] > 400 and row['is_work_hour'] == 0:
                    print("      🚨 CRÍTICO: Posible exfiltración masiva fuera de horario!")

        return df


if __name__ == "__main__":
    print("=" * 60)
    print("CYBERSENTINEL - DETECTOR DE ANOMALÍAS (CAPÍTULO 10)")
    print("Caso TJX: Detectando Exfiltración Silenciosa")
    print("=" * 60)

    detector = CyberSentinelAnomalyDetector()
    detector.train('trafico_normal.csv')
    results = detector.detect('trafico_completo.csv')
    results.to_csv('resultados_deteccion.csv', index=False)
    print("\n[+] Reporte guardado en 'resultados_deteccion.csv'")