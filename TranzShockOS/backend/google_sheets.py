import requests
from datetime import datetime

class TranzShockSheets:
    def __init__(self, sheet_id=None):
        self.mode = "sheetbest"
        self.base_url = f"https://sheet.best/api/sheets/{sheet_id}"

    def get_presupuestos(self, estado=None):
        try:
            response = requests.get(f"{self.base_url}/PRESUPUESTOS")
            data = response.json()
            if estado:
                data = [p for p in data if p.get('estado', '').lower() == estado.lower()]
            return data
        except:
            return []

    def add_presupuesto(self, cliente, equipo, problema, monto):
        nuevo = {
            'fecha': datetime.now().strftime('%d/%m/%Y'),
            'cliente': cliente,
            'equipo': equipo,
            'problema': problema,
            'monto': monto,
            'estado': 'pendiente',
            'agente': 'SISTEMA'
        }
        try:
            response = requests.post(f"{self.base_url}/PRESUPUESTOS", json=nuevo)
            return response.json()
        except:
            return {'error': 'Error al guardar'}

    def get_contabilidad(self):
        try:
            response = requests.get(f"{self.base_url}/CONTABILIDAD")
            return response.json()
        except:
            return []

    def get_contabilidad_hoy(self):
        data = self.get_contabilidad()
        hoy = datetime.now().strftime('%d/%m/%Y')
        ingresos = sum(float(d.get('ingreso', 0)) for d in data if d.get('fecha', '').startswith(hoy))
        egresos = sum(float(d.get('egreso', 0)) for d in data if d.get('fecha', '').startswith(hoy))
        return {
            'fecha': hoy,
            'ingresos': ingresos,
            'egresos': egresos,
            'balance': ingresos - egresos
        }

    def get_inventario(self):
        try:
            response = requests.get(f"{self.base_url}/INVENTARIO")
            return response.json()
        except:
            return []

    def check_inventario_bajo(self):
        data = self.get_inventario()
        alertas = []
        for item in data:
            try:
                stock = int(item.get('stock', 0))
                minimo = int(item.get('minimo', 0))
                if stock <= minimo:
                    alertas.append({
                        'producto': item.get('producto', 'N/A'),
                        'stock': stock,
                        'minimo': minimo
                    })
            except:
                continue
        return alertas