import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from generate_normal_traffic import df_normal

attack_data = []

attack_date = datetime(2024, 1, 31, 2, 0, 0)

for hour in range(4):
    timestamp = attack_date + timedelta(hours=hour)

    attack_data.append(
        {
            'timestamp': timestamp,
            'connections': np.random.randint(100, 200),
            'unique_destinations': 5,
            'total_volume_mb': np.random.randint(500, 600),
            'is_work_hour': 0,
            'label': 'attack',
        }
    )

df_attack = pd.DataFrame(attack_data)

df_combined = pd.concat([df_normal, df_attack], ignore_index=True)
df_combined.to_csv('trafico_completo.csv', index=False)
print(f"[+] Datos combinados: {len(df_normal)} normales + {len(df_attack)} de ataque")