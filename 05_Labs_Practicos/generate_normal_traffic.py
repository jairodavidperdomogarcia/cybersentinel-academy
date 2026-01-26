import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)
dates = pd.date_range(start='2024-01-01', end='2024-01-30', freq='H')

data = []
for date in dates:
    is_work_hour = 9 <= date.hour <= 18
    base_connections = np.random.randint(1, 5)
    base_volume = np.random.randint(10, 100)

    if is_work_hour:
        connections = base_connections * 3
        volume = base_volume * 2
    else:
        connections = base_connections
        volume = base_volume

    destinations = ['192.168.10.5', '192.168.10.10', '192.168.10.15']

    data.append(
        {
            'timestamp': date,
            'connections': connections,
            'unique_destinations': 1,
            'total_volume_mb': volume,
            'is_work_hour': int(is_work_hour),
            'label': 'normal',
        }
    )

df_normal = pd.DataFrame(data)
df_normal.to_csv('trafico_normal.csv', index=False)
print(f"[+] Generados {len(df_normal)} registros de tráfico NORMAL")